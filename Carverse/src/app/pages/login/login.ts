import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  credentials: LoginCredentials = {
    identifier: '',
    password: '',
  };
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.isLoading) return;

    // Validate form
    if (!this.credentials.identifier || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields';
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        // Redirect to returnUrl or home page
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Login error:', error);

        if (error.status === 400) {
          this.errorMessage = error.error?.error?.message || 'Invalid email or password';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
        } else {
          this.errorMessage = error.error?.error?.message || 'Login failed. Please try again.';
        }

        this.cdr.markForCheck();
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.cdr.markForCheck();
  }
}
