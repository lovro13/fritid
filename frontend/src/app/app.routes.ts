import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { NgModule } from '@angular/core';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { Info } from './components/info/info';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [ 
  { path: '', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'info/:id', component: Info},
  { path: 'checkout', component: CheckoutComponent },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes) // Import router with routes
  ],
})
export class AppModule { }