import { CommonModule, NgClass } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  isLoginMode = true;
  authForm: FormGroup;
  message = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: LoginService
  ) {
    this.authForm = this.fb.group({
      nomUtilisateur: ['', [Validators.required]],
      motDePasse: ['', [Validators.required]]
    });
  }

  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.message = '';
    this.errorMessage = '';

    if (this.authForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    const { nomUtilisateur, motDePasse } = this.authForm.value;

    if (this.isLoginMode) {
      // Connexion
      this.authService.loginJoueur(nomUtilisateur, motDePasse).subscribe({
        next: (response) => {
          this.message = response.message + ' (ID=' + response.id + ')';
          localStorage.setItem('user', JSON.stringify(response));
        },
        error: (error) => {
          this.errorMessage = error.error.detail || 'Erreur de connexion.';
        }
      });
    } else {
      // Inscription
      this.authService.creerJoueur(nomUtilisateur, motDePasse).subscribe({
        next: (response) => {
          this.message = response.message + ' (ID=' + response.id + ')';
          this.authForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.error.detail || 'Erreur lors de la création du compte.';
        }
      });
    }
  }
}