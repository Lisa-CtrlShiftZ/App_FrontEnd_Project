import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { signal } from '@angular/core';
@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  // Declare booleans for account, family and setting and initially set account to true and family and settings to false
  accountVisible: boolean = true;
  familyVisible: boolean = false;
  settingsVisible: boolean = false;


  showAccount() {
    this.accountVisible = true;
    this.familyVisible = false;
    this.settingsVisible = false;
  };

  showFamily() {
    this.accountVisible = false;
    this.familyVisible = true;
    this.settingsVisible = false;
  };

    
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  user: any;

  // Signals for errors
  currentPasswordError = signal<boolean>(false);
  passwordMatchError = signal<boolean>(false);

  constructor(private fb: FormBuilder) {}


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
      const response = await fetch('http://127.0.0.1:8000/api/verifyPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.user.id,
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
      const response = await fetch(`http://127.0.0.1:8000/api/updatePassword/${this.user.id}`, {
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
  console.log('updated user data:', updatedData);

  await this.updateUserData(updatedData);
 }

 async updateUserData(updatedData: any): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/user`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedData })
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

}
