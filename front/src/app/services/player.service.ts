import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apiUrl = 'http://127.0.0.1:8000'; // Base API URL

  constructor(private http: HttpClient) {}

  // Create a team
  createTeam(nomEquipe: string, joueur1: number, joueur2: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/equipes/`, { nomEquipe, joueur1, joueur2 });
  }

  // Create a tournament
  createTournament(nomTournoi: string, dateDebut: string, dateFin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tournois/`, { nomTournoi, dateDebut, dateFin });
  }
}
