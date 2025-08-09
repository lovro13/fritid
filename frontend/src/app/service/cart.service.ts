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
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  // ko se spletna stran začne nalagat tukaj nastavi na 
  // voziček iz local storage ali pa praznega če voziček iz local storage ne obstaja
  constructor() { this.loadCartFromLocalStorage() }
  private loadCartFromLocalStorage() {
    const cartData = localStorage.getItem(this.CART_KEY);
    if (cartData) {
      try {
        console.log("sem v CartService in loadCart")
        this.cartItemsSubject.next(JSON.parse(cartData));
      } catch (e) {
        console.error('Error parsing cart data', e);
        this.cartItemsSubject.next([]);
      }
    }
    console.log("sem v CartService in loadCart2")
  }

  private saveCart() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItemsSubject.value));
  }

  addItemToCart(product: Product, quantity: number, selectedColor: string) {
    let currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item =>
      item.product.id === product.id &&
      item.selectedColor === selectedColor
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity, selectedColor });
    }
    this.cartItemsSubject.next(currentItems);
    this.saveCart();
    console.log("Item added to cart:", product, quantity, selectedColor);
  }

  removeItemFromCart(item: CartItem) {
    let cartItemsTemp = this.cartItemsSubject.value;
    for (let i = 0; i < cartItemsTemp.length; i++) {
      if (cartItemsTemp[i] == item) {
        cartItemsTemp.splice(i, 1);
      }
    }
    this.cartItemsSubject.next(cartItemsTemp);
    this.saveCart();
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }

  getTotal(): number {
    const cartItemsTemp = this.cartItemsSubject.value;
    let total_temp = 0;
    for (let i = 0; i < cartItemsTemp.length; i++) {
      total_temp += cartItemsTemp[i].product.price * cartItemsTemp[i].quantity;
    }
    return total_temp;
  }

  getCartItemsCount() {
    return this.cartItemsSubject.value.length
  }


  ngOnDestroy() {
    this.saveCart();
  }

}