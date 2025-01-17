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
  }


  constructor(private router: Router) {}

nextPage() {
  sessionStorage.setItem('formData', JSON.stringify(this.formData));
  this.router.navigate(['onboarding/toevoegen'])
  }
}



