import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  user = JSON.parse(localStorage.getItem('user') || 'null ');
  userId = this.user.id; 

  familyData = signal<any[]>([]);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
    this.getUserFamilyData(); 
  }

  async getUserData() {
    try {
      const userData = await firstValueFrom(
        this.userService.getUserDetailsById(this.user.id)
      );
      console.log('Logged-in user data:', userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async getUserFamilyData() {
    try {
      const response = await this.userService.getUserFamilyMembers(this.user.id);
      console.log('Family members fetched:', response);
      this.familyData.set(response); // Update the signal value
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
 

}
