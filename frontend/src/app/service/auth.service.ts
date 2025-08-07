import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {
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
    const user: User = {
      email: email,
      name: 'Uporabnik'
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    return true;
  }

  register(userData: any): Observable<any> {
    // Send registration data to backend
    const registrationRequest = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    };
    console.log('Registration request:', registrationRequest);
    // Assuming HttpClient is injected in the constructor
    let response = this.http.post('http://localhost:8080/api/account/register', registrationRequest);
    response.subscribe(res => {
      console.log('Registration response:', res);
    });
    return response;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
