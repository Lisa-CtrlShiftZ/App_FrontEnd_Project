import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OnboardingService } from '../../onboarding.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-personen',
  imports: [FormsModule, RouterModule],
  templateUrl: './personen.component.html',
  styleUrl: './personen.component.css'
})
export class PersonenComponent {

  formData = {
    name: '',
    last_name: '',
    gender: '',
    height: 0,
    weight: 0,
    diet: '',
    date_of_birth: '' ,
  }

  constructor(private router: Router, private onboardingService: OnboardingService) {
        //Load saved data from sessionStorage if there is any.
        const savedData = sessionStorage.getItem('formData');
        if (savedData) {
          this.formData = JSON.parse(savedData);
        }
  }

  http = inject(HttpClient);

  nextPage() {
    sessionStorage.setItem('formData', JSON.stringify(this.formData));
    this.router.navigate(['onboarding/duur'])
    };

  addPerson() {

    // Save data to sessionstorage
    sessionStorage.setItem('formData', JSON.stringify(this.formData));
  
  
    // Decclare the API endpoint URL
    const apiUrl = 'http://127.0.0.1:8000/api/family_member';
  
    // Send data to server using POST request.
    this.http.post(apiUrl, this.formData).subscribe(
      (response) => {
        // log succesful response to console
        console.log('Form succesfully submitted:', response);
       
        // reset form
        this.formData = {
          name: '',
          last_name: '',
          gender: '',
          height: 0,
          weight: 0,
          diet: '',
          date_of_birth: '' ,
        }
        
      },
      (error) => {
        // handle error
        console.error('Error submitting form:', error);
        alert('Er is iets misgegaan met het formulier door te sturen. Probeer het alstublieft opnieuw.');        }
    );
  };
}

