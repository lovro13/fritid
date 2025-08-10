import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '../../../service/products.service';
import { AdminService } from '../../../service/admin.service';

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
      
      // Generate unique URL for the image
      const uniqueImageUrl = this.generateUniqueImageUrl(file);
      this.productForm.patchValue({ image_url: uniqueImageUrl });
    }
  }

  private generateUniqueImageUrl(file: File): string {
    // Generate a unique identifier
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Create a unique filename
    const uniqueFilename = `product_${timestamp}_${randomString}.${fileExtension}`;
    
    // Return a URL that would be used in production
    // In a real application, this would be the URL where the file will be uploaded
    return `https://your-app-domain.com/images/products/${uniqueFilename}`;
  }

  private async uploadImage(file: File, imageUrl: string): Promise<string> {
    // In a real application, you would upload the file to your server or cloud storage
    // For now, we'll simulate the upload process
    
    this.isUploading = true;
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would:
      // 1. Upload the file to your backend/cloud storage
      // 2. Return the actual URL where the file is stored
      
      console.log('Uploading image:', file.name, 'to URL:', imageUrl);
      
      // For now, return the generated URL
      return imageUrl;
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
        const uploadedImageUrl = await this.uploadImage(this.selectedImageFile, productData.image_url);
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
}
