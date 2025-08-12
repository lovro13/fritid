import { Component, OnInit, inject } from '@angular/core';
import { ProductsService, Product } from '../../service/products.service';
import { CartService } from '../../service/cart.service';
import { Router, RouterLink } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { DecimalPipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Observable } from 'rxjs';

// Register German locale data
registerLocaleData(localeDe);


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [RouterLink, FormModule, DecimalPipe, CommonModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'de' }
  ]
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private router = inject(Router);

  constructor() {
    this.products$ = this.productsService.getAllProducts();
  }

  ngOnInit(): void {
    // The products are now fetched via the async pipe in the template
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    
    // If the URL already includes the protocol, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it starts with /images/, prepend the backend URL
    if (imageUrl.startsWith('/images/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    
    // Otherwise, assume it's a relative path and construct the full URL
    return `http://localhost:8080/images/${imageUrl}`;
  }
}
