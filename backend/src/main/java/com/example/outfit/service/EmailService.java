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
        try {
            if (mailSender == null) {
                // For development/demo: just log the code
                System.out.println("=================================================");
                System.out.println("PASSWORD RESET CODE FOR: " + toEmail);
                System.out.println("RESET CODE: " + resetCode);
                System.out.println("This code is valid for 15 minutes");
                System.out.println("=================================================");
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Outfit Style Sense - Password Reset Code");
            message.setText(buildEmailBody(resetCode));
            
            mailSender.send(message);
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            // Fallback: print to console for development
            System.out.println("=================================================");
            System.out.println("PASSWORD RESET CODE FOR: " + toEmail);
            System.out.println("RESET CODE: " + resetCode);
            System.out.println("=================================================");
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
