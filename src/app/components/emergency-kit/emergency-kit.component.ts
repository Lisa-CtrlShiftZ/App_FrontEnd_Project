import { Component, NgModule, OnInit, signal } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupplyAdjusterComponent } from '../supply-adjuster/supply-adjuster.component';

interface StockItem {
  id: number;
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-emergency-kit',
  standalone: true, 
  imports: [FormsModule, CommonModule, SupplyAdjusterComponent],
  templateUrl: './emergency-kit.component.html',
  styleUrl: './emergency-kit.component.css'
})
export class EmergencyKitComponent implements OnInit{
  httpClient = inject(HttpClient);
  url = 'http://127.0.0.1:8000/api';
  
  familyData = signal<any[]>([]);
  diapersInStock = 0;
  padsInStock = 0;
  b12InStock = 0; 

  user = JSON.parse(localStorage.getItem('user') || 'null ');
  userId = this.user.id;

  //html
  isMessageVisible = true;

  //set inital values
  diapersNeeded: number = 0;
  sanitaryPadsNeeded: number = 0;
  b12Needed = 0; 
  isWoman: boolean = false;
  isBaby: boolean = false;
  isVegan: boolean = false; 
 
  prepareTime = Number(sessionStorage.getItem('timeframe')) || 7;

  stock: any;
  
  constructor(private userService: UserService, private http: HttpClient ) {};
  
  async ngOnInit(): Promise<void> {
    await this.getUserFamilyData(); 
    await this.getSuppliesInStock(); 
    this.analyzeFamily(); 
    // calculate all items needed 
    this.diapersNeeded = this.calculateDiapers(this.prepareTime);
    this.sanitaryPadsNeeded = this.calculateSanitaryPads(this.prepareTime);
    this.firstTimeVisitor(); 
    this.isMessageVisible;
  }

  // check if any family members falls in a 'special' category 
  checkPersonalization(){
    this.httpClient.get(`${this.url}/family_member`); 
  }

  async getUserFamilyData() {
    try {
      const response = await this.userService.getUserFamilyMembers(this.user.id);
      console.log('Family members fetched:', response);
      this.familyData.set(response); // Update the signal value
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  calculateAge(dateOfBirth: string): number {
    //boilerplate code by javatpoint.com 
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    // Adjust if the birthday hasn't occurred yet this year
    if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
        age--;
    }

    return age;
}

  analyzeFamily() {
    const familyArray = this.familyData(); // Access the array from the signal
    familyArray.forEach(member => {
      const age = this.calculateAge(member.date_of_birth);
      console.log(`${member.name} is ${age} years old`);

        if(age > 13 && member.gender === 'Female'){
          this.isWoman = true; 
        }
        if(age < 3){
          this.isBaby = true;
        }
    });
}
  
  calculateDiapers(prepareTime: number){
     let diapersNeeded = Math.round(prepareTime / 7 * 49);
     return diapersNeeded;
  }

  calculateSanitaryPads(prepareTime: number){
    let prepTimeInMonths = prepareTime / 30; 
    let sanitaryPadsNeeded = prepTimeInMonths * 25;
    // Return amount rounded down 
    return Math.round(sanitaryPadsNeeded); 
  }

  async getSuppliesInStock(){
    try {
      const response = await this.userService.getCurrentSupplies(this.user.id);
      console.log('Supplies in stock:', response);

      //fetch and set diapers
      const diapers = response.find((item: { supply_name: string; }) => item.supply_name === 'Diapers');
      this.diapersInStock = diapers.quantity;  

      //fetch and set sanitary pads
      const pads = response.find((item: {supply_name:string}) => item.supply_name === "Sanitary Pads"); 
      this.padsInStock = pads.quantity;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  updateStock(itemId: number, newAmount: number) {
    try {
      this.userService.addSupplies(itemId, newAmount);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  }


  firstTimeVisitor(){

    if( !localStorage['isReturningVisitor']) {
       
      this.isMessageVisible = false;
      localStorage['isReturningVisitor'] = true;   

  }
  }

  dismiss(){
    this.isMessageVisible = false;
  }

  plus() {
    this.diapersInStock++;
  }

  minus(){
    if (this.diapersInStock > 0){
      this.diapersInStock--; 
    }
  }
}

 