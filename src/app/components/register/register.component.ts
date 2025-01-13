import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(){
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  authService = inject(AuthService);
  router = inject(Router);
  http = inject(HttpClient);

  

  public onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.authService.signup(this.registerForm.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['/login']);
          },
          error: (err) => console.log(err)
        });
    }
  }

  register(email: string, password: string) {
    const apiUrl = 'HIER-MOET-EEN-API-LINK';

    // API call to the backend
    this.http.post(apiUrl, { email, password }).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('User registered successfully!');
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }
}


