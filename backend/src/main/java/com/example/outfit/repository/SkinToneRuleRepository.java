
package com.example.outfit.repository;

import com.example.outfit.model.SkinToneRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SkinToneRuleRepository extends JpaRepository<SkinToneRule, Long> {
    Optional<SkinToneRule> findBySkinTone(String skinTone);
}
