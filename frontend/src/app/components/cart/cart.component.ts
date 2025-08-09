import { Component, LOCALE_ID } from '@angular/core';
import { CartItem, CartService } from '../../service/cart.service';
import { RouterLink } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [RouterLink, DecimalPipe, CommonModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'de' }
  ]
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
    console.log("Proceeding to checkout with items:", this.cartItems);
  }

}