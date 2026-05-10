
package com.example.outfit.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "occasions")
public class Occasion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "occasion_id")
    private Long occasionId;

    @Column(name = "occasion_type", nullable = false)
    private String occasionType;

    @Column(name = "occasion_name", nullable = false)
    private String occasionName;

    private String region;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Gender-specific field: Male, Female, or Unisex
    @Column(name = "gender", nullable = false)
    private String gender;

    // Outfit recommendations
    @Column(name = "outfit_suggestions", columnDefinition = "TEXT")
    private String outfitSuggestions;

    @Column(name = "color_palette", columnDefinition = "TEXT")
    private String colorPalette;

    @Column(name = "accessories", columnDefinition = "TEXT")
    private String accessories;

    @Column(name = "dos_and_donts", columnDefinition = "TEXT")
    private String dosAndDonts;
}
