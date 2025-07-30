import { Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/products.service';
import { Router, RouterLink } from '@angular/router';
import { FormModule } from '@coreui/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [RouterLink, FormModule]
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

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }


}