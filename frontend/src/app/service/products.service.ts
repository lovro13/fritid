import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  colors: string[];
  category?: string;
  stock_quantity?: number;
  is_active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/products';
  private backendUrl = 'http://localhost:8080';

  private products: Product[] = [];

  private normalizeImageUrl(imageUrl: string): string {
    // If the image URL is already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it starts with /, it's already a proper path from backend, just prefix with backend URL
    if (imageUrl.startsWith('/')) {
      return `${this.backendUrl}${imageUrl}`;
    }
    
    // If it's just a filename, assume it's in the images folder
    return `${this.backendUrl}/images/${imageUrl}`;
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => {
        this.products = products.map(p => ({
          ...p,
          // Fix image URLs to point to backend
          image_url: this.normalizeImageUrl(p.image_url),
          // The backend stores colors as a JSON string, parse it here
          colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors
        }));
        return this.products;
      }),
      catchError(error => {
        console.error('Error fetching products from API, falling back to local data if any.', error);
        return of(this.products); // return last known products or empty array
      })
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(p => {
        return {
          ...p,
          // Fix image URL to point to backend
          image_url: this.normalizeImageUrl(p.image_url),
          colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors
        };
      }),
      catchError(error => {
        console.error(`Error fetching product with id ${id}`, error);
        // Fallback to finding from the list if already fetched
        const product = this.products.find(p => p.id === Number(id));
        return of(product);
      })
    );
  }
}