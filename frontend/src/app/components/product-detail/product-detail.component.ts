import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { Product, ProductsService } from "../../service/products.service";
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [CommonModule, FormsModule, DecimalPipe]
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
    this.cartService.addItemToCart(product, this.selectedQuantity, this.selectedColor);
    // Reset quantity after adding to cart
    this.selectedQuantity = 1;
  }

  increaseQuantity() {
    if (this.selectedQuantity < 99) {
      this.selectedQuantity++;
    }
  }

  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  getColorValue(color: string): string {
    // Map color names to actual color values
    const colorMap: { [key: string]: string } = {
      'rjava': '#8B4513',
      'kobalt modra': '#0047AB',
      'modra': '#1976d2',
      'zelena': '#4CAF50',
      'rdeča': '#F44336',
      'črna': '#212121',
      'bela': '#FFFFFF',
      'siva': '#9E9E9E',
      'rumena': '#FFEB3B',
      'oranžna': '#FF9800',
      'vijolična': '#9C27B0',
      'roza': '#E91E63'
    };
    
    return colorMap[color.toLowerCase()] || '#999999';
  }
}
