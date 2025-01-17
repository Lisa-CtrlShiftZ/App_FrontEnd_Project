import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dieet',
  imports: [FormsModule, RouterModule],
  templateUrl: './dieet.component.html',
  styleUrl: './dieet.component.css'
})
export class DieetComponent {
  formData = {
    dieet: '',
    allergieen: ''
  }
  constructor(private router: Router) {}
  
  nextPage() {
    sessionStorage.setItem('formData', JSON.stringify(this.formData));
    this.router.navigate(['onboarding/overzicht'])
    }
}
