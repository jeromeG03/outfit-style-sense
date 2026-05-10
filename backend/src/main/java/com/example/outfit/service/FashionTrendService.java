package com.example.outfit.service;

import com.example.outfit.model.FashionTrend;
import com.example.outfit.repository.FashionTrendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FashionTrendService {

    @Autowired
    private FashionTrendRepository repository;

    public List<FashionTrend> getAllTrends() {
        return repository.findAll();
    }

    public List<FashionTrend> getTrendingItems() {
        return repository.findByIsTrendingTrue();
    }

    public Map<String, Object> getCurrentTrends() {
        List<FashionTrend> trends = repository.findTopTrending();
        
        // Handle empty trends list
        if (trends == null || trends.isEmpty()) {
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("categories", new ArrayList<>());
            emptyResponse.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm:ss")));
            emptyResponse.put("totalSearches", 0);
            return emptyResponse;
        }
        
        // Group by category and calculate percentages
        Map<String, Long> categoryCount = trends.stream()
            .collect(Collectors.groupingBy(FashionTrend::getCategory, Collectors.counting()));
        
        long total = trends.size();
        
        List<Map<String, Object>> categories = new ArrayList<>();
       
        // Define colors for categories
        Map<String, String> colorMap = new HashMap<>();
        colorMap.put("Ethnic Wear", "bg-gradient-to-r from-orange-500 to-pink-500");
        colorMap.put("Indo-Western", "bg-gradient-to-r from-purple-500 to-indigo-500");
        colorMap.put("Western Wear", "bg-gradient-to-r from-blue-500 to-cyan-500");
        colorMap.put("Traditional", "bg-gradient-to-r from-amber-500 to-yellow-500");
        colorMap.put("Casual", "bg-gradient-to-r from-green-500 to-teal-500");
        colorMap.put("Formal", "bg-gradient-to-r from-gray-700 to-stone-600");
        colorMap.put("Wedding Collection", "bg-gradient-to-r from-rose-500 to-red-500");
        colorMap.put("Accessories", "bg-gradient-to-r from-fuchsia-500 to-pink-500");
        
        categoryCount.forEach((cat, count) -> {
            Map<String, Object> catData = new HashMap<>();
            catData.put("name", cat);
            
            // Add dynamic variance to percentages (±2% variation)
            double basePercentage = (count * 100.0 / total);
            double variance = (Math.random() * 4) - 2; // -2 to +2
            int dynamicPercentage = Math.max(1, Math.min(100, (int)Math.round(basePercentage + variance)));
            
            catData.put("percentage", dynamicPercentage);
            catData.put("color", colorMap.getOrDefault(cat, "bg-gradient-to-r from-gray-400 to-gray-500"));
            
            // Add dynamic variance to search volumes (±15% variation)
            int baseSearches = (int)(count * 1500);
            double searchVariance = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15 multiplier
            catData.put("searches", (int)(baseSearches * searchVariance));
            
            catData.put("growth", 15 + (int)(Math.random() * 30)); // Random growth 15-45%
            categories.add(catData);
        });
        
        // Sort by percentage descending
        categories.sort((a, b) -> Integer.compare((Integer)b.get("percentage"), (Integer)a.get("percentage")));
        
        // Add dynamic variance to total searches (±10% variation)
        int baseTotalSearches = trends.stream().mapToInt(FashionTrend::getSearchVolume).sum();
        double totalVariance = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1 multiplier
        int dynamicTotalSearches = (int)(baseTotalSearches * totalVariance);
        
        Map<String, Object> response = new HashMap<>();
        response.put("categories", categories);
        response.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm:ss")));
        response.put("totalSearches", dynamicTotalSearches);
        
        System.out.println("Trends refreshed at: " + LocalDateTime.now() + " | Total Searches: " + dynamicTotalSearches);
        
        return response;
    }

    public Map<String, Object> getCategoryTrends() {
        List<FashionTrend> trends = repository.findTopTrending();
        
        List<Map<String, Object>> trendingItems = trends.stream()
            .limit(10)
            .map(trend -> {
                Map<String, Object> item = new HashMap<>();
                item.put("name", trend.getItemName());
                
                // Add dynamic variance to search volumes (±10% variation)
                double searchVariance = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1 multiplier
                item.put("searches", (int)(trend.getSearchVolume() * searchVariance));
                
                // Add dynamic variance to growth (±5% variation)
                double growthVariance = -5 + (Math.random() * 10); // -5 to +5
                int dynamicGrowth = Math.max(0, (int)(trend.getGrowthPercentage() + growthVariance));
                item.put("growth", dynamicGrowth);
                
                item.put("category", trend.getCategory());
                return item;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("trendingItems", trendingItems);
        
        return response;
    }

    public Map<String, Object> getRegionalTrends() {
        List<FashionTrend> trends = repository.findTopTrending();
        
        // Group by region
        Map<String, List<FashionTrend>> regionMap = trends.stream()
            .collect(Collectors.groupingBy(FashionTrend::getRegion));
        
        List<Map<String, Object>> regions = new ArrayList<>();
        
        regionMap.forEach((region, trendList) -> {
            Map<String, Object> regionData = new HashMap<>();
            regionData.put("name", region);
            
            // Get top category
            Map<String, Long> catCount = trendList.stream()
                .collect(Collectors.groupingBy(FashionTrend::getCategory, Collectors.counting()));
            String topCat = catCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Various");
            
            regionData.put("topCategory", topCat);
            regionData.put("engagement", 70 + (int)(Math.random() * 25)); // 70-95%
            
            // Calculate average price (simplified)
            regionData.put("avgPrice", "₹" + (1500 + (int)(Math.random() * 3000)));
            
            regions.add(regionData);
        });
        
        Map<String, Object> response = new HashMap<>();
        response.put("regions", regions);
        
        return response;
    }

    public Map<String, Object> getHistoricalData(int days) {
        // Generate mock historical data for visualization
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (int i = days - 1; i >= 0; i--) {
            Map<String, Object> dayData = new HashMap<>();
            LocalDateTime date = now.minusDays(i);
            dayData.put("date", date.format(DateTimeFormatter.ofPattern("MMM dd")));
            dayData.put("indoWestern", 60 + (int)(Math.random() * 30));
            dayData.put("heritage", 45 + (int)(Math.random() * 25));
            dayData.put("minimalist", 55 + (int)(Math.random() * 20));
            dayData.put("streetwear", 40 + (int)(Math.random() * 30));
            dayData.put("searches", 50000 + (int)(Math.random() * 30000));
            data.add(dayData);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        
        return response;
    }

    public Map<String, Object> getTrendingColors() {
        // Current season trending colors with dynamic popularity
        List<Map<String, Object>> colors = new ArrayList<>();
        
        // Base popularity values with dynamic variance (±3 points)
        colors.add(createColorDynamic("Coral Reef", "#FF6B6B", 92, 25));
        colors.add(createColorDynamic("Mint Fresh", "#51CF66", 88, 18));
        colors.add(createColorDynamic("Royal Purple", "#7950F2", 85, 32));
        colors.add(createColorDynamic("Sunset Orange", "#FF922B", 82, 15));
        colors.add(createColorDynamic("Ocean Blue", "#339AF0", 79, 22));
        colors.add(createColorDynamic("Rose Gold", "#E64980", 76, 28));
        colors.add(createColorDynamic("Sage Green", "#82C91E", 73, 20));
        colors.add(createColorDynamic("Golden Hour", "#FFD43B", 70, 12));
        
        Map<String, Object> response = new HashMap<>();
        response.put("colors", colors);
        
        return response;
    }
    
    private Map<String, Object> createColor(String name, String hex, int popularity, int growth) {
        Map<String, Object> color = new HashMap<>();
        color.put("name", name);
        color.put("hex", hex);
        color.put("popularity", popularity);
        color.put("growth", growth);
        return color;
    }
    
    private Map<String, Object> createColorDynamic(String name, String hex, int basePopularity, int baseGrowth) {
        Map<String, Object> color = new HashMap<>();
        color.put("name", name);
        color.put("hex", hex);
        
        // Add dynamic variance to popularity (±3 points)
        int variance = (int)((Math.random() * 6) - 3); // -3 to +3
        int dynamicPopularity = Math.max(50, Math.min(100, basePopularity + variance));
        color.put("popularity", dynamicPopularity);
        
        // Add dynamic variance to growth (±5 points)
        int growthVariance = (int)((Math.random() * 10) - 5); // -5 to +5
        int dynamicGrowth = Math.max(0, Math.min(50, baseGrowth + growthVariance));
        color.put("growth", dynamicGrowth);
        
        return color;
    }

    public List<FashionTrend> getTrendsByGender(String gender) {
        return repository.findByGender(gender);
    }

    public List<String> getAllCategories() {
        return repository.findDistinctCategories();
    }

    public List<String> getAllPlatforms() {
        return repository.findDistinctPlatforms();
    }
}
