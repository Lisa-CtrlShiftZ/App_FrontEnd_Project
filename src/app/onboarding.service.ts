import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  http = inject(HttpClient);

  constructor() { }

  // Calorie calculation by day
  calculateCalorieDay(formData: any): number {
    // calculate age based on date of birth
    const birthDate = new Date(formData.date_of_birth);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    let result;
    //calculate calories for women
    if (formData.gender === "female") {
      result = 655 + (9.6 * formData.weight) + (1.8 * formData.height) - (4.7 * age)
    } else {
    // calculate calories for men
      result = 66 + (13.7 * formData.weight) + (5 * formData.height) - (6.8 * age)
    };
    console.log(result);
    return result
    
  }
  
}
