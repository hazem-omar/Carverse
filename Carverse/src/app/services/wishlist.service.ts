import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CarService } from './car.service';
import { Car } from './car.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface WishlistItem {
  id: number;
  car: Car;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistResponse {
  data: WishlistItem | WishlistItem[];
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlists`;
  private wishlistKey = 'carverse_wishlist';
  private wishlistSubject = new BehaviorSubject<Car[]>([]);
  public wishlist$: Observable<Car[]> = this.wishlistSubject.asObservable();
  private loading = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private carService: CarService
  ) {
    // Load wishlist from backend if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadWishlistFromBackend().subscribe();
    } else {
      // Fallback to localStorage for non-authenticated users
      this.loadWishlistFromLocalStorage();
    }

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadWishlistFromBackend().subscribe();
      } else {
        this.wishlistSubject.next([]);
      }
    });
  }

  private loadWishlistFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.wishlistKey);
      const wishlist = stored ? JSON.parse(stored) : [];
      this.wishlistSubject.next(wishlist);
    } catch {
      this.wishlistSubject.next([]);
    }
  }

  private saveWishlistToLocalStorage(wishlist: Car[]): void {
    try {
      localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  loadWishlistFromBackend(force: boolean = false): Observable<Car[]> {
    if (!this.authService.isAuthenticated()) {
      return of([]);
    }

    if (this.loading && !force) {
      return this.wishlist$;
    }

    this.loading = true;
    // Use simple populate - the backend controller already handles deep populate
    return this.http.get<WishlistResponse>(`${this.apiUrl}`).pipe(
      switchMap(response => {
        // Handle response - data can be array or single object
        let items: WishlistItem[] = [];
        
        if (Array.isArray(response.data)) {
          items = response.data;
        } else if (response.data) {
          items = [response.data];
        }

        // Extract cars from wishlist items; handle cases where `item.car` is an ID
        if (items.length === 0) {
          this.wishlistSubject.next([]);
          this.loading = false;
          return of([] as Car[]);
        }

        const carObservables = items.map((item: any) => {
          const carField = item.car;
          if (!carField) {
            return of(null);
          }
          // If the backend populated the car as an object, use it
          if (typeof carField === 'object' && (carField.id || carField.documentId)) {
            // If only id is present, fetch full car data for consistency
            if (!carField.name || !carField.price) {
              return this.carService.getCarById(carField.id).pipe(catchError(() => of(null)));
            }
            return of(carField as Car);
          }
          // If the backend returned just the id (number), fetch by id
          if (typeof carField === 'number') {
            return this.carService.getCarById(carField).pipe(catchError(() => of(null)));
          }
          // If backend returned a documentId string, try to fetch by documentId
          if (typeof carField === 'string') {
            return this.carService.getCarByDocumentId(carField).pipe(catchError(() => of(null)));
          }
          return of(null);
        });

        return forkJoin(carObservables).pipe(
          map(results => results.filter((c: Car | null): c is Car => c !== null)),
          map(cars => {
            this.wishlistSubject.next(cars);
            this.loading = false;
            return cars;
          })
        );
      }),
      catchError(error => {
        console.error('Error loading wishlist:', error);
        this.loading = false;
        // Fallback to localStorage on error
        this.loadWishlistFromLocalStorage();
        return of(this.wishlistSubject.value);
      })
    );
  }

  getWishlist(): Car[] {
    return this.wishlistSubject.value;
  }

  addToWishlist(car: Car): Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      return throwError(() => new Error('User must be authenticated'));
    }

    // Check if car is already in wishlist
    if (this.isInWishlist(car)) {
      return of(false);
    }

    // Use documentId instead of id
    if (!car.documentId) {
      return throwError(() => new Error('Car documentId is required'));
    }

    // Add to backend using documentId
    return this.http.post<{ data: WishlistItem }>(this.apiUrl, {
      data: {
        carDocumentId: car.documentId
      }
    }).pipe(
      switchMap(() => {
        // After adding, reload the wishlist from backend to get full car data
        return this.loadWishlistFromBackend(true).pipe(
          map(() => true)
        );
      }),
      catchError(error => {
        console.error('Error adding to wishlist:', error);
        // On error, still try to add to local state as fallback
        const wishlist = this.getWishlist();
        if (!this.isInWishlist(car)) {
          wishlist.push(car);
          this.wishlistSubject.next([...wishlist]);
          this.saveWishlistToLocalStorage(wishlist);
        }
        // Return success so UI can reflect added state even if backend failed
        return of(true);
      })
    );
  }

  removeFromWishlist(car: Car): Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      // Fallback to localStorage
      const wishlist = this.getWishlist();
      const index = wishlist.findIndex(c => c.documentId === car.documentId);
      if (index === -1) {
        return of(false);
      }
      wishlist.splice(index, 1);
      this.wishlistSubject.next([...wishlist]);
      this.saveWishlistToLocalStorage(wishlist);
      return of(true);
    }

    // First, get all wishlist items to find the one with this car
    return this.loadWishlistFromBackend(true).pipe(
      switchMap(() => {
        // Find the wishlist item ID for this car
        return this.http.get<WishlistResponse>(`${this.apiUrl}`).pipe(
          switchMap(response => {
            let items: WishlistItem[] = [];
            if (Array.isArray(response.data)) {
              items = response.data;
            } else if (response.data) {
              items = [response.data];
            }

            // Find the item with matching car documentId
            const item = items.find((item: any) => 
              item.car && item.car.documentId === car.documentId
            );

            if (!item) {
              // Item not found, remove from local state anyway
              const wishlist = this.getWishlist();
              const index = wishlist.findIndex(c => c.documentId === car.documentId);
              if (index !== -1) {
                wishlist.splice(index, 1);
                this.wishlistSubject.next([...wishlist]);
              }
              return of(false);
            }

            // Delete the item
            return this.http.delete(`${this.apiUrl}/${item.id}`).pipe(
              switchMap(() => {
                // After deleting, reload the wishlist from backend
                return this.loadWishlistFromBackend(true).pipe(
                  map(() => true)
                );
              }),
              catchError(error => {
                console.error('Error removing from wishlist:', error);
                // Still remove from local state on error
                const wishlist = this.getWishlist();
                const index = wishlist.findIndex(c => c.documentId === car.documentId);
                if (index !== -1) {
                  wishlist.splice(index, 1);
                  this.wishlistSubject.next([...wishlist]);
                  this.saveWishlistToLocalStorage(wishlist);
                }
                // Treat as success to update UI
                return of(true);
              })
            );
          })
        );
      }),
      catchError(error => {
        console.error('Error removing from wishlist:', error);
        // If find fails, try to remove from local state
        const wishlist = this.getWishlist();
        const index = wishlist.findIndex(c => c.documentId === car.documentId);
        if (index !== -1) {
          wishlist.splice(index, 1);
          this.wishlistSubject.next([...wishlist]);
        }
        return of(false);
      })
    );
  }

  isInWishlist(car: Car): boolean {
    const wishlist = this.getWishlist();
    return wishlist.some(c => c.documentId === car.documentId);
  }

  clearWishlist(): Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      this.wishlistSubject.next([]);
      this.saveWishlistToLocalStorage([]);
      return of(true);
    }

    // Get all wishlist items from backend
    return this.http.get<WishlistResponse>(`${this.apiUrl}`).pipe(
      switchMap(response => {
        let items: WishlistItem[] = [];
        if (Array.isArray(response.data)) {
          items = response.data;
        } else if (response.data) {
          items = [response.data];
        }

        if (items.length === 0) {
          this.wishlistSubject.next([]);
          return of(true);
        }

        // Delete all items
        const deleteObservables = items.map((item: any) => 
          this.http.delete(`${this.apiUrl}/${item.id}`).pipe(
            catchError(() => of(null))
          )
        );

        // Wait for all deletions to complete
        return new Observable<boolean>(observer => {
          Promise.all(deleteObservables.map(obs => obs.toPromise())).then(() => {
            // Reload wishlist after clearing
            this.loadWishlistFromBackend(true).subscribe(() => {
              observer.next(true);
              observer.complete();
            });
          }).catch(error => {
            console.error('Error clearing wishlist:', error);
            this.wishlistSubject.next([]);
            observer.next(true);
            observer.complete();
          });
        });
      }),
      catchError(error => {
        console.error('Error clearing wishlist:', error);
        this.wishlistSubject.next([]);
        return of(true);
      })
    );
  }

  getWishlistCount(): number {
    return this.getWishlist().length;
  }
}
