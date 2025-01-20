import { Component } from '@angular/core';
import { OnboardingService } from '../../onboarding.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bedankt',
  imports: [],
  templateUrl: './bedankt.component.html',
  styleUrl: './bedankt.component.css'
})
export class BedanktComponent {
  formData = {
    name: '',
    last_name: '',
    gender: '',
    height: 0,
    weight: 0,
    diet: '',
    date_of_birth: '' ,
  }

  result: number;

    constructor(private router: Router, private onboardingService: OnboardingService) {
  
      //Load saved data from sessionStorage if there is any.
      const savedData = sessionStorage.getItem('formData');
      if (savedData) {
        this.formData = JSON.parse(savedData);
      }

      this.result = Math.round(this.onboardingService.calculateCalorieDay(this.formData));
      console.log(this.result)

    }

}

