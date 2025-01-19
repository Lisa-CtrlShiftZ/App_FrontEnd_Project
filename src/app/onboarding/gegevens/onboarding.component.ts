import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-onboarding' ,
  imports: [FormsModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})

export class OnboardingComponent {
  formData = {
    voornaam: '',
    familienaam: '',
    geboortedatum: '' ,
    gewicht: 0,
    dieet: '',
  }


  constructor(private router: Router) {

    //Load saved data from sessionStorage if there is any.
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      this.formData = JSON.parse(savedData);
    }
  }



  // Save the data to sessionstorage and move to the next step of the form.
  nextPage() {
  sessionStorage.setItem('formData', JSON.stringify(this.formData));
  this.router.navigate(['onboarding/toevoegen'])
  }
}



