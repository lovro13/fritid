import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '../../../service/products.service';
import { AdminService } from '../../../service/admin.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);

  products$!: Observable<Product[]>;
  productForm: FormGroup;
  isEditing = false;
  currentProductId: number | null = null;
  selectedImageFile: File | null = null;
  selectedImagePreview: string | null = null;
  isUploading = false;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      image_url: ['', Validators.required],
      colors: [''],
      category: [''],
      stock_quantity: [0, Validators.min(0)],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products$ = this.adminService.getProducts();
  }

  onEdit(product: Product): void {
    this.isEditing = true;
    this.currentProductId = product.id;
    
    // Convert colors array to comma-separated string
    const colorsString = Array.isArray(product.colors) 
      ? product.colors.join(', ') 
      : '';
    
    // Set image preview if editing
    this.selectedImagePreview = product.image_url || null;
    this.selectedImageFile = null;
    
    // Properly map the product data to form controls
    this.productForm.patchValue({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      image_url: product.image_url || '',
      colors: colorsString,
      category: product.category || '',
      stock_quantity: product.stock_quantity || 0,
      is_active: product.is_active !== undefined ? product.is_active : true
    });

    // Scroll to the form for better UX
    document.querySelector('.product-form')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.loadProducts();
          // If we're editing the deleted product, reset the form
          if (this.currentProductId === id) {
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error deleting product. Please try again.');
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');  
        return;
      }
      
      this.selectedImageFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Set a temporary placeholder to satisfy form validation
      this.productForm.patchValue({ image_url: 'WILL_BE_UPLOADED' });
    }
  }

  private async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    this.isUploading = true;
    
    try {
      const response = await fetch(`${environment.apiBase}/api/images/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      
      console.log('Image uploaded successfully:', data.imageUrl);
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      this.isUploading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Check if image is required for new products
    if (!this.isEditing && !this.selectedImageFile) {
      alert('Please select an image for the product.');
      return;
    }

    const productData = this.productForm.value;
    
    // Convert comma-separated colors string to array
    if (productData.colors && typeof productData.colors === 'string') {
      productData.colors = productData.colors
        .split(',')
        .map((color: string) => color.trim())
        .filter((color: string) => color.length > 0);
    } else {
      productData.colors = [];
    }

    try {
      // Upload image if a new one was selected
      if (this.selectedImageFile) {
        const uploadedImageUrl = await this.uploadImage(this.selectedImageFile);
        productData.image_url = uploadedImageUrl;
      }

      if (this.isEditing && this.currentProductId) {
        this.adminService.updateProduct(this.currentProductId, productData).subscribe({
          next: () => {
            console.log('Product updated successfully');
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error updating product:', error);
            alert('Error updating product. Please try again.');
          }
        });
      } else {
        this.adminService.createProduct(productData). subscribe({
          next: () => {
            console.log('Product created successfully');
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error creating product:', error);
            alert('Error creating product. Please try again.');
          }
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.selectedImageFile = null;
    this.selectedImagePreview = null;
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      colors: '',
      category: '',
      stock_quantity: 0,
      is_active: true
    });
  }

  // Helper method to check if a field has errors and is touched
  hasFieldError(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  // Helper method to get field error message
  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  onImageLoad(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      console.log('Image loaded successfully:', target.src);
    }
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    
    // If the URL already includes the protocol, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it starts with /images/, prepend the backend URL
    if (imageUrl.startsWith('/images/')) {
      return `${environment.apiBase}${imageUrl}`;
    }
    
    // Otherwise, assume it's a relative path and construct the full URL
    return `${environment.apiBase}/images/${imageUrl}`;
  }

  isFormReadyForSubmit(): boolean {
    const basicFormValid = this.productForm.get('name')?.valid && 
                          this.productForm.get('price')?.valid;
    
    // For new products, we need either a selected image or an existing image_url
    const hasImageForNewProduct = this.isEditing || this.selectedImageFile || 
                                 (this.productForm.get('image_url')?.value && 
                                  this.productForm.get('image_url')?.value !== 'WILL_BE_UPLOADED');
    
    return !!basicFormValid && hasImageForNewProduct;
  }
}
