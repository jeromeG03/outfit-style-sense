package com.example.outfit.repository;

import com.example.outfit.model.FashionTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface FashionTrendRepository extends JpaRepository<FashionTrend, Long> {
    
    List<FashionTrend> findByIsTrendingTrue();
    
    List<FashionTrend> findByCategory(String category);
    
    List<FashionTrend> findByGender(String gender);
    
    List<FashionTrend> findBySeason(String season);
    
    @Query("SELECT ft FROM FashionTrend ft WHERE ft.isTrending = true ORDER BY ft.popularityScore DESC")
    List<FashionTrend> findTopTrending();
    
    @Query("SELECT ft FROM FashionTrend ft WHERE ft.isTrending = true AND ft.gender = ?1 ORDER BY ft.popularityScore DESC")
    List<FashionTrend> findTopTrendingByGender(String gender);
    
    @Query("SELECT DISTINCT ft.category FROM FashionTrend ft WHERE ft.isTrending = true")
    List<String> findDistinctCategories();
    
    @Query("SELECT DISTINCT ft.platform FROM FashionTrend ft WHERE ft.isTrending = true")
    List<String> findDistinctPlatforms();
}
