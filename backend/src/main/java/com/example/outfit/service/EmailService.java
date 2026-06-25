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
            String errorMsg = "Email service is not configured. Missing spring.mail.* properties.";
            System.err.println("❌ CRITICAL: " + errorMsg);
            System.err.println("Configure SPRING_MAIL_* environment variables in Railway.");
            throw new RuntimeException(errorMsg);
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Outfit Style Sense - Password Reset Code");
            message.setText(buildEmailBody(resetCode));
            
            System.out.println("Attempting to send email to: " + toEmail + " from: " + fromEmail);
            mailSender.send(message);
            System.out.println("✅ Password reset email sent successfully to: " + toEmail);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            String errorMsg = "Email authentication failed. Check Gmail App Password: " + e.getMessage();
            System.err.println("❌ " + errorMsg);
            e.printStackTrace();
            throw new RuntimeException("Email authentication failed. Please contact support with error code: AUTH_FAIL");
        } catch (org.springframework.mail.MailSendException e) {
            String errorMsg = "Failed to send email (network/SMTP issue): " + e.getMessage();
            System.err.println("❌ " + errorMsg);
            e.printStackTrace();
            throw new RuntimeException("Failed to send email. Please check your network connection or try again later.");
        } catch (Exception e) {
            String errorMsg = "Unexpected error sending email: " + e.getClass().getName() + " - " + e.getMessage();
            System.err.println("❌ " + errorMsg);
            e.printStackTrace();
            throw new RuntimeException("Failed to send email. Please try again later or contact support.");
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
