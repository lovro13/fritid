import { Component } from '@angular/core';
import { CartItem, CartService } from '../../modules/cart.module';
// ime
// priimek
// naslov
// poštna številka
// kraj
// elektornski naslov
// telefon
// ID  za DDV (podjetja) (optional)
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity >= 1) {
      this.cartService.updateQuantity(item.product.id, newQuantity);
      this.total = this.cartService.getTotal();
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.product.id);
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