
package com.example.outfit.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "color_psychology")
public class ColorPsychology {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "color_id")
    private Long colorId;

    @Column(name = "color_name", nullable = false)
    private String colorName;

    @Column(name = "psychology_effect", columnDefinition = "TEXT")
    private String psychologyEffect;

    @Column(name = "suitable_for")
    private String suitableFor;
}
