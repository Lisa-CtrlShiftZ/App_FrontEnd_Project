import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://127.0.0.1:8000/api/user'; // Replace with your actual endpoint

  constructor(private http: HttpClient) {}

  // Fetch all users
  getAllUsersDetails(): Observable<any> {
    return this.http.get<any>(this.userUrl);
  }

  // Fetch a specific user by ID
  getUserDetailsById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/${userId}`);
  }
}