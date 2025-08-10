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

  private products: Product[] = [];

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => {
        this.products = products.map(p => ({
          ...p,
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