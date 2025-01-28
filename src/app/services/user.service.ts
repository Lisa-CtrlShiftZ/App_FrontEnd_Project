import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
 

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://127.0.0.1:8000/api/user';
  
  user = JSON.parse(localStorage.getItem('user') || 'null');
  userId = this.user.id; 
  familyData = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  // Requests related to user and family members
  
  getAllUsersDetails(){
    return this.http.get<any>(this.userUrl);
  }

  // Fetch a specific user by ID
  getUserDetailsById(userId: number){
    return this.http.get(`${this.userUrl}/${userId}`);
  }

  async getUserFamilyMembers(userId: number) {
    try {
      const response: any = await lastValueFrom(this.http.get(`${this.userUrl}/${userId}/family_member`));

      return response;
      
  } catch (error) {
      console.log('Error fetching data', error);  
  }
}

  //Requests related to emergency kit supplies
  async getCurrentSupplies(userId: number){
     try {
      const response: any = await lastValueFrom(this.http.get(`${this.userUrl}/${userId}/supplies`));
      return response;
     } catch (error) {
      console.log('An error occured when fetching current supply stock', error)
     }
  }

  async addSupplies(userId: number, supplyData: any){
    try {
      const response = await lastValueFrom(this.http.post(`${this.userUrl}/${userId}/supplies`, supplyData));
      return response;  
    } catch (error) {
      console.log('Error adding supply:', error);
      throw error;
    }
  }
}



 