
package com.example.outfit.service;

import com.example.outfit.model.Wardrobe;
import com.example.outfit.repository.WardrobeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WardrobeService {

    @Autowired
    private WardrobeRepository repository;

    public List<Wardrobe> getAllItems() {
        return repository.findAll();
    }

    public List<Wardrobe> getItemsByGender(String gender) {
        return repository.findByGender(gender);
    }

    public List<Wardrobe> getItemsByUserId(Long userId) {
        return repository.findByUserId(userId);
    }

    public List<Wardrobe> getItemsByUserIdAndGender(Long userId, String gender) {
        return repository.findByUserIdAndGender(userId, gender);
    }

    public List<Wardrobe> getItemsByUserIdAndColor(Long userId, String color) {
        return repository.findByUserIdAndColor(userId, color);
    }

    public Wardrobe saveItem(Wardrobe item) {
        return repository.save(item);
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }

    public Wardrobe updateItem(Long id, Wardrobe itemDetails) {
        Wardrobe item = repository.findById(id).orElseThrow();
        item.setClothType(itemDetails.getClothType());
        item.setColor(itemDetails.getColor());
        item.setPattern(itemDetails.getPattern());
        item.setSeason(itemDetails.getSeason());
        item.setGender(itemDetails.getGender());
        if (itemDetails.getImagePath() != null) {
            item.setImagePath(itemDetails.getImagePath());
        }
        return repository.save(item);
    }
}
