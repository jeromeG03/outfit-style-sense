
package com.example.outfit.controller;

import com.example.outfit.model.Occasion;
import com.example.outfit.service.OccasionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/occasions")
public class OccasionController {

    @Autowired
    private OccasionService service;

    @GetMapping
    public List<Occasion> getAll() {
        return service.getAllOccasions();
    }

    @GetMapping("/{id}")
    public Occasion getById(@PathVariable Long id) {
        return service.getOccasionById(id);
    }

    @GetMapping("/type/{type}")
    public List<Occasion> getByType(@PathVariable String type) {
        return service.getOccasionsByType(type);
    }

    @GetMapping("/gender/{gender}")
    public List<Occasion> getByGender(@PathVariable String gender) {
        return service.getOccasionsByGender(gender);
    }
}
