import { Component } from '@angular/core';
import { CartService } from './services/cart.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [RouterOutlet, RouterLink]
})
export class App{
  get cartItemCount() {
    return this.cartService.getCartItemsCount();
  }

  constructor(private cartService: CartService) {}

  // In component class
  testClick() {
    console.log('Click registered!'); // If this logs, problem is with router
  }
}
