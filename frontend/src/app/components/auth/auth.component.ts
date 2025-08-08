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
  
  // Message flags
  loginSuccess = false;
  loginError = false;
  registrationSuccess = false;
  registrationError = false;
  messageText = '';
  
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
    // Clear all message flags
    this.clearMessages();
  }

  clearMessages() {
    this.loginSuccess = false;
    this.loginError = false;
    this.registrationSuccess = false;
    this.registrationError = false;
    this.messageText = '';
  }

  onLogin() {
    this.clearMessages();
    
    if (this.loginData.email && this.loginData.password) {
      this.authService.login(this.loginData.email, this.loginData.password)
        .subscribe(res => {
          if (res.success) {
            this.loginSuccess = true;
            this.messageText = 'Uspešno ste se prijavili! Preusmerjamo vas...';
            
            // Redirect after a short delay to show the success message
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
          } else {
            this.loginError = true;
            this.messageText = res.message || 'Napačen email ali geslo.';
          }
        }, err => {
          this.loginError = true;
          this.messageText = 'Napaka pri prijavi. Poskusite znova.';
        });
    } else {
      this.loginError = true;
      this.messageText = 'Prosimo, izpolnite vsa polja.';
    }
  }

  onRegister() {
    this.clearMessages();
    
    if (this.validateRegistration()) {
      this.authService.register(this.registerData).subscribe(
        res => {
          if (res.success) {
            this.registrationSuccess = true;
            this.messageText = 'Uspešno ste se registrirali! Preusmerjamo vas na prijavo...';
            
            // Switch to login mode after a short delay
            setTimeout(() => {
              this.isLoginMode = true;
              this.clearForms();
            }, 2000);
          } else {
            this.registrationError = true;
            this.messageText = res.message || 'Napaka pri registraciji. Poskusite znova.';
          }
        },
        err => {
          this.registrationError = true;
          this.messageText = 'Napaka pri registraciji. Poskusite znova.';
        }
      );
    }
  }

  validateRegistration(): boolean {
    if (!this.registerData.firstName || !this.registerData.lastName || 
        !this.registerData.email || !this.registerData.password || 
        !this.registerData.confirmPassword) {
      this.registrationError = true;
      this.messageText = 'Prosimo, izpolnite vsa polja.';
      return false;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.registrationError = true;
      this.messageText = 'Gesli se ne ujemata.';
      return false;
    }

    if (this.registerData.password.length < 6) {
      this.registrationError = true;
      this.messageText = 'Geslo mora imeti vsaj 6 znakov.';
      return false;
    }

    if (!this.registerData.agreeToTerms) {
      this.registrationError = true;
      this.messageText = 'Morate se strinjati s pogoji uporabe.';
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
