from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Configuration de la base de données
DATABASE_URL = "mysql+mysqlconnector://user:1234567aA*@localhost/Scrumbdd"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modèle SQLAlchemy
class Joueur(Base):
    __tablename__ = "Joueurs"
    idJoueur = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nomUtilisateur = Column(String(30), nullable=False, unique=True)
    motDePasse = Column(String(50), nullable=False)

# Création des tables dans la base de données
Base.metadata.create_all(bind=engine)

# Initialisation de l'API FastAPI
app = FastAPI()

# Dépendance pour la session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Modèle Pydantic pour validation des entrées
from pydantic import BaseModel

class JoueurCreate(BaseModel):
    nomUtilisateur: str
    motDePasse: str

# Routes FastAPI
@app.post("/joueurs/", response_model=dict)
def creer_joueur(joueur: JoueurCreate, db: Session = Depends(get_db)):
    db_joueur = db.query(Joueur).filter(Joueur.nomUtilisateur == joueur.nomUtilisateur).first()
    if db_joueur:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà pris")
    new_joueur = Joueur(nomUtilisateur=joueur.nomUtilisateur, motDePasse=joueur.motDePasse)
    db.add(new_joueur)
    db.commit()
    db.refresh(new_joueur)
    return {"message": "Joueur créé avec succès", "id": new_joueur.idJoueur}

@app.get("/joueurs/", response_model=list)
def lister_joueurs(db: Session = Depends(get_db)):
    joueurs = db.query(Joueur).all()
    return [{"id": j.idJoueur, "nomUtilisateur": j.nomUtilisateur} for j in joueurs]

@app.get("/joueurs/{id_joueur}", response_model=dict)
def recuperer_joueur(id_joueur: int, db: Session = Depends(get_db)):
    joueur = db.query(Joueur).filter(Joueur.idJoueur == id_joueur).first()
    if not joueur:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    return {"id": joueur.idJoueur, "nomUtilisateur": joueur.nomUtilisateur}

@app.delete("/joueurs/{id_joueur}", response_model=dict)
def supprimer_joueur(id_joueur: int, db: Session = Depends(get_db)):
    joueur = db.query(Joueur).filter(Joueur.idJoueur == id_joueur).first()
    if not joueur:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    db.delete(joueur)
    db.commit()
    return {"message": "Joueur supprimé avec succès"}
