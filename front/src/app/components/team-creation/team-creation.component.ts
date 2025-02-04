import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-creation',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './team-creation.component.html',
  styleUrls: ['./team-creation.component.css']
})
export class TeamCreationComponent {
  players = [
    "Jean Bonito", "Lucien Chien", "Maxime Dupont", "Léon Burger", "Jules Duvet", "Pierre Gagné",
    "Antoine Bateau", "Élodie Goudron", "Léo Gâteau", "Hugo Mouette", "Carla Lutin", "Paul Poisson",
    "Charlotte Canne", "Marc Lampe", "Louis Doudou", "Claire Râteau", "Quentin Camembert", "Alice Perron",
    "Florian Deschamps", "Nadine Chiffon", "Bernard Pompier", "Pauline Jouet", "Olivier Manteau", "Sophie Boudin",
    "Franck Mouche", "Isabelle Papillon", "Vincent Croissant", "Sophie Tarte", "Damien Trucmuche", "Audrey Cheval",
    "Thierry Grenouille", "Bernard Légume"
  ];
  
  // Create 16 teams (each with 2 players)
  selectedPlayers: string[] = Array(32).fill(null);
  teamNames: string[] = Array.from({ length: 16 }, (_, i) => `Team ${i + 1}`);
}
