import { Component } from '@angular/core';
import { CartItem, CartService } from '../../service/cart.service';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [RouterLink, DecimalPipe]
})
export class CartComponent {
  cartItems: CartItem[] = [];
  private cartSub!: Subscription;
  total = 0;

  constructor(private cartService: CartService) {
    this.total = this.cartService.getTotal();
  }


  ngOnInit() {
    this.cartSub = this.cartService.cartItems$.subscribe(items => { this.cartItems = items })
  }

  removeItem(item: CartItem) {
    this.cartService.removeItemFromCart(item);
  }

  checkout() {
    alert('Order placed!');
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }
}