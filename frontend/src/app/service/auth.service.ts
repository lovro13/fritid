import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): boolean {
    // TODO: Implement actual authentication with backend
    // For now, mock successful login
    const user: User = {
      email: email,
      name: 'Uporabnik'
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    return true;
  }

  register(userData: any): boolean {
    // TODO: Implement actual registration with backend
    // For now, mock successful registration
    const user: User = {
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    return true;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
