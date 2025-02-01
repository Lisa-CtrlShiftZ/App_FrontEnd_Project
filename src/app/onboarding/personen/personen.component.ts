import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OnboardingService } from '../../onboarding.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-personen',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './personen.component.html',
  styleUrl: './personen.component.css'
})
export class PersonenComponent {

  formData = {
    name: '',
    last_name: '',
    gender: '',
    height: 0,
    weight: 0,
    diet: '',
    date_of_birth: '' ,
    user_id: '',
  }

  familyMembers = signal<any[]>([]);

  constructor(private router: Router, private onboardingService: OnboardingService) {}

  ngOnInit(): void {
    // Set form to empty when the page loads
    this.formData = {
      name: '',
      last_name: '',
      gender: '',
      height: 0,
      weight: 0,
      diet: '',
      date_of_birth: '' ,
      user_id: '',
    };
    //Load saved data from sessionStorage.
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      const savedFormData = JSON.parse(savedData);
      this.familyMembers.set([savedFormData]);
    }

    // Add user name and lastname to the familyMembers array
    this.familyMembers.set([this.formData]);

    // Load family members from sessionStorage
    const savedFamilyMembers = sessionStorage.getItem('familyMembers');
    if (savedFamilyMembers) {
      this.familyMembers.set(JSON.parse(savedFamilyMembers));
    }
  }


   async nextPage() {
    try {
      // Update sessionStorage with the family members before sending
      sessionStorage.setItem('familyMembers', JSON.stringify(this.familyMembers()));

      // Send all members to API and check if succesfull
      const succes = await this.sendAllMembers();

      // if succesfull navigate to onboarding/duur
      if (succes) {
      this.router.navigate(['onboarding/duur']);
      }
      else {
        alert('Er is iets misgegaan bij het versturen van de familieleden. Probeer het alstublieft opnieuw.');
      }}
    catch (error) {
      console.error('Error in nextPage:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    }
    }

  // function to add a family member
  async addPerson() {
    // data validation before adding person
    if (!this.validateData()) {
      return;
    }

    // Get the userId from localStorage
    const userId = localStorage.getItem("userId")
    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    this.formData.user_id = userId;

    // Retrieve the current family members array from the signal
    const familyArray = this.familyMembers();

    // Add the current form data to the array
    familyArray.push({...this.formData});

    // Update the signal with the new array
    this.familyMembers.set(familyArray);

    // Update sessionStorage with the updated family members array
    sessionStorage.setItem('familyMembers', JSON.stringify(this.familyMembers()));
 
       
    // reset form
    this.formData = {
      name: '',
      last_name: '',
      gender: '',
      height: 0,
      weight: 0,
      diet: '',
      date_of_birth: '' ,
      user_id: '',
    };
  }

  // Function to load a selected family member's data into the form for editing
  editPerson(person: any) {
    // Set the form data to the selected person's data
    this.formData = { ...person };
  }

  // Function to send a single family member to the API
  async sendMemberToApi(member: any, apiUrl: string): Promise<Response> {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });
      return response;
    }
    catch (error) {
      console.error('Error sending family member:', error);
      throw error;
    }
  }

  // Loop to send all members to api one by one
  async sendAllMembers(): Promise<boolean> {
    const apiUrl = 'http://127.0.0.1:8000/api/family_member';
    const familyArray = this.familyMembers();

    try {
      for (const member of familyArray) {
        const response = await this.sendMemberToApi(member,apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to add new family member: ${member.name}`);
        }
        console.log(`Succesfully added family member: ${member.name}`);
      }
      return true;
    }
    catch (error) {
      console.error('Error sending all family members:', error);
      return false;
    }
  }

  // Function to delete the family member currently loaded into the form
  deleteMember() {
    // Get the familyMembers array
    const familyArray = this.familyMembers();

    // Find the index of the current person in the array
    const index = familyArray.findIndex(member => member.name === this.formData.name && member.last_name ===this.formData.last_name);

    if (index !== -1) {
      // Delete person from the array
      familyArray.splice(index, 1);

      // Update the familyMembers array
      this.familyMembers.set(familyArray);

      // Update the sessionStorage with the modified array
      sessionStorage.setItem('familyMembers', JSON.stringify(familyArray));
    }

    // Clear the form data
    this.formData = {
      name: '',
      last_name: '',
      gender: '',
      height: 0,
      weight: 0,
      diet: '',
      date_of_birth: '' ,
      user_id: '',
    };
  }

  // Make sure height and weight are not 0 or less
  validateData(): boolean {
    if (this.formData.height < 1 || this.formData.weight < 1) {
      alert('Kijk alstublieft na of de hoogte en gewicht correct zijn ingevuld. Deze kunnen niet kleiner zijn dan 1.');
      return false;
    }
    return true;
  }

}

