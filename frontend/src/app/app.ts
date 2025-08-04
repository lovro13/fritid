import { Component } from '@angular/core';
import { CartService } from './service/cart.service';
import { AuthService, User } from './service/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [RouterOutlet, RouterLink, FooterComponent, CommonModule]
})
export class App{
  user$: Observable<User | null>;

  get cartItemCount() {
    return this.cartService.getCartItemsCount();
  }

  constructor(
    private cartService: CartService, 
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout();
  }

  // In component class
  testClick() {
    console.log('Click registered!'); // If this logs, problem is with router
  }
}
