package com.example.outfit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@outfitstyle.com}")
    private String fromEmail;

    public void sendPasswordResetEmail(String toEmail, String resetCode) {
        if (mailSender == null) {
            System.err.println("❌ CRITICAL: Email service is not configured!");
            System.err.println("Please configure email settings in Railway environment variables.");
            throw new RuntimeException("Email service is not available. Please contact support.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Outfit Style Sense - Password Reset Code");
            message.setText(buildEmailBody(resetCode));
            
            mailSender.send(message);
            System.out.println("✅ Password reset email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send email to " + toEmail);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send reset email. Please try again later or contact support.");
        }
    }

    private String buildEmailBody(String resetCode) {
        return """
                Hello,
                
                You have requested to reset your password for your Outfit Style Sense account.
                
                Your password reset code is: %s
                
                This code will expire in 15 minutes.
                
                If you did not request this password reset, please ignore this email.
                
                Best regards,
                Outfit Style Sense Team
                """.formatted(resetCode);
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            if (mailSender == null) {
                System.out.println("Welcome email would be sent to: " + toEmail);
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to Outfit Style Sense!");
            message.setText("""
                    Hello %s,
                    
                    Welcome to Outfit Style Sense - Your Smart Indian Dress Stylist!
                    
                    We're excited to have you on board. Start exploring personalized fashion recommendations 
                    tailored to your unique style and preferences.
                    
                    Happy styling!
                    
                    Best regards,
                    Outfit Style Sense Team
                    """.formatted(userName));
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }
}
