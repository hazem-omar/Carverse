import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterData } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  registerData: RegisterData = {
    username: '',
    email: '',
    password: ''
  };
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.isLoading) return;

    // Validate form
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill in all required fields';
      this.cdr.markForCheck();
      return;
    }

    if (this.registerData.username.length < 3) {
      this.errorMessage = 'Username must be at least 3 characters long';
      this.cdr.markForCheck();
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      this.cdr.markForCheck();
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.cdr.markForCheck();
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting...';
        this.cdr.markForCheck();
        
        // Redirect to home page after 1 second
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        
        if (error.status === 400) {
          const errorMsg = error.error?.error?.message || 'Registration failed';
          if (errorMsg.includes('email') || errorMsg.includes('Email')) {
            this.errorMessage = 'This email is already registered';
          } else if (errorMsg.includes('username') || errorMsg.includes('Username')) {
            this.errorMessage = 'This username is already taken';
          } else {
            this.errorMessage = errorMsg;
          }
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
        } else {
          this.errorMessage = error.error?.error?.message || 'Registration failed. Please try again.';
        }
        
        this.cdr.markForCheck();
      }
    });
  }
}
