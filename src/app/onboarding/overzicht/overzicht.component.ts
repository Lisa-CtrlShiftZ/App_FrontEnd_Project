import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overzicht',
  imports: [RouterModule],
  templateUrl: './overzicht.component.html',
  styleUrl: './overzicht.component.css'
})
export class OverzichtComponent implements OnInit{

  formData: any;


  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      this.formData = JSON.parse(savedData);
    } else {
      this.formData = {}
    }
  }

nextPage() {
  this.router.navigate(['onboarding/bedankt'])
  }
}

