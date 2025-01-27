import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
 

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://127.0.0.1:8000/api/user';
  private apiUrl =  'http://127.0.0.1:8000/api/'; 

  user = JSON.parse(localStorage.getItem('user') || 'null');
  userId = this.user.id; 
  familyData = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  // Fetch all users
  getAllUsersDetails(){
    return this.http.get<any>(this.userUrl);
  }

  // Fetch a specific user by ID
  getUserDetailsById(userId: number){
    return this.http.get(`${this.userUrl}/${userId}`);
  }

  // getUserFamilyMembers(userId: number){
  //   return this.http.get(`${this.userUrl}/${userId}/family_member`);
  // }

  async getUserFamilyMembers(userId: number) {
    try {
      const response: any = await lastValueFrom(this.http.get(`${this.userUrl}/${userId}/family_member`));

      console.log('Family members fetched:', response);  
      return response;
      
  } catch (error) {
      console.log('Error fetching data', error);  
  }
}

}



 