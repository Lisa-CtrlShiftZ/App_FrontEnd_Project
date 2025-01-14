import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  authService = inject(AuthService);
  router = inject(Router);
  http = inject(HttpClient);

 constructor() {
  this.registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$'),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    }
  );
}

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      group.get('confirmPassword')?.setErrors(null);
    }
  }

  public onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form values:', this.registerForm.value);

      // Call signup method from AuthService to send data to API
      this.authService.signup(this.registerForm.value)
        .subscribe({
          next: (data: any) => {
            console.log('Signup successful:', data);
            this.router.navigate(['/dashbord']); // Redirect to login after successful signup
          },
          error: (err) => {
            console.error('Error during signup:', err);
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }
}



