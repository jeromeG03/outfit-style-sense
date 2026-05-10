
package com.example.outfit.repository;

import com.example.outfit.model.ColorPsychology;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ColorPsychologyRepository extends JpaRepository<ColorPsychology, Long> {
    Optional<ColorPsychology> findByColorName(String colorName);
    List<ColorPsychology> findBySuitableForContaining(String keyword);
}
