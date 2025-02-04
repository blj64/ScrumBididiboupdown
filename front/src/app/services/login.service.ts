import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Joueur {
  id?: number;           // idJoueur
  nomUtilisateur: string;
  motDePasse: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = 'http://127.0.0.1:8000'; 
  // ou bien la machine/port où tourne votre API FastAPI

  constructor(private http: HttpClient) { }

  /**
   * Crée un joueur (inscription)
   */
  creerJoueur(nomUtilisateur: string, motDePasse: string): Observable<any> {
    const body = { nomUtilisateur, motDePasse };
    return this.http.post(`${this.baseUrl}/joueurs/`, body);
  }

  /**
   * Liste tous les joueurs
   */
  listerJoueurs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/joueurs/`);
  }

  /**
   * Récupère un joueur par son ID
   */
  recupererJoueur(idJoueur: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/joueurs/${idJoueur}`);
  }

  /**
   * Supprime un joueur par son ID
   */
  supprimerJoueur(idJoueur: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/joueurs/${idJoueur}`);
  }

  /**
   * Connexion d'un joueur
   */
  loginJoueur(nomUtilisateur: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, { nomUtilisateur, motDePasse });
  }
}