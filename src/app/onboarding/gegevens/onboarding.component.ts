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
  };

  // initialize the familyMembers array to hold the user's data and family members data.
  familyMembers: any[] = [];


  constructor(private router: Router, private onboardingService: OnboardingService) {}


  // Save the data to sessionstorage and post to database. Then move to the next step of the form.
  nextPage() {
    // add user to the array
    this.familyMembers.push({ ...this.formData });


    // Save data to sessionstorage
    sessionStorage.setItem('familyMembers', JSON.stringify(this.familyMembers));

    // navigate to next page
    this.router.navigate(['onboarding/toevoegen']);

  }
}



