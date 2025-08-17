import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  role?: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public user$ = this.userSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.userSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
    }
  }

  getToken(): string | null {
    return this.tokenSubject.getValue();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string; user?: any, token?: string }> {
    // Send login request to backend
    return this.http.post<{ success: boolean; message: string; user?: any, token?: string }>(
      `${environment.apiBase}/account/login`,
      { email, password }
    ).pipe(
      tap(res => {
        if (res.success && res.user && res.token) {
          const user: User = {
            id: res.user.id,
            email: res.user.email,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            name: `${res.user.firstName} ${res.user.lastName}`,
            role: res.user.role
          };
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', res.token);
          this.userSubject.next(user);
          this.tokenSubject.next(res.token);
        }
      })
    );
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
    
    return this.http.post(`${environment.apiBase}/account/register`, registrationRequest);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiBase}/users/${id}`);
  }

  updateUserProfile(id: number, profileData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiBase}/users/${id}/profile`, profileData);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.tokenSubject.next(null);
  }
}
