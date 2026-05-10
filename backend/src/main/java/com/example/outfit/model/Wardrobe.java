
package com.example.outfit.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "wardrobe")
public class Wardrobe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wardrobe_id")
    private Long wardrobeId;

    @Column(name = "user_id")
    private Long userId;
    
    private String gender;
    
    @Column(name = "cloth_type")
    private String clothType;
    
    private String color;
    private String pattern;
    private String season;

    @Column(name = "image_path", columnDefinition = "LONGTEXT")
    private String imagePath;
}
