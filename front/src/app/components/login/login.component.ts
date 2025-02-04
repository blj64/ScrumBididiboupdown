import { CommonModule, NgClass } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

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
      this.authService.loginJoueur(nomUtilisateur, motDePasse).subscribe({
        error: (error) => {
          this.errorMessage = error.error.detail || 'Erreur de connexion.';
        }
      });
    } else {
      this.authService.creerJoueur(nomUtilisateur, motDePasse).subscribe({
        error: (error) => {
          this.errorMessage = error.error.detail || 'Erreur lors de la création du compte.';
        }
      });
    }
  }
}