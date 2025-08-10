package com.example.Fritid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @GetMapping("/test-db")
    public String testDatabase() {
        try {
            String result = jdbcTemplate.queryForObject("SELECT version()", String.class);
            return "Database connected! PostgreSQL version: " + result;
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
}