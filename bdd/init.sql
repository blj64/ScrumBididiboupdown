DROP DATABASE IF EXISTS Scrumbdd;
CREATE DATABASE Scrumbdd;
USE Scrumbdd;

-- Table des joueurs
CREATE TABLE Joueurs (
  idJoueur INT AUTO_INCREMENT PRIMARY KEY,
  nomUtilisateur VARCHAR(30) NOT NULL UNIQUE,
  motDePasse VARCHAR(100) NOT NULL
);

-- Table des équipes (chaque équipe est composée de 2 joueurs)
CREATE TABLE Equipes (
  idEquipe INT AUTO_INCREMENT PRIMARY KEY,
  nomEquipe VARCHAR(50) NOT NULL UNIQUE,
  joueur1 INT NOT NULL,
  joueur2 INT NOT NULL,
  FOREIGN KEY (joueur1) REFERENCES Joueurs(idJoueur) ON DELETE CASCADE,
  FOREIGN KEY (joueur2) REFERENCES Joueurs(idJoueur) ON DELETE CASCADE
);

-- Table des tournois
CREATE TABLE Tournois (
  idTournoi INT AUTO_INCREMENT PRIMARY KEY,
  nomTournoi VARCHAR(100) NOT NULL,
  dateDebut DATE NOT NULL,
  dateFin DATE NOT NULL
);

-- Table des matchs (stocke les matchs entre équipes)
CREATE TABLE Matchs (
  idMatch INT AUTO_INCREMENT PRIMARY KEY,
  idTournoi INT NOT NULL,
  equipe1 INT NOT NULL,
  equipe2 INT NOT NULL,
  scoreEquipe1 INT DEFAULT 0,
  scoreEquipe2 INT DEFAULT 0,
  gagnant INT DEFAULT NULL,  -- Stocke l'id de l'équipe gagnante
  FOREIGN KEY (idTournoi) REFERENCES Tournois(idTournoi) ON DELETE CASCADE,
  FOREIGN KEY (equipe1) REFERENCES Equipes(idEquipe) ON DELETE CASCADE,
  FOREIGN KEY (equipe2) REFERENCES Equipes(idEquipe) ON DELETE CASCADE,
  FOREIGN KEY (gagnant) REFERENCES Equipes(idEquipe) ON DELETE SET NULL
);

-- Table du classement des équipes dans un tournoi
CREATE TABLE Classement (
  idClassement INT AUTO_INCREMENT PRIMARY KEY,
  idTournoi INT NOT NULL,
  idEquipe INT NOT NULL,
  points INT DEFAULT 0,
  FOREIGN KEY (idTournoi) REFERENCES Tournois(idTournoi) ON DELETE CASCADE,
  FOREIGN KEY (idEquipe) REFERENCES Equipes(idEquipe) ON DELETE CASCADE
);

