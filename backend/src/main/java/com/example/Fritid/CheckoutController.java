package com.example.Fritid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class CheckoutController {

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> processCheckout(@RequestBody Object checkoutData) {
        System.out.println("Received checkout data: " + checkoutData.toString());
        
        // Create JSON response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Checkout processed successfully! Backend is working.");
        response.put("orderId", "ORDER-" + System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}
