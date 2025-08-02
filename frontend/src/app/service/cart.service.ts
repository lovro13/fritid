import { Injectable } from '@angular/core';
import { Product } from './products.service';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly CART_KEY = 'shopping_cart';
  private cartItems: CartItem[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor() {this.loadCart()}

  private loadCart() {
    const cartData = localStorage.getItem(this.CART_KEY);
    if (cartData) {
      try {
        console.log("sem v CartService in loadCart")
        this.cartItems = JSON.parse(cartData);
        this.updateCartCount();
      } catch (e) {
        console.error('Error parsing cart data', e);
        this.cartItems = [];
      }
    }
    console.log("sem v CartService in loadCart2")
  }

  private saveCart() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems));
    this.updateCartCount();
  }

  addToCart(product: any, quantity: number, color?: string) {
    const existingItem = this.cartItems.find(item => 
      item.product.id === product.id && item.selectedColor === color
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        product,
        quantity,
        selectedColor: color
      });
    }
    
    this.saveCart();
  }

  getCartItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem(this.CART_KEY);
    this.updateCartCount();
  }

  getTotal(): number {
    const total = this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity), 0
    );
    return parseFloat(total.toFixed(2));
  }

  updateQuantity(productId: number, newQuantity: number) {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity = newQuantity;
      this.updateCartCount();
    }
  }

  removeItem(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.updateCartCount();
  }

  getCartItemsCount() {
    let output = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      output += 1;
    }
    return output;
  }

  private updateCartCount() {
    const total = this.cartItems.reduce(
      (sum, item) => sum + item.quantity, 0
    );
    this.cartItemCount.next(total);
  }
}