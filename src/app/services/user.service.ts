import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://127.0.0.1:8000/api/user';
  private apiUrl =  'http://127.0.0.1:8000/api/'; 

  user = JSON.parse(localStorage.getItem('user') || 'null');
  userId = this.user.id; 

  constructor(private http: HttpClient) {}

  // Fetch all users
  getAllUsersDetails(){
    return this.http.get<any>(this.userUrl);
  }

  // Fetch a specific user by ID
  getUserDetailsById(userId: number){
    return this.http.get(`${this.userUrl}/${userId}`);
  }

  getUserFamilyMembers(userId: number){
    return this.http.get(`${this.userUrl}/${userId}/family_member`);
  }

}



 