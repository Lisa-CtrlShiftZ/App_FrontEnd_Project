import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-personen',
  imports: [FormsModule, RouterModule],
  templateUrl: './personen.component.html',
  styleUrl: './personen.component.css'
})
export class PersonenComponent {

  formData = {
    voornaam: '',
    familienaam: '',
    geboortedatum: '',
    gewicht: '',
  }
  constructor(private router: Router) {}
  
  nextPage() {
    sessionStorage.setItem('formData', JSON.stringify(this.formData));
    this.router.navigate(['onboarding/duur'])
    }
}
