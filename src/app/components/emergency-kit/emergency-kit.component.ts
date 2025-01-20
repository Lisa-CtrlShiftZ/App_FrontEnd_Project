import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-emergency-kit',
  imports: [],
  templateUrl: './emergency-kit.component.html',
  styleUrl: './emergency-kit.component.css'
})
export class EmergencyKitComponent implements OnInit{
  httpClient = inject(HttpClient);
  url = 'http://127.0.0.1:8000/api';

  //set inital value
  diapersNeeded: number = 0;
  sanitaryPadsNeeded: number = 0;

 //Will be fetched later. Prep time in weeks
  prepareTime = 4; 

  ngOnInit(): void {
    // calculate all items needed 
    this.diapersNeeded = this.calculateDiapers(this.prepareTime);
    this.sanitaryPadsNeeded = this.calculateSanitaryPads(this.prepareTime);
  }

  // check if any family members falls in a 'special' category 
  checkPersonalization(){
    this.httpClient.get(`${this.url}/family_member`); 
  }
  
  calculateDiapers(prepareTime: number){
    //7 a day is 49 a week, no joke
     let diapersNeeded = prepareTime * 49;
     return diapersNeeded;
  }

  calculateSanitaryPads(prepareTime: number){
    let prepTimeInMonths = prepareTime / 4; 
    let sanitaryPadsNeeded = prepTimeInMonths * 25;
    // Return amount rounded down 
    return Math.floor(sanitaryPadsNeeded); 
  }
}
