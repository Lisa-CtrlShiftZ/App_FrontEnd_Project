import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toevoegen',
  imports: [],
  templateUrl: './toevoegen.component.html',
  styleUrl: './toevoegen.component.css'
})
export class ToevoegenComponent {
  constructor(private router: Router) {}

  navigateToPersonen() {
    this.router.navigate(['/onboarding/personen']);
  }

  navigateToDuur() {
    this.router.navigate(['/onboarding/duur']);
  }
}
