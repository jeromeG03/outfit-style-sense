package com.example.outfit.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/virtual-tryon")
public class VirtualTryOnController {

    @Value("${api4ai.api.key}")
    private String api4aiApiKey;

    @Value("${api4ai.api.url}")
    private String api4aiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "online");
        response.put("service", "API4.AI Virtual Try-On");
        response.put("endpoint", api4aiApiUrl);
        response.put("note", "Production-ready virtual try-on with true garment preservation");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/batch-process")
    public ResponseEntity<?> batchProcessVirtualTryOn(
            @RequestParam("avatarImage") MultipartFile avatarImage,
            @RequestParam(value = "topGarment", required = false) MultipartFile topGarment,
            @RequestParam(value = "bottomGarment", required = false) MultipartFile bottomGarment,
            @RequestParam(value = "avatarSex", required = false, defaultValue = "male") String avatarSex,
            @RequestParam(value = "clothingPrompt", required = false, defaultValue = "") String clothingPrompt,
            @RequestParam(value = "avatarPrompt", required = false, defaultValue = "") String avatarPrompt,
            @RequestParam(value = "backgroundPrompt", required = false, defaultValue = "") String backgroundPrompt
    ) {
        try {
            long startTime = System.currentTimeMillis();

            // Use the first available garment
            MultipartFile clothingImage = topGarment != null && !topGarment.isEmpty() ? topGarment : bottomGarment;
            
            if (clothingImage == null || clothingImage.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "At least one garment is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Prepare multipart/form-data request for API4.AI
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            
            // Add person image
            ByteArrayResource personResource = new ByteArrayResource(avatarImage.getBytes()) {
                @Override
                public String getFilename() {
                    return avatarImage.getOriginalFilename();
                }
            };
            body.add("image", personResource);
            
            // Add apparel image
            ByteArrayResource apparelResource = new ByteArrayResource(clothingImage.getBytes()) {
                @Override
                public String getFilename() {
                    return clothingImage.getOriginalFilename();
                }
            };
            body.add("image-apparel", apparelResource);
            
            // Add optional prompt (combine all prompts)
            String combinedPrompt = String.join(". ", 
                clothingPrompt.isEmpty() ? "" : clothingPrompt,
                avatarPrompt.isEmpty() ? "" : avatarPrompt,
                backgroundPrompt.isEmpty() ? "" : backgroundPrompt
            ).trim();
            if (!combinedPrompt.isEmpty()) {
                body.add("prompt", combinedPrompt);
            }

            // Set headers for API4.AI
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("X-API-KEY", api4aiApiKey);

            // Make API call to API4.AI
            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
            
            try {
                // Call API4.AI
                @SuppressWarnings("unchecked")
                ResponseEntity<Map> apiResponse = restTemplate.exchange(
                        api4aiApiUrl,
                        HttpMethod.POST,
                        entity,
                        Map.class
                );

                long processingTime = System.currentTimeMillis() - startTime;

                // Parse API4.AI response
                if (apiResponse.getStatusCode().is2xxSuccessful() && apiResponse.getBody() != null) {
                    Map<String, Object> responseBody = apiResponse.getBody();
                    
                    // Extract results array
                    List<Map<String, Object>> results = (List<Map<String, Object>>) responseBody.get("results");
                    if (results != null && !results.isEmpty()) {
                        Map<String, Object> firstResult = results.get(0);
                        Map<String, Object> status = (Map<String, Object>) firstResult.get("status");
                        String statusCode = (String) status.get("code");
                        
                        // Check for failure
                        if ("failure".equals(statusCode)) {
                            String statusMessage = (String) status.get("message");
                            Map<String, Object> errorResponse = new HashMap<>();
                            errorResponse.put("success", false);
                            errorResponse.put("error", "API4.AI processing failed");
                            errorResponse.put("details", statusMessage);
                            return ResponseEntity.status(422).body(errorResponse);
                        }
                        
                        // Check for warning (prompt ignored)
                        boolean hasWarning = "warning".equals(statusCode);
                        
                        // Extract base64 image from entities
                        List<Map<String, Object>> entities = (List<Map<String, Object>>) firstResult.get("entities");
                        if (entities != null && !entities.isEmpty()) {
                            Map<String, Object> imageEntity = entities.get(0);
                            String base64Image = (String) imageEntity.get("image");
                            String format = (String) imageEntity.get("format");
                            
                            // Create data URI
                            String mimeType = "PNG".equalsIgnoreCase(format) ? "image/png" : "image/jpeg";
                            String resultImage = "data:" + mimeType + ";base64," + base64Image;

                            // Format response
                            Map<String, Object> response = new HashMap<>();
                            response.put("success", true);
                            response.put("result_image", resultImage);
                            response.put("processing_time", processingTime / 1000.0);
                            response.put("method", "API4.AI Virtual Try-On");
                            response.put("note", "True garment preservation - your exact garment is used");
                            if (hasWarning) {
                                response.put("warning", status.get("message"));
                            }

                            return ResponseEntity.ok(response);
                        }
                    }
                    
                    throw new Exception("API4.AI response missing expected data structure");
                } else {
                    throw new Exception("API4.AI returned non-successful status: " + apiResponse.getStatusCode());
                }
            } catch (org.springframework.web.client.HttpClientErrorException e) {
                String errorBody = e.getResponseBodyAsString();
                
                // Handle specific error codes
                if (e.getStatusCode() == HttpStatus.PAYLOAD_TOO_LARGE) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("error", "Image files too large");
                    errorResponse.put("details", "Each image must be less than 16MB. Please reduce image size.");
                    return ResponseEntity.status(413).body(errorResponse);
                } else if (e.getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("error", "Missing required images");
                    errorResponse.put("details", errorBody);
                    return ResponseEntity.status(422).body(errorResponse);
                }
                
                throw new Exception("API4.AI client error: " + e.getStatusCode() + " - " + errorBody);
            } catch (org.springframework.web.client.HttpServerErrorException e) {
                throw new Exception("API4.AI server error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            errorResponse.put("details", "Failed to process virtual try-on with API4.AI");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    private String convertToBase64(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes();
        return Base64.getEncoder().encodeToString(fileBytes);
    }
}
