
package com.example.outfit.controller;

import com.example.outfit.model.SkinToneRule;
import com.example.outfit.service.SkinToneRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skintone")
public class SkinToneRuleController {

    @Autowired
    private SkinToneRuleService service;

    @GetMapping
    public List<SkinToneRule> getAll() {
        return service.getAllRules();
    }

    @GetMapping("/{id}")
    public SkinToneRule getById(@PathVariable Long id) {
        return service.getRuleById(id);
    }

    @GetMapping("/tone/{skinTone}")
    public ResponseEntity<SkinToneRule> getBySkinTone(@PathVariable String skinTone) {
        Optional<SkinToneRule> rule = service.getRuleBySkinTone(skinTone);
        return rule.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
}
