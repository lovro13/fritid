package com.example.Fritid.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Fritid.dto.RegistrationRequest;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:4200")
public class AccountController {
	@PostMapping("/register")
	public Boolean register(@RequestBody RegistrationRequest registrationData) {
		System.out.println("Registration data received: " + registrationData);
		return true;
	}

	@PostMapping("/login")
	public Boolean login(@RequestBody String loginData) {
		// Login logic will go here
		return true;
	}
}
