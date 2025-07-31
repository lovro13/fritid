import { Component } from '@angular/core';
import { CartService } from './modules/cart.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [RouterOutlet, RouterLink, FooterComponent]
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
