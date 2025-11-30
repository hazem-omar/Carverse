import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cover',
  imports: [CommonModule],
  templateUrl: './cover.html',
  styleUrl: './cover.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cover{
  currentUser: User | null = null;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserValue();
    
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  getWelcomeMessage(): string {
    if (this.currentUser) {
      return `Welcome, ${this.currentUser.username}`;
    }
    return 'Welcome To Carverse';
  }
}