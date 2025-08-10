package com.example.Fritid.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

import com.example.Fritid.dto.RegistrationRequest;
import com.example.Fritid.dto.LoginRequest;
import com.example.Fritid.services.UserService;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:4200")
public class AccountController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/register")
	public ResponseEntity<Map<String, Object>> register(@RequestBody RegistrationRequest registrationData) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("Registration data received: " + registrationData);
			
			// Validate input
			if (registrationData.getFirstName() == null || registrationData.getFirstName().trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "First name is required");
				return ResponseEntity.badRequest().body(response);
			}
			
			if (registrationData.getEmail() == null || registrationData.getEmail().trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "Email is required");
				return ResponseEntity.badRequest().body(response);
			}
			
			if (registrationData.getPassword() == null || registrationData.getPassword().length() < 6) {
				response.put("success", false);
				response.put("message", "Password must be at least 6 characters");
				return ResponseEntity.badRequest().body(response);
			}
			
			// Hash the password before storing
			String hashedPassword = passwordEncoder.encode(registrationData.getPassword());
			
			// Create user using proper getters
			userService.createUser(
				registrationData.getFirstName(),
				registrationData.getLastName(),
				registrationData.getEmail(),
				hashedPassword
			);
			
			System.out.println("User registered successfully: " + registrationData.getEmail());
			
			response.put("success", true);
			response.put("message", "User registered successfully");
			response.put("email", registrationData.getEmail());
			
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
			
		} catch (RuntimeException e) {
			System.err.println("Registration error: " + e.getMessage());
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(response);
		} catch (Exception e) {
			System.err.println("Unexpected error during registration: " + e.getMessage());
			response.put("success", false);
			response.put("message", "Internal server error");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginData) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			String email = loginData.getEmail();
			String password = loginData.getPassword();
			
			if (email == null || email.trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "Email is required");
				return ResponseEntity.badRequest().body(response);
			}
			
			if (password == null || password.trim().isEmpty()) {
				response.put("success", false);
				response.put("message", "Password is required");
				return ResponseEntity.badRequest().body(response);
			}
			
			// Find user by email
			var userOptional = userService.getUserByEmail(email);
			if (!userOptional.isPresent()) {
				response.put("success", false);
				response.put("message", "Invalid email or password");
				return ResponseEntity.badRequest().body(response);
			}
			
			var user = userOptional.get();
			
			// Verify password
			if (!passwordEncoder.matches(password, user.getPasswordHash())) {
				response.put("success", false);
				response.put("message", "Invalid email or password");
				return ResponseEntity.badRequest().body(response);
			}
			
			// Login successful
			response.put("success", true);
			response.put("message", "Login successful");
			response.put("user", Map.of(
				"id", user.getId(),
				"firstName", user.getFirstName(),
				"lastName", user.getLastName(),
				"email", user.getEmail()
			));
			
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			System.err.println("Login error: " + e.getMessage());
			response.put("success", false);
			response.put("message", "Internal server error");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
}
