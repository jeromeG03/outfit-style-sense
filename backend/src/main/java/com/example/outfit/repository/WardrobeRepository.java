
package com.example.outfit.repository;

import com.example.outfit.model.Wardrobe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WardrobeRepository extends JpaRepository<Wardrobe, Long> {
    List<Wardrobe> findByGender(String gender);
    List<Wardrobe> findByUserId(Long userId);
    List<Wardrobe> findByUserIdAndGender(Long userId, String gender);
    List<Wardrobe> findByUserIdAndColor(Long userId, String color);
}
