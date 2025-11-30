import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarService, Car } from '../../services/car.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './error-page.html',
  styleUrl: './error-page.css'
})
export class ErrorPage implements OnInit, OnDestroy {
  featuredCars: Car[] = [];
  loading: boolean = false;

  constructor(
    private carService: CarService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFeaturedCars();
    // Make navbar minimal
    this.makeNavbarMinimal();
  }

  ngOnDestroy(): void {
    // Restore navbar to normal when leaving error page
    this.restoreNavbar();
  }

  makeNavbarMinimal(): void {
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
      navbar.classList.add('minimal-navbar');
    }
  }

  restoreNavbar(): void {
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
      navbar.classList.remove('minimal-navbar');
    }
  }

  loadFeaturedCars(): void {
    this.loading = true;
    this.carService.getCars().subscribe({
      next: (cars) => {
        // Get random 3 cars
        const shuffled = cars.sort(() => 0.5 - Math.random());
        this.featuredCars = shuffled.slice(0, 3);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getImageUrl(car: Car): string {
    return this.carService.getImageUrl(car);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }

  trackByDocumentId(index: number, car: Car): string {
    return car.documentId || car.id.toString();
  }
}
