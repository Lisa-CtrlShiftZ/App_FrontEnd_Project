import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-onboarding' ,
  imports: [FormsModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})

export class OnboardingComponent {
  formData = {
    name: '',
    lastname: '',
    gender: '',
    height: 0,
    weight: 0,
    diet: '',
    dateOfBirth: '' ,
  }


  constructor(private router: Router) {

    //Load saved data from sessionStorage if there is any.
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      this.formData = JSON.parse(savedData);
    }
  }

  http = inject(HttpClient);


  // Save the data to sessionstorage and post to database. Then move to the next step of the form.
  nextPage() {

    // Save data to sessionstorage
    sessionStorage.setItem('formData', JSON.stringify(this.formData));

    // Decclare the API endpoint URL
    const apiUrl = 'http://127.0.0.1:8000/api/family_member';

    // Send data to server using POST request.
    this.http.post(apiUrl, this.formData).subscribe(
      (response) => {
        // log succesful response to console
        console.log('Form succesfully submitted:', response);

        // Navigate to /toevoegen
        this.router.navigate(['onboarding/toevoegen']);
      },
      (error) => {
        // handle error
        console.error('Error submitting form:', error);
        alert('Er is iets misgegaan met het formulier door te sturen. Probeer het alstublieft opnieuw.');
      }
    );
  }
}



