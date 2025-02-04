from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
import time

# Configuration de la base de données
DATABASE_URL = "mysql+mysqlconnector://user:password@db:3306/mydatabase"
def wait_for_db():
    while True:
        try:
            engine = create_engine(DATABASE_URL)
            connection = engine.connect()
            connection.close()
            print("✅ Database is ready!")
            break
        except Exception as e:
            print(f"⏳ Waiting for database... {e}")
            time.sleep(5)  # Attendre 5 secondes avant de réessayer

wait_for_db()

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modèles SQLAlchemy
class Joueur(Base):
    __tablename__ = "Joueurs"
    idJoueur = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nomUtilisateur = Column(String(30), nullable=False, unique=True)
    motDePasse = Column(String(50), nullable=False)

class Equipe(Base):
    __tablename__ = "Equipes"
    idEquipe = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nomEquipe = Column(String(50), nullable=False, unique=True)
    joueur1 = Column(Integer, ForeignKey("Joueurs.idJoueur"), nullable=False)
    joueur2 = Column(Integer, ForeignKey("Joueurs.idJoueur"), nullable=False)

class Tournoi(Base):
    __tablename__ = "Tournois"
    idTournoi = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nomTournoi = Column(String(100), nullable=False)
    dateDebut = Column(String(10), nullable=False)
    dateFin = Column(String(10), nullable=False)

class Match(Base):
    __tablename__ = "Matchs"
    idMatch = Column(Integer, primary_key=True, index=True, autoincrement=True)
    idTournoi = Column(Integer, ForeignKey("Tournois.idTournoi"), nullable=False)
    equipe1 = Column(Integer, ForeignKey("Equipes.idEquipe"), nullable=False)
    equipe2 = Column(Integer, ForeignKey("Equipes.idEquipe"), nullable=False)
    scoreEquipe1 = Column(Integer, default=0)
    scoreEquipe2 = Column(Integer, default=0)
    gagnant = Column(Integer, ForeignKey("Equipes.idEquipe"), nullable=True)

class Classement(Base):
    __tablename__ = "Classement"
    idClassement = Column(Integer, primary_key=True, index=True, autoincrement=True)
    idTournoi = Column(Integer, ForeignKey("Tournois.idTournoi"), nullable=False)
    idEquipe = Column(Integer, ForeignKey("Equipes.idEquipe"), nullable=False)
    points = Column(Integer, default=0)

# Création des tables dans la base de données
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Remplacez "*" par ["http://localhost:4200"] pour plus de sécurité
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permet tous les headers
)


# Dépendance pour la session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Modèles Pydantic
from pydantic import BaseModel

class JoueurCreate(BaseModel):
    nomUtilisateur: str
    motDePasse: str

class EquipeCreate(BaseModel):
    nomEquipe: str
    joueur1: int
    joueur2: int

class TournoiCreate(BaseModel):
    nomTournoi: str
    dateDebut: str
    dateFin: str

class MatchCreate(BaseModel):
    idTournoi: int
    equipe1: int
    equipe2: int

class ClassementCreate(BaseModel):
    idTournoi: int
    idEquipe: int
    points: int

class JoueurLogin(BaseModel):
    nomUtilisateur: str
    motDePasse: str

# 🔹 Endpoint de connexion
@app.post("/login/", response_model=dict)
def login_joueur(joueur: JoueurLogin, db: Session = Depends(get_db)):
    db_joueur = db.query(Joueur).filter(Joueur.nomUtilisateur == joueur.nomUtilisateur).first()
    
    if not db_joueur:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur incorrect")

    if db_joueur.motDePasse != joueur.motDePasse:
        raise HTTPException(status_code=400, detail="Mot de passe incorrect")

    return {"message": "Connexion réussie", "id": db_joueur.idJoueur, "nomUtilisateur": db_joueur.nomUtilisateur}

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

@app.post("/equipes/", response_model=dict)
def creer_equipe(equipe: EquipeCreate, db: Session = Depends(get_db)):
    new_equipe = Equipe(nomEquipe=equipe.nomEquipe, joueur1=equipe.joueur1, joueur2=equipe.joueur2)
    db.add(new_equipe)
    db.commit()
    db.refresh(new_equipe)
    return {"message": "Équipe créée avec succès", "id": new_equipe.idEquipe}

@app.post("/tournois/", response_model=dict)
def creer_tournoi(tournoi: TournoiCreate, db: Session = Depends(get_db)):
    new_tournoi = Tournoi(nomTournoi=tournoi.nomTournoi, dateDebut=tournoi.dateDebut, dateFin=tournoi.dateFin)
    db.add(new_tournoi)
    db.commit()
    db.refresh(new_tournoi)
    return {"message": "Tournoi créé avec succès", "id": new_tournoi.idTournoi}

@app.post("/matchs/", response_model=dict)
def creer_match(match: MatchCreate, db: Session = Depends(get_db)):
    new_match = Match(idTournoi=match.idTournoi, equipe1=match.equipe1, equipe2=match.equipe2)
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return {"message": "Match créé avec succès", "id": new_match.idMatch}

@app.post("/classement/", response_model=dict)
def creer_classement(classement: ClassementCreate, db: Session = Depends(get_db)):
    new_classement = Classement(idTournoi=classement.idTournoi, idEquipe=classement.idEquipe, points=classement.points)
    db.add(new_classement)
    db.commit()
    db.refresh(new_classement)
    return {"message": "Classement mis à jour", "id": new_classement.idClassement}
    
# Supprimer un compte
@app.delete("/joueurs/{id_joueur}")
def delete_joueur(id_joueur: int, db: Session = Depends(get_db)):
    joueur = db.query(Joueur).filter(Joueur.idJoueur == id_joueur).first()
    if not joueur:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    db.delete(joueur)
    db.commit()
    return {"message": "Compte supprimé avec succès"}
