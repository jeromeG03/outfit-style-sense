
package com.example.outfit.controller;

import com.example.outfit.model.Wardrobe;
import com.example.outfit.service.WardrobeService;
import com.example.outfit.service.OutfitCombinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wardrobe")
public class WardrobeController {

    @Autowired
    private WardrobeService service;

    @Autowired
    private OutfitCombinationService combinationService;

    @GetMapping
    public List<Wardrobe> getAll() {
        return service.getAllItems();
    }

    @GetMapping("/gender/{gender}")
    public List<Wardrobe> getByGender(@PathVariable String gender) {
        return service.getItemsByGender(gender);
    }

    @GetMapping("/user/{userId}")
    public List<Wardrobe> getByUserId(@PathVariable Long userId) {
        return service.getItemsByUserId(userId);
    }

    @GetMapping("/user/{userId}/gender/{gender}")
    public List<Wardrobe> getByUserIdAndGender(@PathVariable Long userId, @PathVariable String gender) {
        return service.getItemsByUserIdAndGender(userId, gender);
    }

    @GetMapping("/user/{userId}/color/{color}")
    public List<Wardrobe> getByUserIdAndColor(@PathVariable Long userId, @PathVariable String color) {
        return service.getItemsByUserIdAndColor(userId, color);
    }

    @PostMapping
    public Wardrobe add(@RequestBody Wardrobe item) {
        return service.saveItem(item);
    }

    @PutMapping("/{id}")
    public Wardrobe update(@PathVariable Long id, @RequestBody Wardrobe item) {
        return service.updateItem(id, item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteItem(id);
    }

    /**
     * Get outfit suggestions for a specific wardrobe item
     * Example: GET /api/wardrobe/suggestions/5/user/1
     */
    @GetMapping("/suggestions/{itemId}/user/{userId}")
    public Map<String, Object> getSuggestionsForItem(@PathVariable Long itemId, @PathVariable Long userId) {
        System.out.println("=== Getting suggestions for item " + itemId + " and user " + userId + " ===");
        
        Wardrobe item = service.getAllItems().stream()
            .filter(w -> w.getWardrobeId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        System.out.println("Source item: " + item.getClothType() + " - " + item.getColor() + " - " + item.getPattern());
        
        List<Wardrobe> userWardrobe = service.getItemsByUserId(userId);
        System.out.println("User wardrobe size: " + userWardrobe.size());
        
        Map<String, Object> response = combinationService.getSuggestionsForItem(item, userWardrobe);
        System.out.println("Suggestions found: " + ((List<?>) response.get("suggestions")).size());
        
        return response;
    }

    /**
     * Get complete outfit combinations for a user
     * Example: GET /api/wardrobe/outfits/user/1
     */
    @GetMapping("/outfits/user/{userId}")
    public Map<String, Object> getCompleteOutfits(@PathVariable Long userId) {
        List<Wardrobe> userWardrobe = service.getItemsByUserId(userId);
        List<Map<String, Object>> outfits = combinationService.getCompleteOutfits(userWardrobe);
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalOutfits", outfits.size());
        response.put("outfits", outfits);
        response.put("wardrobeItems", userWardrobe.size());
        
        return response;
    }

    /**
     * Get smart outfit combinations with filters
     * Example: GET /api/wardrobe/outfits/user/1/smart?occasion=casual&season=summer
     */
    @GetMapping("/outfits/user/{userId}/smart")
    public Map<String, Object> getSmartOutfits(
            @PathVariable Long userId,
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) String season,
            @RequestParam(required = false) Integer limit
    ) {
        List<Wardrobe> userWardrobe = service.getItemsByUserId(userId);
        
        // Filter by season if specified
        if (season != null && !season.isEmpty()) {
            userWardrobe = userWardrobe.stream()
                .filter(item -> item.getSeason() == null || 
                               item.getSeason().equalsIgnoreCase(season) || 
                               item.getSeason().equalsIgnoreCase("All Season"))
                .toList();
        }
        
        List<Map<String, Object>> outfits = combinationService.getCompleteOutfits(userWardrobe);
        
        // Filter by occasion if specified
        if (occasion != null && !occasion.isEmpty()) {
            outfits = outfits.stream()
                .filter(outfit -> {
                    String outfitOccasion = (String) outfit.get("occasion");
                    return outfitOccasion != null && 
                           outfitOccasion.toLowerCase().contains(occasion.toLowerCase());
                })
                .toList();
        }
        
        // Apply limit
        if (limit != null && limit > 0) {
            outfits = outfits.stream().limit(limit).toList();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalOutfits", outfits.size());
        response.put("outfits", outfits);
        response.put("filters", Map.of(
            "occasion", occasion != null ? occasion : "all",
            "season", season != null ? season : "all"
        ));
        
        return response;
    }
}
