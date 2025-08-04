import { Component } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { CartService } from '../../service/cart.service';
import { Product } from '../../service/products.service';
import { Router, RouterLink } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { DecimalPipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

// Register German locale data
registerLocaleData(localeDe);


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [RouterLink, FormModule, DecimalPipe],
  providers: [
    { provide: LOCALE_ID, useValue: 'de' }
  ]
})
export class ProductListComponent {
  products: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router
  ) {
    this.products = this.productsService.getAllProducts();
  }
}
