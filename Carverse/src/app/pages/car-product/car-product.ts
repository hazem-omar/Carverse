import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CarService, Car } from '../../services/car.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-car-product',
  imports: [CommonModule, RouterLink],
  templateUrl: './car-product.html',
  styleUrl: './car-product.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarProduct implements OnInit, OnDestroy {
  cars: Car[] = [];
  loading: boolean = true;
  error: string | null = null;
  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private carService: CarService,
    public wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCars();
    
    // Reload cars when user logs in (if already on this page)
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (user && this.router.url === '/products') {
        this.loadCars();
      }
    });
    
    // Reload cars when navigating to this route
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/products' && !this.loading) {
        this.loadCars();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  loadCars(): void {
    this.loading = true;
    this.error = null;
    
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = `Failed to load cars. ${err.status ? `Error ${err.status}: ` : ''}${err.message || 'Please check if the backend is running on http://localhost:1337'}`;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getImageUrl(car: Car): string {
    return this.carService.getImageUrl(car);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US').format(price) + ' EGP';
  }

  getCategoryName(car: Car): string | null {
    return car.category?.name || null;
  }

  isInWishlist(car: Car): boolean {
    return this.wishlistService.isInWishlist(car);
  }

  toggleWishlist(car: Car): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Redirect to login page
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/products' } });
      return;
    }

    if (this.isInWishlist(car)) {
      this.wishlistService.removeFromWishlist(car).subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error removing from wishlist:', err);
          this.cdr.markForCheck();
        }
      });
    } else {
      this.wishlistService.addToWishlist(car).subscribe({
        next: () => {
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error adding to wishlist:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  trackByDocumentId(index: number, car: Car): string {
    return car.documentId || car.id.toString();
  }
}
