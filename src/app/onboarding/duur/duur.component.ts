import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-duur',
  imports: [FormsModule, RouterModule],
  templateUrl: './duur.component.html',
  styleUrl: './duur.component.css'
})
export class DuurComponent {

  formData = {
    duur: 0,
  }
  constructor(private router: Router) {}
  
  nextPage() {
    sessionStorage.setItem('formData', JSON.stringify(this.formData));
    this.router.navigate(['onboarding/dieet'])
    }
}
