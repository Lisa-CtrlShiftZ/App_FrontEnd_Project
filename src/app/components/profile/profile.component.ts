import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  // Declare booleans for account, family and setting and initially set account to true and family and settings to false
  accountVisible: boolean = true;
  familyVisible: boolean = false;


  showAccount() {
    this.accountVisible = true;
    this.familyVisible = false;
  };

  showFamily() {
    this.accountVisible = false;
    this.familyVisible = true;
  };

    
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  user: any;
  userId = localStorage.getItem('userID');

  formData = {
    name: '',
    last_name: '',
    gender: '',
    height: 0,
    weight: 0,
    diet: '',
    date_of_birth: '' ,
  }

  // Signals for errors
  currentPasswordError = signal<boolean>(false);
  passwordMatchError = signal<boolean>(false);

  // Signal for familyData
  familyData = signal<any[]>([]);

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {}


  ngOnInit(): void {
    // Initialize profile form
    this.profileForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    // Initialize password form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatPassword: ['',Validators.required]
    }, { validator: this.passwordMatch });

    // Get user data from localStorage
    this.loadUserData();
    // get family data from api
    this.getUserFamilyData(); 
  }

  // Make sure newPassword matches repeatPassword
  passwordMatch(form: FormGroup): null | {passwordNoMatch: boolean } {
    const newPassword = form.get('newPassword')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;

    if (newPassword && repeatPassword && newPassword !== repeatPassword) {
      // If newPassword and repeatPassword are filled and they don't match return value true
      return { passwordNoMatch: true};
    }
    // If the passwords match return null ( -> no error)
    return null;
  }

  // load data from local storage to fill in form
  loadUserData(): void {
    let user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);

      this.profileForm.patchValue({
        userName: this.user.name,
        email: this.user.email
      });
    }
  }

  // Function to check if currentPassword matches password in database
  async checkCurrentPassword(currentPassword: string): Promise<boolean> {
    try {

      // use userId from localStorage
      const userId = localStorage.getItem('userID');

      const response = await fetch('http://127.0.0.1:8000/api/verifyPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          password: currentPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to verify password');
      }

      const data = await response.json();
      return data.valid;
    }
    catch (error) {
      console.error('Error verifying current password:', error);
      return false;
    }
  }

  // Save the new password if the current password passes the check in the api
  async saveNewPassword(): Promise<void> {
    if (this.passwordForm.invalid) return;

    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;

    // call the function to check if the current password is valid
    const currentPasswordValid = await this.checkCurrentPassword(currentPassword);
    if (!currentPasswordValid) {
      this.currentPasswordError.set(true);
      return;
    }

    const repeatPassword = this.passwordForm.get('repeatPassword')?.value;
    if (newPassword !== repeatPassword) {
      this.passwordMatchError.set(true);
      return;
    }

    // Update password if everything is valid
    await this.updatePassword(newPassword);
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/${this.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      console.log('Password updated succesfully');
    }
    catch (error) {
      console.error('Error updating password:', error);
    }
  }

  // Update user details with changes
 async saveChanges(): Promise<void> {
  if(this.profileForm.invalid) return;

  const updatedData = this.profileForm.value;
  updatedData.name = updatedData.userName; // Convert userName to name for backend
  delete updatedData.userName; // Delete userName field
  console.log('updated user data:', updatedData);

  await this.updateUserData(updatedData);
 }

 async updateUserData(updatedData: any): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/user/${this.user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    console.log('Profile updated succesfully');
    // Update localstorage
    localStorage.setItem('user', JSON.stringify(updatedData));
  }
  catch (error) {
    console.error('Error updating profile data:', error);
  }
 }

 // -------------------------------------------------------------------------------------------

 // Logout function
 logout() {
  localStorage.clear();
  sessionStorage.clear();
  this.router.navigate(['/login']);
 }

 // -------------------------------------------------------------------------------------------
 // below logic is for the family page
 // -------------------------------------------------------------------------------------------

 // get family data from api
 async getUserFamilyData() {
  try {
    const response = await this.userService.getUserFamilyMembers(this.user.id);
    console.log('Family members fetched:', response);
    this.familyData.set(response); // Update the signal value

    // Store family data in sessionStorage
    sessionStorage.setItem('familyMembers', JSON.stringify(response));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

  // function to add a family member
  async addPerson() {
    // data validation before adding person
    if (!this.validateData()) {
      return;
    }

    // Add userId to formData
    const memberWithUserId = { ...this.formData, user_id: this.user.id };
    console.log('memberWithUserId:', memberWithUserId); 

    // Retrieve the current family members array from the signal
    const familyArray = this.familyData();

    // Add the current form data to the array
    familyArray.push({...this.formData});

    // Update the signal with the new array
    this.familyData.set(familyArray);
    sessionStorage.setItem('familyMembers', JSON.stringify(familyArray));

    // Update sessionStorage with the updated family members array
    // sessionStorage.setItem('familyMembers', JSON.stringify(this.familyMembers()));
 
       
    // reset form
    this.formData = {
      name: '',
      last_name: '',
      gender: '',
      height: 0,
      weight: 0,
      diet: '',
      date_of_birth: '' ,
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
    // Clone the member object and remove the `id` field if it exists
    const newMemberData = { ...member };

    // Add user_id to the new member data if it's missing
    if (!newMemberData.user_id) {
      newMemberData.user_id = this.user.id; // Add user_id from the current user
    }

    // Debug: Log the member data being sent
    console.log("New member data being sent:", newMemberData);

    // Send POST request for new member
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMemberData), // Send the new member data (without id)
    });

    // Check for successful response
    if (!response.ok) {
      console.error("Failed to add new member:", await response.text());
    }

    return response;
  } catch (error) {
    console.error('Error sending family member:', error);
    throw error;
  }
}
  // Loop to send all members to api one by one

  async sendAllMembers(): Promise<boolean> {
    const apiUrl = 'http://127.0.0.1:8000/api/family_member';
    const familyArray = this.familyData(); // Get the family data from the signal
    const storedFamilyMembers = JSON.parse(sessionStorage.getItem('familyMembers') || '[]'); // Get family members from sessionStorage
    
    try {
      // Fetch the list of all family members associated with the current userId from the API
      const apiResponse = await fetch(`http://127.0.0.1:8000/api/family_member?user_id=${this.user.id}`);
      const apiFamilyMembers = await apiResponse.json();
  
      // Get the family IDs from sessionStorage
      const familyIdsInSession = storedFamilyMembers.map((member: any) => member.id);
  
      // Delete members from the API that are not in sessionStorage and are associated with the current user
      for (const apiMember of apiFamilyMembers) {
        if (!familyIdsInSession.includes(apiMember.id)) {
          // Member exists in the API but not in sessionStorage and has the correct user_id
          if (apiMember.user_id === this.user.id) {
            const deleteResponse = await this.deleteMemberFromApi(apiMember.id);
            if (deleteResponse) {
              console.log(`Successfully deleted family member: ${apiMember.name}`);
            } else {
              console.error(`Failed to delete family member: ${apiMember.name}`);
            }
          }
        }
      }
  
      // Then, update existing members and add new members
      const currentFamilyArray = familyArray.map((member: any) => member.id);
  
      for (const member of storedFamilyMembers) {
        if (member.id) {
          // Member exists in both sessionStorage and API -> Update it
          const updateResponse = await this.updateMemberInApi(member);
          if (updateResponse.ok) {
            console.log(`Successfully updated family member: ${member.name}`);
          } else {
            console.error(`Failed to update family member: ${member.name}`);
          }
        } else {
          // Member is new in sessionStorage -> Add it (because it doesn't have an `id`)
          console.log("New member detected, sending POST request:", member);  // Debug: Check if it's correctly detected as a new member
          
          const addResponse = await this.sendMemberToApi(member, apiUrl);
          if (addResponse.ok) {
            console.log(`Successfully added family member: ${member.name}`);
          } else {
            console.error(`Failed to add family member: ${member.name}`);
          }
        }
      }
  
      return true; // Indicate that the process was successful
    } catch (error) {
      console.error('Error syncing family members with API:', error);
      return false;
    }
  }
  
  // Delete a family member from the API
  async deleteMemberFromApi(memberId: any): Promise<boolean> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/family_member/${memberId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        console.error('Error deleting family member:', await response.json());
        return false;
      }
  
      console.log('Successfully deleted family member with ID:', memberId);
      return true; // Successfully deleted
    } catch (error) {
      console.error('Error deleting family member:', error);
      return false; // Return false if the deletion fails
    }
  }
  
  

  // Function to delete the family member currently loaded into the form
  deleteMember() {
    // Get the familyMembers array
    const familyArray = this.familyData();

    // Find the index of the current person in the array
    const index = familyArray.findIndex(member => member.name === this.formData.name && member.last_name ===this.formData.last_name);

    if (index !== -1) {
      // Delete person from the array
      familyArray.splice(index, 1);

      // Update the familyMembers array
      this.familyData.set(familyArray);

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
    };
  }




// Update an existing family member in the API
async updateMemberInApi(member: any): Promise<Response> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/family_member/${member.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member), // Send the updated member data
    });
    return response;
  } catch (error) {
    console.error('Error updating family member:', error);
    throw error;
  }
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
