import { Component, NgModule, OnInit, signal } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emergency-kit',
  imports: [FormsModule, CommonModule],
  templateUrl: './emergency-kit.component.html',
  styleUrl: './emergency-kit.component.css'
})
export class EmergencyKitComponent implements OnInit{
  httpClient = inject(HttpClient);
  url = 'http://127.0.0.1:8000/api';

  familyData = signal<any[]>([]);
  user = JSON.parse(localStorage.getItem('user') || 'null ');
  userId = this.user.id;

  //html
  isMessageVisible = true;

  //set inital values
  diapersNeeded: number = 0;
  sanitaryPadsNeeded: number = 0;
  isWoman: boolean = false;
  isBaby: boolean = false;
  isElder: boolean = false;
  isVegan: boolean = false; 

 //Will be fetched later. Prep time in weeks
  prepareTime = 8; 
 

  
  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    await this.getUserFamilyData(); 
    this.analyzeFamily(); 
    // calculate all items needed 
    this.diapersNeeded = this.calculateDiapers(this.prepareTime);
    this.sanitaryPadsNeeded = this.calculateSanitaryPads(this.prepareTime);
    this.firstTimeVisitor(); 
  }

  // check if any family members falls in a 'special' category 
  checkPersonalization(){
    this.httpClient.get(`${this.url}/family_member`); 
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

  calculateAge(dateOfBirth: string): number {
    //boilerplate code by javatpoint.com 
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    // Adjust if the birthday hasn't occurred yet this year
    if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
        age--;
    }

    return age;
}

  analyzeFamily() {
    const familyArray = this.familyData(); // Access the array from the signal
    familyArray.forEach(member => {
      const age = this.calculateAge(member.date_of_birth);
      console.log(`${member.name} is ${age} years old`);

        if(age > 13 && member.gender === 'Female'){
          this.isWoman = true; 
        }
        if(age < 3){
          this.isBaby = true;
        }
        if(age > 65 ){
          this.isElder = true; 
        }

    });
}
  
  calculateDiapers(prepareTime: number){
     let diapersNeeded = prepareTime * 49;
     return diapersNeeded;
  }

  calculateSanitaryPads(prepareTime: number){
    let prepTimeInMonths = prepareTime / 4; 
    let sanitaryPadsNeeded = prepTimeInMonths * 25;
    // Return amount rounded down 
    return Math.floor(sanitaryPadsNeeded); 
  }

  firstTimeVisitor(){
    if( !window.localStorage['isReturningVisitor']) {
      alert('first time you here!'); 
      
      // window.localStorage['isReturningVisitor'] = true;
  }
  }

  dismiss(){
    this.isMessageVisible = false;
  }
}
