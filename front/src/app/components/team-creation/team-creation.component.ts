import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';@Component({
  selector: 'app-team-creation',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './team-creation.component.html',
  styleUrl: './team-creation.component.css'
})
export class TeamCreationComponent {
  players = [
    'Jean-Michel Patate',
    'Serge le Lama',
    'Robert Cuillère',
    'Ginette Turbo',
    'Patrick Bingo',
    'Jacqueline Tornado',
    'Bernard Casse-Cou',
    'Kevin Choucroute',
    'Maurice Pastis',
    'Josiane Dynamite',
    'Alphonse Frometon',
    'Gertrude Missile',
    'Michel Tronçonneuse',
    'René Macaron',
    'Suzette Bagarre',
    'Norbert Explosion'
  ];
    selectedPlayers: string[] = Array(16).fill(null);
}
