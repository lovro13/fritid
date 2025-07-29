import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Tent',
      price: 199.99,
      description: '2-person camping tent',
      imageUrl: 'assets/tent.jpg'
    },
    {
      id: 2,
      name: 'Backpack',
      price: 89.50,
      description: '30L hiking backpack',
      imageUrl: 'assets/backpack.jpg'
    }
    // Add up to 30 products here
  ];

  getAllProducts(): Product[] {
    return this.products;
  }
}