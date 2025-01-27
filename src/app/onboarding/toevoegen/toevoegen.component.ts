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

  async navigateToDuur() {
    const apiUrl = 'http://127.0.0.1:8000/api/family_member';

    // Retrieve the user data from the sessionStorage
    const familyMembers = sessionStorage.getItem('familyMembers');

    if (familyMembers) {
      // Parse the user data
      const userData = JSON.parse(familyMembers);

      // familyMembers is an array and there's only one item in it that we want to send.
      const userToSend = userData[0];

      // call the sendToApi function
      try {
        const response = await this.sendToApi(userToSend, apiUrl);
        if (response.ok) {
        console.log(`Successfully sent user: ${userToSend.name}`);
        this.router.navigate(['/onboarding/duur']);
      } else {
        console.error('Failed to send user.');
      }}
      catch (error) {
        console.error('Error sending user:', error);
      }
    }
    else {
      console.error('No user data found in sessionStorage.');
    }
  }

  // Function to send user data to the API
  async sendToApi(user: any, apiUrl: string): Promise<Response> {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      return response;
    }
    catch (error) {
      console.error('Error sending family member:', error);
      throw error;
    }
  }
}
