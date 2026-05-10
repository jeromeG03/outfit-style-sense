package com.example.outfit.service;

import com.example.outfit.model.Wardrobe;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OutfitCombinationService {

    // Color matching rules based on color theory
    private static final Map<String, List<String>> COLOR_COMBINATIONS = new HashMap<>() {{
        put("White", Arrays.asList("Black", "Navy Blue", "Blue", "Gray", "Grey", "Red", "Green", "Brown", "Beige", "Maroon", "Olive", "Pink", "Purple", "Yellow"));
        put("Black", Arrays.asList("White", "Gray", "Grey", "Red", "Pink", "Blue", "Yellow", "Gold", "Silver", "Beige", "Cream", "Orange", "Green"));
        put("Blue", Arrays.asList("White", "Black", "Gray", "Grey", "Beige", "Brown", "Khaki", "Navy Blue", "Cream", "Pink", "Yellow"));
        put("Navy Blue", Arrays.asList("White", "Beige", "Cream", "Gray", "Grey", "Brown", "Khaki", "Red", "Pink", "Mustard"));
        put("Gray", Arrays.asList("White", "Black", "Navy Blue", "Pink", "Yellow", "Red", "Blue", "Purple", "Green"));
        put("Grey", Arrays.asList("White", "Black", "Navy Blue", "Pink", "Yellow", "Red", "Blue", "Purple", "Green"));
        put("Red", Arrays.asList("White", "Black", "Navy Blue", "Gray", "Grey", "Beige", "Blue", "Cream"));
        put("Green", Arrays.asList("White", "Black", "Beige", "Cream", "Brown", "Khaki", "Navy Blue", "Yellow"));
        put("Brown", Arrays.asList("White", "Beige", "Cream", "Blue", "Navy Blue", "Green", "Orange", "Pink"));
        put("Beige", Arrays.asList("White", "Black", "Navy Blue", "Brown", "Blue", "Green", "Pink", "Gray", "Grey"));
        put("Pink", Arrays.asList("White", "Black", "Gray", "Grey", "Navy Blue", "Beige", "Brown", "Blue"));
        put("Yellow", Arrays.asList("White", "Black", "Navy Blue", "Gray", "Grey", "Blue", "Brown", "Green"));
        put("Purple", Arrays.asList("White", "Black", "Gray", "Grey", "Beige", "Yellow", "Pink"));
        put("Orange", Arrays.asList("White", "Black", "Blue", "Navy Blue", "Brown", "Beige"));
        put("Maroon", Arrays.asList("White", "Beige", "Cream", "Black", "Gray", "Grey", "Khaki"));
        put("Khaki", Arrays.asList("White", "Navy Blue", "Brown", "Black", "Blue", "Maroon"));
        put("Cream", Arrays.asList("Black", "Navy Blue", "Brown", "Blue", "Maroon", "Green"));
    }};

    // Clothing type combinations (top → bottom)
    private static final Map<String, List<String>> CLOTH_TYPE_COMBINATIONS = new HashMap<>() {{
        // Tops
        put("Shirt", Arrays.asList("Jeans", "Pant", "Trousers", "Chinos", "Formal Pants", "Shorts", "Palazzo", "Skirt"));
        put("T-Shirt", Arrays.asList("Jeans", "Shorts", "Pant", "Trousers", "Joggers", "Palazzo", "Skirt", "Track Pants"));
        put("Kurta", Arrays.asList("Churidar", "Palazzo", "Jeans", "Leggings", "Salwar", "Dhoti", "Pant"));
        put("Kurti", Arrays.asList("Leggings", "Palazzo", "Jeans", "Churidar", "Skirt", "Salwar"));
        put("Saree Blouse", Arrays.asList("Saree"));
        put("Top", Arrays.asList("Jeans", "Pant", "Trousers", "Skirt", "Palazzo", "Shorts", "Leggings"));
        put("Blouse", Arrays.asList("Skirt", "Jeans", "Pant", "Trousers", "Palazzo"));
        put("Blazer", Arrays.asList("Formal Pants", "Trousers", "Jeans", "Skirt", "Pant"));
        put("Jacket", Arrays.asList("Jeans", "Pant", "Trousers", "Skirt", "Shorts"));
        put("Polo Shirt", Arrays.asList("Jeans", "Chinos", "Trousers", "Shorts", "Pant"));
        put("Sweater", Arrays.asList("Jeans", "Trousers", "Chinos", "Skirt", "Pant"));
        put("Dress", Arrays.asList()); // Dresses don't need bottoms
        
        // Bottoms (reverse mapping)
        put("Jeans", Arrays.asList("Shirt", "T-Shirt", "Kurta", "Kurti", "Top", "Blouse", "Blazer", "Jacket", "Polo Shirt", "Sweater"));
        put("Pant", Arrays.asList("Shirt", "T-Shirt", "Top", "Blouse", "Blazer", "Jacket", "Polo Shirt", "Sweater", "Kurta"));
        put("Trousers", Arrays.asList("Shirt", "T-Shirt", "Top", "Blouse", "Blazer", "Jacket", "Polo Shirt", "Sweater"));
        put("Formal Pants", Arrays.asList("Shirt", "Blazer", "Formal Shirt"));
        put("Palazzo", Arrays.asList("Kurta", "Kurti", "Top", "T-Shirt"));
        put("Leggings", Arrays.asList("Kurta", "Kurti", "Top", "Long Shirt"));
        put("Churidar", Arrays.asList("Kurta", "Kurti"));
        put("Skirt", Arrays.asList("Shirt", "Top", "T-Shirt", "Blouse", "Blazer", "Jacket"));
        put("Shorts", Arrays.asList("Shirt", "T-Shirt", "Top", "Polo Shirt", "Jacket"));
        put("Saree", Arrays.asList("Saree Blouse"));
    }};

    // Pattern matching rules
    private static final Map<String, List<String>> PATTERN_COMBINATIONS = new HashMap<>() {{
        put("Solid", Arrays.asList("Solid", "Striped", "Checked", "Printed", "Floral", "Polka Dot"));
        put("Striped", Arrays.asList("Solid", "Solid"));
        put("Checked", Arrays.asList("Solid", "Solid"));
        put("Printed", Arrays.asList("Solid"));
        put("Floral", Arrays.asList("Solid"));
        put("Polka Dot", Arrays.asList("Solid"));
    }};

    // Season matching
    private static final Map<String, List<String>> SEASON_COMBINATIONS = new HashMap<>() {{
        put("Summer", Arrays.asList("Summer", "All Season"));
        put("Winter", Arrays.asList("Winter", "All Season"));
        put("Monsoon", Arrays.asList("Monsoon", "All Season"));
        put("All Season", Arrays.asList("Summer", "Winter", "Monsoon", "All Season"));
    }};

    /**
     * Get outfit suggestions for a specific wardrobe item
     */
    public Map<String, Object> getSuggestionsForItem(Wardrobe item, List<Wardrobe> userWardrobe) {
        Map<String, Object> response = new HashMap<>();
        
        System.out.println(">>> Finding suggestions for: " + item.getClothType() + " (" + item.getColor() + ", " + item.getPattern() + ", " + item.getSeason() + ")");
        
        List<Map<String, Object>> suggestions = new ArrayList<>();
        List<String> matchingColors = COLOR_COMBINATIONS.getOrDefault(item.getColor(), new ArrayList<>());
        List<String> matchingTypes = CLOTH_TYPE_COMBINATIONS.getOrDefault(item.getClothType(), new ArrayList<>());
        List<String> matchingPatterns = PATTERN_COMBINATIONS.getOrDefault(
            item.getPattern() != null ? item.getPattern() : "Solid", 
            Arrays.asList("Solid")
        );
        List<String> matchingSeasons = SEASON_COMBINATIONS.getOrDefault(item.getSeason(), Arrays.asList("All Season"));

        System.out.println(">>> Matching colors: " + matchingColors);
        System.out.println(">>> Matching types: " + matchingTypes);
        System.out.println(">>> Total wardrobe items: " + userWardrobe.size());

        // Find matching items from user's wardrobe
        for (Wardrobe wardrobeItem : userWardrobe) {
            if (wardrobeItem.getWardrobeId().equals(item.getWardrobeId())) {
                continue; // Skip the same item
            }

            int matchScore = 0;
            List<String> reasons = new ArrayList<>();

            // Check color compatibility (case-insensitive)
            boolean colorMatch = matchingColors.stream()
                .anyMatch(c -> c.equalsIgnoreCase(wardrobeItem.getColor()));
            if (colorMatch) {
                matchScore += 40;
                reasons.add("Perfect color match");
            }

            // Check clothing type compatibility (case-insensitive)
            boolean typeMatch = matchingTypes.stream()
                .anyMatch(t -> t.equalsIgnoreCase(wardrobeItem.getClothType()));
            if (typeMatch) {
                matchScore += 30;
                reasons.add("Suitable clothing type");
            }

            // Check pattern compatibility (case-insensitive)
            String itemPattern = wardrobeItem.getPattern() != null ? wardrobeItem.getPattern() : "Solid";
            boolean patternMatch = matchingPatterns.stream()
                .anyMatch(p -> p.equalsIgnoreCase(itemPattern));
            if (patternMatch) {
                matchScore += 20;
                reasons.add("Pattern complements well");
            }

            // Check season compatibility (case-insensitive)
            boolean seasonMatch = matchingSeasons.stream()
                .anyMatch(s -> s.equalsIgnoreCase(wardrobeItem.getSeason()));
            if (seasonMatch) {
                matchScore += 10;
                reasons.add("Suitable for same season");
            }

            System.out.println(">>> Item: " + wardrobeItem.getClothType() + " (" + wardrobeItem.getColor() + ") - Score: " + matchScore);

            // LOWERED THRESHOLD: Only suggest if match score is above 30 (was 40)
            if (matchScore >= 30) {
                Map<String, Object> suggestion = new HashMap<>();
                suggestion.put("item", wardrobeItem);
                suggestion.put("matchScore", matchScore);
                suggestion.put("compatibility", matchScore >= 80 ? "Excellent" : matchScore >= 60 ? "Good" : "Fair");
                suggestion.put("reasons", reasons);
                suggestions.add(suggestion);
            }
        }

        // Sort by match score descending
        suggestions.sort((a, b) -> Integer.compare((Integer)b.get("matchScore"), (Integer)a.get("matchScore")));

        System.out.println(">>> Total suggestions found: " + suggestions.size());

        response.put("sourceItem", item);
        response.put("suggestions", suggestions.stream().limit(10).collect(Collectors.toList())); // Top 10
        response.put("totalSuggestions", suggestions.size());
        
        // Add style tips
        response.put("styleTips", getStyleTips(item));

        return response;
    }

    /**
     * Get complete outfit combinations
     */
    public List<Map<String, Object>> getCompleteOutfits(List<Wardrobe> userWardrobe) {
        List<Map<String, Object>> outfits = new ArrayList<>();
        
        // Group items by type category
        Map<String, List<Wardrobe>> itemsByCategory = categorizeItems(userWardrobe);
        
        List<Wardrobe> tops = itemsByCategory.getOrDefault("tops", new ArrayList<>());
        List<Wardrobe> bottoms = itemsByCategory.getOrDefault("bottoms", new ArrayList<>());

        for (Wardrobe top : tops) {
            for (Wardrobe bottom : bottoms) {
                int compatibilityScore = calculateCompatibility(top, bottom);
                
                if (compatibilityScore >= 50) {
                    Map<String, Object> outfit = new HashMap<>();
                    outfit.put("top", top);
                    outfit.put("bottom", bottom);
                    outfit.put("score", compatibilityScore);
                    outfit.put("rating", compatibilityScore >= 80 ? "Excellent Match" : 
                                         compatibilityScore >= 65 ? "Good Match" : "Decent Match");
                    outfit.put("occasion", getSuitableOccasion(top, bottom));
                    outfits.add(outfit);
                }
            }
        }

        // Sort by score
        outfits.sort((a, b) -> Integer.compare((Integer)b.get("score"), (Integer)a.get("score")));
        
        return outfits.stream().limit(20).collect(Collectors.toList());
    }

    private Map<String, List<Wardrobe>> categorizeItems(List<Wardrobe> wardrobe) {
        Map<String, List<Wardrobe>> categorized = new HashMap<>();
        categorized.put("tops", new ArrayList<>());
        categorized.put("bottoms", new ArrayList<>());
        categorized.put("others", new ArrayList<>());

        List<String> topTypes = Arrays.asList("Shirt", "T-Shirt", "Kurta", "Kurti", "Top", "Blouse", "Blazer", "Jacket", "Polo Shirt", "Sweater", "Saree Blouse");
        List<String> bottomTypes = Arrays.asList("Jeans", "Pant", "Trousers", "Formal Pants", "Palazzo", "Leggings", "Churidar", "Skirt", "Shorts", "Salwar", "Dhoti", "Saree");

        for (Wardrobe item : wardrobe) {
            String clothType = item.getClothType();
            
            // Case-insensitive matching
            boolean isTop = topTypes.stream().anyMatch(t -> t.equalsIgnoreCase(clothType));
            boolean isBottom = bottomTypes.stream().anyMatch(b -> b.equalsIgnoreCase(clothType));
            
            if (isTop) {
                categorized.get("tops").add(item);
            } else if (isBottom) {
                categorized.get("bottoms").add(item);
            } else {
                categorized.get("others").add(item);
            }
        }

        return categorized;
    }

    private int calculateCompatibility(Wardrobe top, Wardrobe bottom) {
        int score = 0;

        // Color compatibility (case-insensitive)
        List<String> matchingColors = COLOR_COMBINATIONS.getOrDefault(top.getColor(), new ArrayList<>());
        boolean colorMatch = matchingColors.stream()
            .anyMatch(c -> c.equalsIgnoreCase(bottom.getColor()));
        if (colorMatch) {
            score += 40;
        }

        // Type compatibility (case-insensitive)
        List<String> matchingTypes = CLOTH_TYPE_COMBINATIONS.getOrDefault(top.getClothType(), new ArrayList<>());
        boolean typeMatch = matchingTypes.stream()
            .anyMatch(t -> t.equalsIgnoreCase(bottom.getClothType()));
        if (typeMatch) {
            score += 30;
        }

        // Pattern compatibility (case-insensitive)
        String topPattern = top.getPattern() != null ? top.getPattern() : "Solid";
        String bottomPattern = bottom.getPattern() != null ? bottom.getPattern() : "Solid";
        List<String> matchingPatterns = PATTERN_COMBINATIONS.getOrDefault(topPattern, Arrays.asList("Solid"));
        boolean patternMatch = matchingPatterns.stream()
            .anyMatch(p -> p.equalsIgnoreCase(bottomPattern));
        if (patternMatch) {
            score += 20;
        }

        // Season compatibility (case-insensitive)
        if (top.getSeason() == null || bottom.getSeason() == null || 
            top.getSeason().equalsIgnoreCase(bottom.getSeason()) || 
            top.getSeason().equalsIgnoreCase("All Season") || 
            bottom.getSeason().equalsIgnoreCase("All Season")) {
            score += 10;
        }

        return score;
    }

    private String getSuitableOccasion(Wardrobe top, Wardrobe bottom) {
        // Determine occasion based on clothing types
        if ((top.getClothType().contains("Formal") || bottom.getClothType().contains("Formal")) ||
            (top.getClothType().equals("Blazer") || top.getClothType().equals("Shirt"))) {
            return "Office, Business Meetings, Formal Events";
        } else if (top.getClothType().contains("Kurta") || top.getClothType().contains("Kurti")) {
            return "Festivals, Traditional Events, Casual Outings";
        } else if (top.getClothType().equals("T-Shirt") || bottom.getClothType().equals("Shorts")) {
            return "Casual Outings, Weekend, Gym";
        } else {
            return "Casual Daily Wear, Shopping, Movies";
        }
    }

    private List<String> getStyleTips(Wardrobe item) {
        List<String> tips = new ArrayList<>();
        
        // Color-specific tips
        switch (item.getColor()) {
            case "White":
                tips.add("White pairs well with almost any color");
                tips.add("Try navy blue or black for a classic look");
                break;
            case "Black":
                tips.add("Black creates a slimming and sophisticated silhouette");
                tips.add("Add a pop of color with accessories");
                break;
            case "Blue":
                tips.add("Blue complements earth tones like brown and beige");
                tips.add("Perfect for both casual and formal settings");
                break;
            case "Red":
                tips.add("Red makes a bold statement - pair with neutrals");
                tips.add("Best with black, white, or navy blue");
                break;
        }

        // Type-specific tips
        switch (item.getClothType()) {
            case "Shirt":
                tips.add("Tuck in for formal look, untucked for casual");
                tips.add("Roll up sleeves for a relaxed vibe");
                break;
            case "Kurta":
                tips.add("Pair with traditional bottoms for festive occasions");
                tips.add("Try with jeans for a modern fusion look");
                break;
            case "Jeans":
                tips.add("Dark jeans work for semi-formal occasions");
                tips.add("Light-wash jeans are perfect for casual outings");
                break;
        }

        return tips.stream().limit(3).collect(Collectors.toList());
    }
}
