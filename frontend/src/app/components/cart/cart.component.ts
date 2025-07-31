import { Component } from '@angular/core';
import { CartService } from '../../modules/cart.module';
import { Product } from '../../modules/products.module';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: Product[] = [];
  total = 0;

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  checkout() {
    alert('Order placed!');
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }
}