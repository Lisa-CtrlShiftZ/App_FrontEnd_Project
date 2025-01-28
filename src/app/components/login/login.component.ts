import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  authService = inject(AuthService);
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) { }

  //Valideert input 
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({email, password}).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigate(['/dashboard']); // Redirect to a different page upon successful login
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.loginError = 'Inloggegevens incorrect';
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }


}

