import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-team-creation',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './team-creation.component.html',
  styleUrls: ['./team-creation.component.css']
})
export class TeamCreationComponent {
  players: { myName: string, friendName: string }[] = [];
  playerCount: number = 0;
  tournamentCreated: boolean = false;
  errorMessage: string = '';

  constructor(private playerService: PlayerService) {}

  // Création du tournoi
  createTournament() {
    if (this.playerCount < 2 || this.playerCount % 2 !== 0) {
      alert('Le nombre de joueurs doit être un multiple de 2.');
      return;
    }

    this.playerService.createTournament('Tournoi Test', '2025-02-10', '2025-02-20')
      .subscribe(response => {
        console.log('Tournoi créé:', response);
        alert('Tournoi créé avec succès !');
        this.tournamentCreated = true; // Active la partie inscription
      });
  }

  // Enregistre une équipe
  registerMyTeam(myName: string, friendName: string): void {
    if (!myName || !friendName) {
      alert("Vous devez entrer votre nom et celui de votre coéquipier !");
      return;
    }

    this.players.push({ myName, friendName });
    console.log('Équipe enregistrée:', { myName, friendName });

    if (this.players.length * 2 >= this.playerCount) {
      alert('Toutes les équipes sont inscrites, lancement du tournoi !');
      this.startTournament();
    }
  }

  // Simulation de démarrage du tournoi
  startTournament() {
    console.log('Tournoi prêt à commencer avec les équipes:', this.players);
    alert('Le tournoi démarre avec toutes les équipes inscrites !');
  }
}
