import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SignupData } from '../models/signup-data';

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

  login(username: string, password: string) {
    const credentials = { username, password }; // Prepare user credentials.
    return this.httpClient.post(`${this.url}/user`, credentials)
      .pipe(tap((result: any) => {
        if (result.token) {
          // Store the token in localStorage for future authenticated requests.
          localStorage.setItem('authToken', result.token);
          console.log('logged in succesfully!')
        } else {
          throw new Error('Authentication failed.');
        }
      }));
}

  logout() {
    localStorage.removeItem('authUser');
  }

  isLoggedIn() {
    return localStorage.getItem('authUser') !== null;
  }

  constructor() { }
}
