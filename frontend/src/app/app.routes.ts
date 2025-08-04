import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { Info } from './components/info/info';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { AuthComponent } from './components/auth/auth.component';

export const routes: Routes = [ 
  { path: '', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'info/:id', component: Info},
  { path: 'checkout', component: CheckoutComponent },
  { path: 'payment-method', component: PaymentMethodComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' }
];