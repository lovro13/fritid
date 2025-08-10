package com.example.Fritid.dto;

import java.math.BigDecimal;

import com.example.Fritid.models.Product;

public class CartItem {
    private Product product;
    private Integer quantity;
    private String selectedColor;

    // Default constructor
    public CartItem() {}

    // Constructor with product and quantity
    public CartItem(Product product, Integer quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    // Constructor with product, quantity, and selected color
    public CartItem(Product product, Integer quantity, String selectedColor) {
        this.product = product;
        this.quantity = quantity;
        this.selectedColor = selectedColor;
    }

    // Getters and setters
    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getSelectedColor() {
        return selectedColor;
    }

    public void setSelectedColor(String selectedColor) {
        this.selectedColor = selectedColor;
    }

    // Calculated total for this cart item
    public BigDecimal getTotal() {
        if (product != null && product.getPrice() != null && quantity != null) {
            return product.getPrice().multiply(new BigDecimal(quantity));
        }
        return BigDecimal.ZERO;
    }

    @Override
    public String toString() {
        return "CartItem{" +
                "product=" + product +
                ", quantity=" + quantity +
                ", total=" + getTotal() +
                '}';
    }
}
