import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CarImage {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface CarCategory {
  id: number;
  name: string;
  desc?: string;
}

export interface Car {
  id: number;
  documentId?: string;
  name: string;
  price: number;
  description: string;
  modelyear: number;
  image?: CarImage[];
  category?: CarCategory;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface CarResponse {
  data: Car[];
  meta: any;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    const url = `${this.apiUrl}?populate=*`;
    
    return this.http.get<CarResponse>(url).pipe(
      map(response => {
        if (!response || !response.data) {
          return [];
        }
        return response.data;
      })
    );
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<{ data: Car }>(`${this.apiUrl}/${id}?populate=*`).pipe(
      map(response => response.data)
    );
  }

  getCarByDocumentId(documentId: string): Observable<Car> {
    // Use filters to find car by documentId
    return this.http.get<CarResponse>(`${this.apiUrl}?filters[documentId][$eq]=${documentId}&populate=*`).pipe(
      map(response => {
        if (response.data && response.data.length > 0) {
          return response.data[0];
        }
        throw new Error('Car not found');
      })
    );
  }

  getImageUrl(car: Car): string {
    if (car.image && car.image.length > 0) {
      const image = car.image[0];
      let imageUrl = image.url;
      
      // If URL is relative, prepend the backend URL
      if (imageUrl.startsWith('/')) {
        imageUrl = `${environment.apiUrl.replace('/api', '')}${imageUrl}`;
      }
      
      return imageUrl;
    }
    // Fallback to default image
    return 'car1.jpg';
  }
}

