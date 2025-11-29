import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
}

export interface CategoryResponse {
  data: Category[];
  meta: any;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<{ data: Category }> {
    return this.http.get<{ data: Category }>(`${this.apiUrl}/${id}`);
  }
}

