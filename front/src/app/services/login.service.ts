import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private userSubject = new BehaviorSubject<any | null>(this.getUser());

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Crée un joueur (inscription) et connecte immédiatement
   */
  creerJoueur(nomUtilisateur: string, motDePasse: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.baseUrl}/joueurs/`, { nomUtilisateur, motDePasse }).subscribe({
        next: (response) => {
          console.log(response)
          const user = { id: response, nomUtilisateur };
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', JSON.stringify(user)); // ✅ Stockage session
          }
          this.userSubject.next(user); // ✅ Mise à jour de l'état
          this.router.navigate(['/']); // ✅ Redirection automatique
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Connexion d'un joueur et mise à jour de la session
   */
  loginJoueur(nomUtilisateur: string, motDePasse: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.baseUrl}/login/`, { nomUtilisateur, motDePasse }).subscribe({
        next: (response) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', JSON.stringify(response)); // ✅ Vérification
          }
          this.userSubject.next(response);
          observer.next(response);
          observer.complete();
          this.router.navigate(['/']); // ✅ Redirection automatique
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Modifier le profil de l'utilisateur
   */
  updateProfile(id: number, nomUtilisateur: string, motDePasse: string): Observable<any> {
    return new Observable(observer => {
      this.http.put(`${this.baseUrl}/joueurs/${id}`, { nomUtilisateur, motDePasse }).subscribe({
        next: (response) => {
          const updatedUser = { id, nomUtilisateur };
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', JSON.stringify(updatedUser)); // ✅ Mettre à jour la session
          }
          this.userSubject.next(updatedUser); // ✅ Notifier les autres composants
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Vérifier si un utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && sessionStorage.getItem('user') !== null;
  }

  /**
   * Récupérer les informations de l'utilisateur
   */
  getUser(): Joueur | null {
    if (typeof window === 'undefined') {
      return null; // ✅ Empêcher les erreurs côté serveur
    }
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Observable pour suivre l'état de connexion
   */
  getUserObservable(): Observable<Joueur | null> {
    return this.userSubject.asObservable();
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user'); // ✅ Vérification
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);

  }

}
