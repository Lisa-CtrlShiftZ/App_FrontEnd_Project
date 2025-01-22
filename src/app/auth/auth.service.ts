import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SignupData } from '../models/signup-data';
import { LoginData } from '../models/login-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpClient = inject(HttpClient);
  url = 'http://127.0.0.1:8000/api';

  //Posts register data to to /user API endpoint.  
  //SignupData is an interface defined in models/signup-data.ts
  signup(data: SignupData) {
    return this.httpClient.post(`${this.url}/user`, data);
  }

  login(data: LoginData) {
    return this.httpClient.post(`${this.url}/login`, data)
      .pipe(tap((result: any) => {
        if (result.token) {
          // token is stored in localStorage for future requests
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('userId', JSON.stringify(result.user.id));
          console.log('logged in succesfully!')
        } else {
          throw new Error('Authentication failed.');
        }
      }));
  }

  logout() {
    localStorage.removeItem('authUser');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authUser') !== null;
  }

  constructor() { }
}
