package com.example.outfit.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

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
}
