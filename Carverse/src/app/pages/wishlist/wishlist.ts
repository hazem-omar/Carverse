import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CarService, Car } from '../../services/car.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Wishlist implements OnInit {
  wishlist: Car[] = [];
  loading: boolean = false;

  constructor(
    public wishlistService: WishlistService,
    private carService: CarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load wishlist from backend
    this.loading = true;
    this.wishlistService.loadWishlistFromBackend(true).subscribe({
      next: (cars) => {
        this.wishlist = cars;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading wishlist in component:', err);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });

    // Subscribe to wishlist changes
    this.wishlistService.wishlist$.subscribe((wishlist) => {
      this.wishlist = wishlist;
      this.cdr.markForCheck();
    });
  }

  loadWishlist(): void {
    this.wishlist = this.wishlistService.getWishlist();
  }

  removeFromWishlist(car: Car): void {
    this.wishlistService.removeFromWishlist(car).subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
        this.cdr.markForCheck();
      },
    });
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist().subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error clearing wishlist:', err);
        this.cdr.markForCheck();
      },
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

  trackByDocumentId(index: number, car: Car): string {
    return car.documentId || car.id.toString();
  }
}
