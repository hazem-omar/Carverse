import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CarService, Car } from '../../services/car.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-car-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './car-details.html',
  styleUrl: './car-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarDetails implements OnInit {
  car: Car | null = null;
  loading: boolean = true;
  error: string | null = null;
  isInWishlist: boolean = false;

  constructor(
    private carService: CarService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const documentId = params['documentId'];
      this.loadCar(documentId);
    });
  }

  loadCar(documentId: string): void {
    this.loading = true;
    this.error = null;

    this.carService.getCarByDocumentId(documentId).subscribe({
      next: (car) => {
        this.car = car;
        this.isInWishlist = this.wishlistService.isInWishlist(car);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load car details. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  toggleWishlist(): void {
    if (!this.car) return;

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      // Redirect to login page
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.car).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error removing from wishlist:', err);
          this.cdr.markForCheck();
        }
      });
    } else {
      this.wishlistService.addToWishlist(this.car).subscribe({
        next: () => {
          this.isInWishlist = true;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error adding to wishlist:', err);
          this.cdr.markForCheck();
        }
      });
    }
  }

  getImageUrl(car: Car): string {
    return this.carService.getImageUrl(car);
  }

  getAllImages(car: Car): string[] {
    if (car.image && car.image.length > 0) {
      return car.image.map(img => {
        let url = img.url;
        if (url.startsWith('/')) {
          url = `http://localhost:1337${url}`;
        }
        return url;
      });
    }
    return [];
  }

  setMainImage(imgUrl: string): void {
    if (this.car && this.car.image) {
      // Find the image and update the main display
      const img = this.car.image.find(i => {
        let url = i.url;
        if (url.startsWith('/')) {
          url = `http://localhost:1337${url}`;
        }
        return url === imgUrl;
      });
      if (img) {
        // Move this image to the front
        const index = this.car.image.indexOf(img);
        this.car.image.splice(index, 1);
        this.car.image.unshift(img);
      }
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US').format(price) + ' EGP';
  }
}

