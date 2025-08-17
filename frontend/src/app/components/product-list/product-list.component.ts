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
import { environment } from '../../../environments/environment';

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
    return  `${imageUrl}`;
  }
}
