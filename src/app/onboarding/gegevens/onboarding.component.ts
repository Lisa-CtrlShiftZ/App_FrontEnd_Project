import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OnboardingService } from '../../onboarding.service';


@Component({
  selector: 'app-onboarding' ,
  imports: [FormsModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})

export class OnboardingComponent {
  formData = {
    name: '',
    last_name: '',
    gender: '',
    height: 0,
    weight: 0,
    diet: '',
    date_of_birth: '' ,
    user_id: '',
  };

  // initialize the familyMembers array to hold the user's data and family members data.
  familyMembers: any[] = [];


  constructor(private router: Router, private onboardingService: OnboardingService) {}

  // Make sure height and weight are not 0 or less
  validateData(): boolean {
    if (this.formData.height < 1 || this.formData.weight < 1) {
      alert('Kijk alstublieft na of de hoogte en gewicht correct zijn ingevuld. Deze kunnen niet kleiner zijn dan 1.');
      return false;
    }
    return true;
  }

  // Save the data to sessionstorage and post to database. Then move to the next step of the form.
  async nextPage() {
    // validate input
    if (this.validateData()) {
      // Retrieve the user from localStorage
      const userId = JSON.parse(localStorage.getItem('userId') || '{}');

      if (userId) {
        // Add the user_id to formData
        this.formData.user_id = userId;

        // Add user to the array
        this.familyMembers.push({ ...this.formData });

        // Save data to sessionstorage
        sessionStorage.setItem('familyMembers', JSON.stringify(this.familyMembers));

        try {
          // Send the formData to the API
          const apiUrl = 'http://127.0.0.1:8000/api/family_member';
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.formData),
          });

          if (response.ok) {
            console.log('Family member added successfully');
          } else {
            console.error('Error adding family member');
          }
        } catch (error) {
          console.error('Error posting family member:', error);
        }

        // navigate to the next page
        this.router.navigate(['onboarding/toevoegen']);
      } else {
        console.error('User not found in localStorage');
      }
    }
  }
}



