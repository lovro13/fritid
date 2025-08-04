import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AuthComponent {
  isLoginMode = true;
  
  // Login form data
  loginData = {
    email: '',
    password: ''
  };

  // Registration form data
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.clearForms();
  }

  clearForms() {
    this.loginData = { email: '', password: '' };
    this.registerData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    };
  }

  onLogin() {
    if (this.loginData.email && this.loginData.password) {
      const success = this.authService.login(this.loginData.email, this.loginData.password);
      
      if (success) {
        alert('Uspešno ste se prijavili!');
        this.router.navigate(['/']);
      } else {
        alert('Napačen email ali geslo.');
      }
    } else {
      alert('Prosimo, izpolnite vsa polja.');
    }
  }

  onRegister() {
    if (this.validateRegistration()) {
      const success = this.authService.register(this.registerData);
      
      if (success) {
        alert('Uspešno ste se registrirali!');
        this.router.navigate(['/']);
      } else {
        alert('Napaka pri registraciji. Poskusite znova.');
      }
    }
  }

  validateRegistration(): boolean {
    if (!this.registerData.firstName || !this.registerData.lastName || 
        !this.registerData.email || !this.registerData.password || 
        !this.registerData.confirmPassword) {
      alert('Prosimo, izpolnite vsa polja.');
      return false;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Gesli se ne ujemata.');
      return false;
    }

    if (this.registerData.password.length < 6) {
      alert('Geslo mora imeti vsaj 6 znakov.');
      return false;
    }

    if (!this.registerData.agreeToTerms) {
      alert('Morate se strinjati s pogoji uporabe.');
      return false;
    }

    return true;
  }

  forgotPassword() {
    const email = prompt('Vnesite vaš email naslov:');
    if (email) {
      // TODO: Implement forgot password logic
      alert('Navodila za ponastavitev gesla so bila poslana na vaš email.');
    }
  }
}
