package com.example.outfit.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;

    @Value("${spring.mail.from:jerome322001@gmail.com}")
    private String fromEmail;

    public void sendPasswordResetEmail(String toEmail, String resetCode) {
        System.out.println("=== EMAIL SERVICE DEBUG (SendGrid HTTP API) ===");
        System.out.println("SendGrid API Key configured: " + (!sendGridApiKey.isEmpty()));
        System.out.println("From email: " + fromEmail);
        System.out.println("To email: " + toEmail);
        
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            String errorMsg = "SendGrid API key is not configured.\n" +
                            "Please set SENDGRID_API_KEY environment variable in Railway.\n" +
                            "Get your API key from: https://app.sendgrid.com/settings/api_keys";
            System.err.println("❌ " + errorMsg);
            throw new RuntimeException("Email service not configured");
        }

        try {
            Email from = new Email(fromEmail, "Outfit Style Sense");
            Email to = new Email(toEmail);
            String subject = "Outfit Style Sense - Password Reset Code";
            Content content = new Content("text/plain", buildEmailBody(resetCode));
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            System.out.println("Sending email via SendGrid HTTP API...");
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ Password reset email sent successfully!");
                System.out.println("SendGrid Status: " + response.getStatusCode());
            } else {
                String errorMsg = "SendGrid returned error status: " + response.getStatusCode() + 
                                "\nBody: " + response.getBody();
                System.err.println("❌ " + errorMsg);
                throw new RuntimeException("Failed to send email via SendGrid");
            }
            
        } catch (IOException e) {
            String errorMsg = "Failed to send email via SendGrid: " + e.getMessage();
            System.err.println("❌ " + errorMsg);
            e.printStackTrace();
            throw new RuntimeException("Email delivery failed: " + e.getMessage());
        }
    }

    private String buildEmailBody(String resetCode) {
        return String.format("""
                Hello,
                
                You have requested to reset your password for your Outfit Style Sense account.
                
                Your password reset code is: %s
                
                This code will expire in 15 minutes.
                
                If you did not request this password reset, please ignore this email.
                
                Best regards,
                Outfit Style Sense Team
                """, resetCode);
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            System.out.println("SendGrid not configured, skipping welcome email");
            return;
        }
        
        try {
            Email from = new Email(fromEmail, "Outfit Style Sense");
            Email to = new Email(toEmail);
            String subject = "Welcome to Outfit Style Sense!";
            Content content = new Content("text/plain", String.format("""
                    Hello %s,
                    
                    Welcome to Outfit Style Sense - Your Smart Indian Dress Stylist!
                    
                    We're excited to have you on board. Start exploring personalized fashion recommendations 
                    tailored to your unique style and preferences.
                    
                    Happy styling!
                    
                    Best regards,
                    Outfit Style Sense Team
                    """, userName));
            
            Mail mail = new Mail(from, subject, to, content);
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            sg.api(request);
            System.out.println("✅ Welcome email sent successfully");
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }
    
    public boolean testEmailConfiguration() {
        boolean configured = sendGridApiKey != null && !sendGridApiKey.isEmpty();
        System.out.println("SendGrid HTTP API configured: " + configured);
        if (configured) {
            System.out.println("API Key starts with: " + sendGridApiKey.substring(0, Math.min(10, sendGridApiKey.length())) + "...");
        }
        System.out.println("From email: " + fromEmail);
        return configured;
    }
}
