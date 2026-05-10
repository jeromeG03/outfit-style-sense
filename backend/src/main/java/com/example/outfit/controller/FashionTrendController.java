package com.example.outfit.controller;

import com.example.outfit.model.FashionTrend;
import com.example.outfit.service.FashionTrendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trends")
public class FashionTrendController {

    @Autowired
    private FashionTrendService service;

    @GetMapping
    public List<FashionTrend> getAllTrends() {
        return service.getAllTrends();
    }

    @GetMapping("/current")
    public Map<String, Object> getCurrentTrends() {
        return service.getCurrentTrends();
    }

    @GetMapping("/categories")
    public Map<String, Object> getCategoryTrends() {
        return service.getCategoryTrends();
    }

    @GetMapping("/regions")
    public Map<String, Object> getRegionalTrends() {
        return service.getRegionalTrends();
    }

    @GetMapping("/historical")
    public Map<String, Object> getHistoricalData(@RequestParam(defaultValue = "7") int days) {
        return service.getHistoricalData(days);
    }

    @GetMapping("/colors")
    public Map<String, Object> getTrendingColors() {
        return service.getTrendingColors();
    }

    @GetMapping("/gender/{gender}")
    public List<FashionTrend> getTrendsByGender(@PathVariable String gender) {
        return service.getTrendsByGender(gender);
    }

    @GetMapping("/platforms")
    public List<String> getAllPlatforms() {
        return service.getAllPlatforms();
    }

    @GetMapping("/category-list")
    public List<String> getAllCategories() {
        return service.getAllCategories();
    }
}
