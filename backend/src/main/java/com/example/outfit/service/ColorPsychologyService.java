
package com.example.outfit.service;

import com.example.outfit.model.ColorPsychology;
import com.example.outfit.repository.ColorPsychologyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ColorPsychologyService {

    @Autowired
    private ColorPsychologyRepository repository;

    public List<ColorPsychology> getAllColorPsychology() {
        return repository.findAll();
    }

    public Optional<ColorPsychology> getColorByName(String colorName) {
        return repository.findByColorName(colorName);
    }

    public ColorPsychology getColorById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Color not found with id: " + id));
    }

    public List<ColorPsychology> getColorsBySuitableFor(String keyword) {
        return repository.findBySuitableForContaining(keyword);
    }
}
