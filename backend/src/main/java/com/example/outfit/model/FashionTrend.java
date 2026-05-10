package com.example.outfit.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "fashion_trends")
public class FashionTrend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "gender")
    private String gender; // Male, Female, Unisex

    @Column(name = "platform")
    private String platform; // Amazon, Myntra, Ajio, Meesho, etc.

    @Column(name = "search_volume")
    private Integer searchVolume;

    @Column(name = "growth_percentage")
    private Double growthPercentage;

    @Column(name = "price_range")
    private String priceRange;

    @Column(name = "popularity_score")
    private Integer popularityScore; // 1-100

    @Column(name = "season")
    private String season; // Spring, Summer, Monsoon, Winter, Wedding, Festival

    @Column(name = "region")
    private String region; // North, South, East, West, Pan-India

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_trending", nullable = false)
    private Boolean isTrending = true;

    @Column(name = "trend_start_date")
    private LocalDateTime trendStartDate;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
