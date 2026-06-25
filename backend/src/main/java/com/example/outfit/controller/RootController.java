package com.example.outfit.controller;

import com.example.outfit.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "online");
        response.put("message", "Outfit Style Sense API is running");
        response.put("version", "1.0.0");
        response.put("endpoints", new String[]{
            "/api/occasions",
            "/api/users",
            "/api/wardrobe",
            "/api/trends",
            "/api/skintone",
            "/api/psychology",
            "/api/virtual-tryon"
        });
        return response;
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return response;
    }
    
    @GetMapping("/test-email-config")
    public Map<String, Object> testEmailConfig() {
        Map<String, Object> response = new HashMap<>();
        boolean configured = emailService.testEmailConfiguration();
        response.put("emailConfigured", configured);
        response.put("message", configured 
            ? "Email service is properly configured" 
            : "Email service is NOT configured - check environment variables");
        return response;
    }
}
