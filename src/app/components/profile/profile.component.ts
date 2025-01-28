import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  // Declare booleans for account, family and setting and initially set account to true and family and settings to false
  accountVisible: boolean = true;
  familyVisible: boolean = false;
  settingsVisible: boolean = false;


  showAccount() {
    this.accountVisible = true;
    this.familyVisible = false;
    this.settingsVisible = false;
  }

  showFamily() {
    this.accountVisible = false;
    this.familyVisible = true;
    this.settingsVisible = false;
  }



}
