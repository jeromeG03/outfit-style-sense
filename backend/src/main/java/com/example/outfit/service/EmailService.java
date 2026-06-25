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

    @Value("${spring.mail.from:jerome322001@gmail.com}")
    private String fromEmail;

    public void sendPasswordResetEmail(String toEmail, String resetCode) {
        System.out.println("=== EMAIL SERVICE DEBUG ===");
        System.out.println("MailSender null? " + (mailSender == null));
        System.out.println("From email: " + fromEmail);
        System.out.println("To email: " + toEmail);
        
        if (mailSender == null) {
            String errorMsg = "Email service is not configured. JavaMailSender bean is NULL.\n" +
                            "Please set SPRING_MAIL_* environment variables in Railway:\n" +
                            "- SPRING_MAIL_HOST=smtp.gmail.com\n" +
                            "- SPRING_MAIL_PORT=587\n" +
                            "- SPRING_MAIL_USERNAME=your-email@gmail.com\n" +
                            "- SPRING_MAIL_PASSWORD=your-app-password";
            System.err.println("❌ " + errorMsg);
            throw new RuntimeException("Email service not configured");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Outfit Style Sense - Password Reset Code");
            message.setText(buildEmailBody(resetCode));
            
            System.out.println("Attempting to send email via SMTP...");
            mailSender.send(message);
            System.out.println("✅ Password reset email sent successfully to: " + toEmail);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            String errorMsg = "Gmail authentication failed. This usually means:\n" +
                            "1. App Password is incorrect\n" +
                            "2. App Password has expired\n" +
                            "3. 2-Step Verification is not enabled on Gmail\n" +
                            "Original error: " + e.getMessage();
            System.err.println("❌ " + errorMsg);
            e.printStackTrace();
            throw new RuntimeException("Email authentication failed - check Gmail App Password");
        } catch (org.springframework.mail.MailSendException e) {
            String errorMsg = "Failed to send email. This usually means:\n" +
                            "1. Gmail is blocking Railway's IP address\n" +
                            "2. Network/firewall issue\n" +
                            "3. SMTP server unreachable\n" +
                            "Original error: " + e.getMessage();
            System.err.println("❌ " + errorMsg);
            e.printStackTrace();
            throw new RuntimeException("Email delivery failed - Gmail may be blocking Railway IPs");
        } catch (Exception e) {
            String errorMsg = "Unexpected error: " + e.getClass().getName() + " - " + e.getMessage();
            System.err.println("❌ " + errorMsg);
            e.printStackTrace();
            throw new RuntimeException("Email service error: " + e.getMessage());
        }
    }
    
    public boolean testEmailConfiguration() {
        if (mailSender == null) {
            System.err.println("❌ JavaMailSender is NULL - email not configured");
            return false;
        }
        
        try {
            System.out.println("Testing email configuration...");
            System.out.println("From email: " + fromEmail);
            System.out.println("Mail sender configured: " + mailSender.getClass().getName());
            return true;
        } catch (Exception e) {
            System.err.println("❌ Error testing email config: " + e.getMessage());
            return false;
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
