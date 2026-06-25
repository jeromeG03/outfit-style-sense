
package com.example.outfit.controller;

import com.example.outfit.model.User;
import com.example.outfit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.signup(user);
            // Don't send password back to client
            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String emailOrUsername = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        // Try email login first
        Optional<User> user = userService.loginWithEmail(emailOrUsername, password);
        
        // If email login fails, try username login (backward compatibility)
        if (user.isEmpty()) {
            user = userService.login(emailOrUsername, password);
        }
        
        if (user.isPresent()) {
            User loggedInUser = user.get();
            loggedInUser.setPassword(null); // Don't send password to client
            return ResponseEntity.ok(loggedInUser);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(401).body(error);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.initiatePasswordReset(email);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "If an account exists with this email, a reset code has been sent.");
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        
        boolean isValid = userService.verifyResetCode(email, code);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        
        if (isValid) {
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Invalid or expired code");
            return ResponseEntity.status(400).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            String newPassword = request.get("newPassword");
            
            userService.resetPassword(email, code, newPassword);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successful");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/google-auth")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            String googleId = request.get("googleId");
            
            Optional<User> user = userService.findOrCreateGoogleUser(email, name, googleId);
            if (user.isPresent()) {
                User loggedInUser = user.get();
                loggedInUser.setPassword(null);
                return ResponseEntity.ok(loggedInUser);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Google authentication failed");
                return ResponseEntity.status(401).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
