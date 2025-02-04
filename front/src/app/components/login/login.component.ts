import { CommonModule, NgClass } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Pour gérer le mode : login ou signup
  isLoginMode = true;

  // Formulaires réactifs
  loginForm: FormGroup;
  signupForm: FormGroup;

  // Objets qui stockeront les messages d'erreur, au lieu d'utiliser .invalid/.touched dans le template
  loginErrors = {
    email: '',
    password: ''
  };

  signupErrors = {
    lastName: '',
    firstName: '',
    email: '',
    password: ''
  };

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.signupForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Méthode pour basculer entre login et signup
  switchMode(): void {
    this.isLoginMode = !this.isLoginMode;
    // Optionnel : On peut réinitialiser les erreurs à chaque changement de mode
    this.loginErrors = { email: '', password: '' };
    this.signupErrors = { lastName: '', firstName: '', email: '', password: '' };
  }

  // Soumission du formulaire de connexion
  onLogin(): void {
    // Réinitialiser les messages d'erreur
    this.loginErrors = { email: '', password: '' };

    // Vérifier si le champ email est valide
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      this.loginErrors.email = 'Veuillez saisir votre email.';
    } else if (emailControl?.hasError('email')) {
      this.loginErrors.email = 'Format d’email invalide.';
    }

    // Vérifier si le champ mot de passe est valide
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      this.loginErrors.password = 'Veuillez saisir votre mot de passe.';
    }

    // Si le formulaire est valide (pas d’erreurs), on peut envoyer la requête
    if (this.loginForm.valid) {
      const email = emailControl?.value;
      const password = passwordControl?.value;
      console.log('Tentative de connexion :', { email, password });
      // TODO: Appeler votre service d’authentification HTTP, etc.
    }
  }

  // Soumission du formulaire de création de compte
  onSignup(): void {
    // Réinitialiser les messages d'erreur
    this.signupErrors = { lastName: '', firstName: '', email: '', password: '' };

    // lastName
    const lastNameControl = this.signupForm.get('lastName');
    if (lastNameControl?.hasError('required')) {
      this.signupErrors.lastName = 'Le nom est requis.';
    }

    // firstName
    const firstNameControl = this.signupForm.get('firstName');
    if (firstNameControl?.hasError('required')) {
      this.signupErrors.firstName = 'Le prénom est requis.';
    }

    // email
    const emailControl = this.signupForm.get('email');
    if (emailControl?.hasError('required')) {
      this.signupErrors.email = 'Veuillez saisir votre email.';
    } else if (emailControl?.hasError('email')) {
      this.signupErrors.email = 'Format d’email invalide.';
    }

    // password
    const passwordControl = this.signupForm.get('password');
    if (passwordControl?.hasError('required')) {
      this.signupErrors.password = 'Le mot de passe est requis.';
    }

    // Si le formulaire est valide
    if (this.signupForm.valid) {
      const lastName = lastNameControl?.value;
      const firstName = firstNameControl?.value;
      const email = emailControl?.value;
      const password = passwordControl?.value;
      console.log('Tentative de création de compte :', { lastName, firstName, email, password });
      // TODO: Appel HTTP pour créer le compte sur votre API
    }
  }
}