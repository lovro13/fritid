package com.example.Fritid.controllers;

import com.example.Fritid.dto.CheckoutRequest;
import com.example.Fritid.dto.PersonInfo;
import com.example.Fritid.dto.CartItem;
import com.example.Fritid.models.User;
import com.example.Fritid.models.Order;
import com.example.Fritid.models.OrderItem;
import com.example.Fritid.models.Product;
import com.example.Fritid.services.UserService;
import com.example.Fritid.services.OrderService;
import com.example.Fritid.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class CheckoutController {

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

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

        // Save user address data if user is logged in
        Integer userId = checkoutData.getUserId();
        System.out.println("User ID: " + userId);
        if (userId != null) {
            Optional<User> userOpt = userService.getUserById(userId);
            System.out.println("User Opt: " + userOpt);
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // Update user address information
                user.setAddress(personInfo.getAddress());
                user.setPostalCode(personInfo.getPostalCode());
                user.setCity(personInfo.getCity());
                user.setPhoneNumber(personInfo.getPhoneNumber());

                // Save updated user
                userService.saveUser(user);
                System.out.println("Updated user address data for user ID: " + userId);
            }
        }

        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            System.out.println("Item: " + cartItem.getProduct() +
                    " - Quantity: " + cartItem.getQuantity() +
                    " - Colors: " + cartItem.getProduct().getColors());
            totalAmount = totalAmount.add(cartItem.getTotal());

            // Create order item (we'll set the order reference later)
            Integer productId = cartItem.getProduct().getId();
            System.out.println("Processing cart item with id: " + productId);
            Optional<Product> productOpt = productService.getProductById(productId);
            if (productOpt.isPresent()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(productOpt.get());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(cartItem.getProduct().getPrice());
                orderItems.add(orderItem);
            }
        }

        System.out.println("Total Amount: " + totalAmount);

        // Create and save order to database
        Order order = new Order();
        order.setTotalAmount(totalAmount);
        order.setStatus(Order.OrderStatus.PENDING);

        // Set shipping information
        order.setShippingFirstName(personInfo.getFirstName());
        order.setShippingLastName(personInfo.getLastName());
        order.setShippingEmail(personInfo.getEmail());
        order.setShippingAddress(personInfo.getAddress());
        order.setShippingPostalCode(personInfo.getPostalCode());
        order.setShippingCity(personInfo.getCity());
        order.setShippingPhoneNumber(personInfo.getPhoneNumber());

        // Set user if logged in
        if (userId != null) {
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isPresent()) {
                order.setUser(userOpt.get());
            }
        }

        // Use a direct approach to save the order with order items
        try {
            User user = null;
            if (userId != null) {
                Optional<User> userOpt = userService.getUserById(userId);
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                }
            }

            // Create order with shipping details
            Order savedOrder = orderService.createOrderWithShipping(
                    user,
                    orderItems,
                    personInfo.getFirstName(),
                    personInfo.getLastName(),
                    personInfo.getEmail(),
                    personInfo.getAddress(),
                    personInfo.getPostalCode(),
                    personInfo.getCity(),
                    personInfo.getCountry(),
                    personInfo.getPhoneNumber());

            System.out.println("Order created with ID: " + savedOrder.getId());
            order = savedOrder;
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
        }

        // Create successful response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Checkout processed successfully! Order saved to database.");
        response.put("orderId", order != null ? order.getId() : "ORDER-" + System.currentTimeMillis());
        response.put("customerFirstName", personInfo.getFirstName());
        response.put("customerLastName", personInfo.getLastName());
        response.put("totalAmount", totalAmount);
        response.put("itemCount", cartItems.length);
        response.put("orderStatus", order != null ? order.getStatus().toString() : "PENDING");

        return ResponseEntity.ok(response);
    }

    // Test endpoint to see what data structure is expected
    // @GetMapping("/checkout/test")
    // public ResponseEntity<Map<String, Object>> getTestData() {
    //     // Create sample data to show the expected structure
    //     PersonInfo samplePerson = new PersonInfo(
    //             "John",
    //             "Doe",
    //             "john@example.com",
    //             "123 Main St",
    //             "12345",
    //             "New York",
    //             "USA",
    //             "+1-555-0123");

    //     CartItem[] sampleItems = {
    //             new CartItem(1, "Sample Product 1", new BigDecimal("29.99"), 2, "/assets/product1.jpg", null, null),
    //             new CartItem(2, "Sample Product 2", new BigDecimal("15.50"), 1, "/assets/product2.jpg", null, null)
    //     };

    //     CheckoutRequest sampleRequest = new CheckoutRequest(samplePerson, sampleItems);
    //     System.out.println("Sample PersonInfo: " + samplePerson);

    //     Map<String, Object> response = new HashMap<>();
    //     response.put("message", "This is the expected data structure for /api/checkout");
    //     response.put("sampleData", sampleRequest);
    //     // Print the sample objects to the terminal
    //     for (CartItem item : sampleItems) {
    //         System.out.println("Sample CartItem: " + item);
    //     }
    //     System.out.println("Sample CheckoutRequest: " + sampleRequest);

    //     return ResponseEntity.ok(response);
    // }
}
