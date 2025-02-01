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

    // load amountOfDays from sessionStorage
    const savedData = sessionStorage.getItem('timeframe');
    if (savedData) {
      const timeframe = JSON.parse(savedData);
      this.amountOfDays = timeframe.amountOfDays;
      console.log('Load amountOfDays:', this.amountOfDays);
      }
      
    // Retrieve family members from sessionStorage
    const familyMembersData = sessionStorage.getItem('familyMembers');
    if (familyMembersData) {
      const familyMembers = JSON.parse(familyMembersData);
      this.familyMembers.set(familyMembers); // Set the family members from sessionStorage
      console.log('Loaded family members from sessionStorage:', familyMembers);
  
      // Calculate total calories for all family members
      this.calculateTotalCalories(familyMembers);
    } else {
      alert('No family members found in sessionStorage.');
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

  async updateFoodWater(): Promise<void> {
    // Retrieve the userId from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    // Declare the API endpoint for updating the user's food and water
    const apiUrl = `http://127.0.0.1:8000/api/user/${userId}`;

    // Prepare the data to update the user's food and water needs
    const updatedUser = {
      max_food: this.result(),
      max_water: this.water(),
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        console.log('Successfully updated food and water for the user');

        // Fetch the updated user data from the API
      const updatedUserResponse = await fetch(apiUrl);
      if (!updatedUserResponse.ok) {
        throw new Error('Failed to fetch updated user data.');
      }

      // Get the updated user data
      const updatedUserData = await updatedUserResponse.json();

      // Store the updated user data into localStorage
      localStorage.setItem('userId', updatedUserData.id.toString());
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
        console.log('Navigating to /dashboard');
        this.router.navigate(['/dashboard']);
      } else {
        alert('Failed to update food and water.');
      }
    } catch (error) {
      console.error('Error updating food and water:', error);
      alert('An error occurred while updating food and water. Please try again.');
    }
  }
  }


