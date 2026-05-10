package com.example.outfit.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class TrendService {

    private final Random random = new Random();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    // Base values that change slowly to simulate realistic trends
    private double indoWesternBase = 40.0;
    private double heritageBase = 28.0;
    private double minimalistBase = 18.0;
    private double streetwearBase = 14.0;
    
    private final String[] CATEGORIES = {
        "Indo-Western Fusion",
        "Heritage Traditional",
        "Minimalist Western",
        "Sustainable Streetwear"
    };
    
    private final String[] REGIONS = {
        "Mumbai",
        "London",
        "New York",
        "Paris",
        "Tokyo"
    };
    
    private final String[] TRENDING_ITEMS = {
        "Oversized Blazers",
        "Silk Kurtas",
        "Cargo Pants",
        "Ethnic Jackets",
        "Linen Shirts",
        "Printed Sarees",
        "Minimal Dresses",
        "Statement Jewelry"
    };
    
    private final Map<String, String> COLOR_LIST = Map.of(
        "Terracotta", "#E07856",
        "Sage Green", "#87A96B",
        "Navy Blue", "#000080",
        "Burnt Orange", "#CC5500",
        "Ivory", "#FFFFF0",
        "Charcoal", "#36454F",
        "Mauve", "#E0B0FF",
        "Ochre", "#CC7722"
    );

    public Map<String, Object> generateCurrentTrends() {
        // Slowly drift the base values to simulate real market changes
        indoWesternBase += (random.nextDouble() - 0.5) * 2;
        heritageBase += (random.nextDouble() - 0.5) * 1.5;
        minimalistBase += (random.nextDouble() - 0.5);
        streetwearBase += (random.nextDouble() - 0.5);
        
        // Normalize to 100%
        double total = indoWesternBase + heritageBase + minimalistBase + streetwearBase;
        
        List<Map<String, Object>> categories = Arrays.asList(
            createCategoryData("Indo-Western Fusion", (indoWesternBase / total) * 100, "#D97706"),
            createCategoryData("Heritage Traditional", (heritageBase / total) * 100, "#57534E"),
            createCategoryData("Minimalist Western", (minimalistBase / total) * 100, "#A8A29E"),
            createCategoryData("Sustainable Streetwear", (streetwearBase / total) * 100, "#059669")
        );
        
        Map<String, Object> result = new HashMap<>();
        result.put("categories", categories);
        result.put("timestamp", System.currentTimeMillis());
        result.put("lastUpdated", LocalDate.now().format(formatter));
        result.put("totalSearches", 150000 + random.nextInt(50000));
        
        return result;
    }

    public Map<String, Object> generateCategoryTrends() {
        List<Map<String, Object>> items = Arrays.stream(TRENDING_ITEMS)
            .map(item -> {
                Map<String, Object> itemData = new HashMap<>();
                itemData.put("name", item);
                itemData.put("searches", 5000 + random.nextInt(15000));
                itemData.put("growth", -10 + random.nextInt(50)); // -10% to +40%
                itemData.put("category", CATEGORIES[random.nextInt(CATEGORIES.length)]);
                return itemData;
            })
            .sorted((a, b) -> ((Integer)b.get("searches")).compareTo((Integer)a.get("searches")))
            .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("trendingItems", items);
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }

    public Map<String, Object> generateRegionalTrends() {
        List<Map<String, Object>> regions = Arrays.stream(REGIONS)
            .map(region -> {
                Map<String, Object> regionData = new HashMap<>();
                regionData.put("name", region);
                regionData.put("topCategory", CATEGORIES[random.nextInt(CATEGORIES.length)]);
                regionData.put("engagement", 60 + random.nextInt(40)); // 60-100%
                regionData.put("avgPrice", "$" + (50 + random.nextInt(200)));
                return regionData;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("regions", regions);
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }

    public Map<String, Object> generateHistoricalTrends(int days) {
        List<Map<String, Object>> history = IntStream.range(0, days)
            .mapToObj(i -> {
                LocalDate date = LocalDate.now().minusDays(days - i - 1);
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", date.format(formatter));
                dayData.put("indoWestern", 35 + random.nextInt(15));
                dayData.put("heritage", 20 + random.nextInt(15));
                dayData.put("minimalist", 15 + random.nextInt(10));
                dayData.put("streetwear", 10 + random.nextInt(10));
                dayData.put("searches", 100000 + random.nextInt(100000));
                return dayData;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", history);
        result.put("period", days + " days");
        
        return result;
    }

    public Map<String, Object> generateTrendingColors() {
        List<Map<String, Object>> colors = COLOR_LIST.entrySet().stream()
            .map(entry -> {
                Map<String, Object> colorData = new HashMap<>();
                colorData.put("name", entry.getKey());
                colorData.put("hex", entry.getValue());
                colorData.put("popularity", 60 + random.nextInt(40));
                colorData.put("growth", -5 + random.nextInt(30));
                return colorData;
            })
            .sorted((a, b) -> ((Integer)b.get("popularity")).compareTo((Integer)a.get("popularity")))
            .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("colors", colors);
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }

    private Map<String, Object> createCategoryData(String name, double percentage, String color) {
        Map<String, Object> data = new HashMap<>();
        data.put("name", name);
        data.put("percentage", Math.round(percentage * 10.0) / 10.0); // Round to 1 decimal
        data.put("color", color);
        data.put("searches", 10000 + random.nextInt(50000));
        data.put("growth", -5 + random.nextInt(25));
        return data;
    }
}
