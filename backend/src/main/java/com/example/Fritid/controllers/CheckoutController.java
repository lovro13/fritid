package com.example.Fritid.controllers;

import com.example.Fritid.dto.CheckoutRequest;
import com.example.Fritid.dto.PersonInfo;
import com.example.Fritid.dto.CartItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class CheckoutController {

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> processCheckout(@RequestBody CheckoutRequest checkoutData) {
        System.out.println("Received checkout data: " + checkoutData.toString());
        
        // Now you can access the data in a type-safe way
        PersonInfo personInfo = checkoutData.getPersonInfo();
        CartItem[] cartItems = checkoutData.getCartItems();
        
        // Validate the data
        if (personInfo == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Person information is required");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        if (cartItems == null || cartItems.length == 0) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Cart items are required");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Process the checkout data
        System.out.println("Customer First Name: " + personInfo.getFirstName());
        System.out.println("Customer Last Name: " + personInfo.getLastName());
        System.out.println("Customer Email: " + personInfo.getEmail());
        System.out.println("Shipping Address: " + personInfo.getAddress());
        System.out.println("Number of items: " + cartItems.length);
        
        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            System.out.println("Item: " + item.getProductName() + 
                             " - Quantity: " + item.getQuantity() + 
                             " - Price: " + item.getPrice());
            totalAmount = totalAmount.add(item.getTotal());
        }
        
        System.out.println("Total Amount: " + totalAmount);
        
        // Create successful response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Checkout processed successfully! Backend received all data.");
        response.put("orderId", "ORDER-" + System.currentTimeMillis());
        response.put("customerFirstName", personInfo.getFirstName());
        response.put("customerLastName", personInfo.getLastName());
        response.put("totalAmount", totalAmount);
        response.put("itemCount", cartItems.length);
        
        return ResponseEntity.ok(response);
    }
    
    // Test endpoint to see what data structure is expected
    @GetMapping("/checkout/test")
    public ResponseEntity<Map<String, Object>> getTestData() {
        // Create sample data to show the expected structure
        PersonInfo samplePerson = new PersonInfo(
            "John",
            "Doe",
            "john@example.com", 
            "123 Main St", 
            "12345", 
            "New York", 
            "USA", 
            "+1-555-0123"
        );
        
        CartItem[] sampleItems = {
            new CartItem(1, "Sample Product 1", new BigDecimal("29.99"), 2, "/assets/product1.jpg"),
            new CartItem(2, "Sample Product 2", new BigDecimal("15.50"), 1, "/assets/product2.jpg")
        };
        
        CheckoutRequest sampleRequest = new CheckoutRequest(samplePerson, sampleItems);
        System.out.println("Sample PersonInfo: " + samplePerson);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is the expected data structure for /api/checkout");
        response.put("sampleData", sampleRequest);
        // Print the sample objects to the terminal
        for (CartItem item : sampleItems) {
            System.out.println("Sample CartItem: " + item);
        }
        System.out.println("Sample CheckoutRequest: " + sampleRequest);
        
        return ResponseEntity.ok(response);
    }
}
