import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { OnboardingService } from '../../onboarding.service';


@Component({
  selector: 'app-bedankt',
  imports: [],
  templateUrl: './bedankt.component.html',
  styleUrl: './bedankt.component.css'
})
export class BedanktComponent implements OnInit{

  formData = {
    name: '',
    last_name: '',
    gender: '',
    height: 0,
    weight: 0,
    diet: '',
    date_of_birth: '' ,
  }

  familyMembers = signal<any[]>([]);
  result = signal(0); // default result is 0
  water = signal(0);

  amountOfDays: number = 1; // set amount of days to one to prevent multiply by zero in case of error

  constructor(private router: Router, private onboardingService: OnboardingService) {}
  
  // When the page loads it should get all the familymembers and run the calculations for calories and water
  ngOnInit(): void {
    this.onPageLoad();
  }


      // Save the data to sessionstorage and post to database. Then move to the next step of the form.
  async onPageLoad(): Promise<void> {

    // Declare the API endpoint
    const apiUrl = 'http://127.0.0.1:8000/api/family_member';

    // load amountOfDays from sessionStorage
    const savedData = sessionStorage.getItem('timeframe');
    if (savedData) {
      const timeframe = JSON.parse(savedData);
      this.amountOfDays = timeframe.amountOfDays;
      console.log('Load amountOfDays:', this.amountOfDays);
      }

    try {
      // Fetch family members
      const response = await fetch(apiUrl);
      if(!response.ok) {
        throw new Error("Could not fetch family members");
      }
      const data: any[] = await response.json();
      console.log('Succesfully fetched family members');

      // Save the data into the signal
      this.familyMembers.set(data);

      // Calculate total calories for all family members
      this.calculateTotalCalories(data);

    } 
    
    catch(error) {
      // Handle errors from the GET request
      console.error('Error getting family members:', error);
      alert('Er is iets misgegaan. Probeer het alstublieft opnieuw.');
    }
  }

  // Function to calculate the total needed calories
  calculateTotalCalories(familyMembers: any[]): void {
    let totalCalories = 0;
    let totalWater = 0;

    // loop to go through each familymember and sum up the results and round these to a whole number.
    familyMembers.forEach(member => {
      const caloriePerson = this.onboardingService.calculateCalorieDay(member);
      totalCalories += Math.round(caloriePerson);

      // each familymember needs 1.5 liters of water a day
      totalWater += 1.5;
    });

    // Multiply totalCalories and totalWater by amountOfDays
    totalCalories *= this.amountOfDays;
    totalWater *= this.amountOfDays;

    // Set the total calorie in the signal
    this.result.set(totalCalories);
    this.water.set(totalWater);
    console.log('Total calories for the whole group', this.result())
    console.log('Total water for the whole group', this.water())
  }
}

