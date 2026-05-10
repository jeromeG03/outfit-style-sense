
package com.example.outfit.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "skin_tone_rule")
public class SkinToneRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rule_id")
    private Long ruleId;

    @Column(name = "skin_tone", nullable = false)
    private String skinTone;

    @Column(name = "suitable_colors", columnDefinition = "TEXT")
    private String suitableColors;

    @Column(name = "avoid_colors", columnDefinition = "TEXT")
    private String avoidColors;
}
