package com.example.Fritid.services;

import com.example.Fritid.models.Product;
import com.example.Fritid.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }
    
    public List<Product> searchProducts(String searchTerm) {
        return productRepository.searchProducts(searchTerm);
    }
    
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product createProduct(String name, String description, BigDecimal price) {
        Product product = new Product(name, description, price);
        return productRepository.save(product);
    }
    
    public Product createProduct(String name, String description, BigDecimal price, String[] availableColors) {
        Product product = new Product(name, description, price, availableColors);
        return productRepository.save(product);
    }
    
    public Product updateProduct(Integer id, Product updatedProduct) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setAvailableColors(updatedProduct.getAvailableColors());
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found with id: " + id);
    }
    
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}
