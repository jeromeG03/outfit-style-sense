
package com.example.outfit.service;

import com.example.outfit.model.Occasion;
import com.example.outfit.repository.OccasionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class OccasionService {

    @Autowired
    private OccasionRepository repository;

    public List<Occasion> getAllOccasions() {
        return repository.findAll();
    }

    public Occasion getOccasionById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Occasion not found with id: " + id));
    }

    public List<Occasion> getOccasionsByType(String type) {
        return repository.findByOccasionType(type);
    }

    public List<Occasion> getOccasionsByGender(String gender) {
        // Return occasions for specified gender + unisex occasions
        return repository.findByGenderIn(Arrays.asList(gender, "Unisex"));
    }
}
