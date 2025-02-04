import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  user: any;
  profileForm: FormGroup;
  message = '';
  errorMessage = '';

  constructor(
    private authService: LoginService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      nomUtilisateur: ['', [Validators.required]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']); // Redirige si non connecté
    } else {
      this.profileForm.patchValue({
        nomUtilisateur: this.user.nomUtilisateur
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = "Veuillez remplir correctement les champs.";
      return;
    }

    const { nomUtilisateur, motDePasse } = this.profileForm.value;

    this.authService.updateProfile(this.user.id, nomUtilisateur, motDePasse).subscribe({
      next: () => {
        this.message = "Profil mis à jour avec succès !";
      },
      
    });
  }

  deleteAccount(): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      this.authService.deleteAccount(this.user.id).subscribe({
        next: () => {
          alert("Votre compte a été supprimé.");
        },
        
      });
    }
  }
}