
package com.example.outfit.repository;

import com.example.outfit.model.Occasion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OccasionRepository extends JpaRepository<Occasion, Long> {
    List<Occasion> findByOccasionType(String occasionType);
    List<Occasion> findByGender(String gender);
    List<Occasion> findByGenderIn(List<String> genders);
}
