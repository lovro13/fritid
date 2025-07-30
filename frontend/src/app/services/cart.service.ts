import { Injectable } from '@angular/core';
import { Product } from '../services/products.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems: Product[] = [];

  addToCart(product: Product) {
    this.cartItems.push({ ...product });
  }

  getCartItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  getCartItemsCount() {
    let output = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      output += 1;
    }
    return output;
  }
}