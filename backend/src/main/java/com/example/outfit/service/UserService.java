
package com.example.outfit.service;

import com.example.outfit.model.User;
import com.example.outfit.model.PasswordResetToken;
import com.example.outfit.repository.UserRepository;
import com.example.outfit.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;

    @Autowired
    private EmailService emailService;

    private static final SecureRandom random = new SecureRandom();

    public User signup(User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByUserName(user.getUserName())) {
            throw new RuntimeException("Username already taken");
        }
        
        // Set default auth provider if not set
        if (user.getAuthProvider() == null) {
            user.setAuthProvider("local");
        }
        
        // In production, encode the password using BCrypt
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        User savedUser = userRepository.save(user);
        
        // Send welcome email
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getUserName());
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
        
        return savedUser;
    }

    public Optional<User> loginWithEmail(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }

    public Optional<User> login(String userName, String password) {
        Optional<User> user = userRepository.findByUserName(userName);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }

    @Transactional
    public void initiatePasswordReset(String email) {
        System.out.println("Initiating password reset for: " + email);
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Don't reveal if email exists or not (security best practice)
            System.out.println("No user found with email: " + email + ", but returning success for security");
            return;
        }

        System.out.println("User found, generating reset code...");
        
        // Delete any existing unused tokens for this email
        resetTokenRepository.deleteByEmail(email);

        // Generate 6-digit reset code
        String resetCode = String.format("%06d", random.nextInt(1000000));
        System.out.println("Reset code generated: " + resetCode);

        // Save reset token
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setToken(resetCode);
        resetTokenRepository.save(token);
        System.out.println("Reset token saved to database");

        // Send email - this will throw exception if email fails
        try {
            System.out.println("Attempting to send email...");
            emailService.sendPasswordResetEmail(email, resetCode);
            System.out.println("Email sent successfully");
        } catch (Exception e) {
            System.err.println("Failed to send email, but token was saved: " + e.getMessage());
            // Log the code for debugging
            System.err.println("RESET CODE FOR DEBUGGING (Remove in production): " + resetCode);
            throw new RuntimeException("Email service is currently unavailable. Please contact support or try again later.");
        }
    }

    @Transactional
    public boolean verifyResetCode(String email, String code) {
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository.findByEmailAndUsedFalse(email);
        if (tokenOpt.isEmpty()) {
            return false;
        }

        PasswordResetToken token = tokenOpt.get();
        return !token.isExpired() && token.getToken().equals(code);
    }

    @Transactional
    public boolean resetPassword(String email, String code, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = resetTokenRepository.findByEmailAndUsedFalse(email);
        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("Invalid or expired reset code");
        }

        PasswordResetToken token = tokenOpt.get();
        if (token.isExpired() || !token.getToken().equals(code)) {
            throw new RuntimeException("Invalid or expired reset code");
        }

        // Update password
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        // In production, encode the password
        // user.setPassword(passwordEncoder.encode(newPassword));
        user.setPassword(newPassword);
        userRepository.save(user);

        // Mark token as used
        token.setUsed(true);
        resetTokenRepository.save(token);

        return true;
    }

    public Optional<User> findOrCreateGoogleUser(String email, String name, String googleId) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            return existingUser;
        }

        // Create new user from Google account
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUserName(name.replaceAll("\\s+", "").toLowerCase() + "_" + random.nextInt(1000));
        newUser.setPassword(googleId); // Use Google ID as password placeholder
        newUser.setAuthProvider("google");
        
        return Optional.of(userRepository.save(newUser));
    }
}
