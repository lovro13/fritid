import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product, ProductsService } from "../../services/products.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  product: any;
  selectedColor: string = '';
  quantity: number = 1;
  selectedQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      console.log("got product")
      this.product = this.productService.getProductById(id);
    } else {
      console.error("Product id not found in route");
    }
    this.selectedColor = this.product.colors[0];
  }


  addToCart(product: any) {
    for (let i = 0; i < this.selectedQuantity; i++) {
      this.cartService.addToCart(product);
    }
    
    // Reset quantity after adding to cart
    this.selectedQuantity = 1;
  }
}
