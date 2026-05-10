
package com.example.outfit.service;

import com.example.outfit.model.SkinToneRule;
import com.example.outfit.repository.SkinToneRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SkinToneRuleService {

    @Autowired
    private SkinToneRuleRepository repository;

    public List<SkinToneRule> getAllRules() {
        return repository.findAll();
    }

    public Optional<SkinToneRule> getRuleBySkinTone(String skinTone) {
        return repository.findBySkinTone(skinTone);
    }

    public SkinToneRule getRuleById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Skin tone rule not found with id: " + id));
    }
}
