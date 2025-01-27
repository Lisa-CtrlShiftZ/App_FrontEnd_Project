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

  timeframe = {
    amountOfDays: 0,
  };

  constructor(private router: Router) {
        //Load saved data from sessionStorage if there is any.
        const savedData = sessionStorage.getItem('timeframe');
        if (savedData) {
          this.timeframe = JSON.parse(savedData);
        }
  }
  
  nextPage() {
    sessionStorage.setItem('timeframe', JSON.stringify(this.timeframe));
    this.router.navigate(['onboarding/bedankt'])
    }
}
