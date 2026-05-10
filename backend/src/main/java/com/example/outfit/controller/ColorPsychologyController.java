
package com.example.outfit.controller;

import com.example.outfit.model.ColorPsychology;
import com.example.outfit.service.ColorPsychologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/psychology")
public class ColorPsychologyController {

    @Autowired
    private ColorPsychologyService service;

    @GetMapping
    public List<ColorPsychology> getAll() {
        return service.getAllColorPsychology();
    }

    @GetMapping("/{id}")
    public ColorPsychology getById(@PathVariable Long id) {
        return service.getColorById(id);
    }

    @GetMapping("/color/{colorName}")
    public ResponseEntity<ColorPsychology> getByColorName(@PathVariable String colorName) {
        Optional<ColorPsychology> color = service.getColorByName(colorName);
        return color.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/suitable/{keyword}")
    public List<ColorPsychology> getBySuitableFor(@PathVariable String keyword) {
        return service.getColorsBySuitableFor(keyword);
    }
}
