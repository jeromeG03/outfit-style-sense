-- =============================================
-- Sample Wardrobe Data for Testing Outfit Combinations
-- This will populate the wardrobe table with diverse clothing items
-- =============================================

USE outfit_recommendation_db;

-- Clear existing wardrobe data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE wardrobe;

-- Insert sample wardrobe items for User ID 3 (test user created during testing)
-- These items will demonstrate the outfit combination suggestions

-- ===== TOPS =====

-- White Shirts
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Shirt', 'White', 'Solid', 'All Season'),
(3, 'Male', 'Formal Shirt', 'White', 'Solid', 'All Season'),
(3, 'Female', 'Shirt', 'White', 'Solid', 'All Season');

-- Blue Shirts & T-Shirts
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Shirt', 'Blue', 'Solid', 'All Season'),
(3, 'Male', 'Shirt', 'Navy Blue', 'Solid', 'All Season'),
(3, 'Male', 'T-Shirt', 'Blue', 'Solid', 'Summer'),
(3, 'Female', 'Top', 'Blue', 'Solid', 'Summer');

-- Black Tops
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'T-Shirt', 'Black', 'Solid', 'All Season'),
(3, 'Male', 'Polo Shirt', 'Black', 'Solid', 'Summer'),
(3, 'Female', 'Top', 'Black', 'Solid', 'All Season');

-- Red & Pink Tops
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Shirt', 'Red', 'Checked', 'Winter'),
(3, 'Female', 'Top', 'Pink', 'Solid', 'Summer'),
(3, 'Female', 'Kurti', 'Pink', 'Floral', 'Summer');

-- Traditional Wear
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Kurta', 'White', 'Solid', 'All Season'),
(3, 'Male', 'Kurta', 'Cream', 'Solid', 'Summer'),
(3, 'Male', 'Kurta', 'Maroon', 'Solid', 'Winter'),
(3, 'Female', 'Kurti', 'White', 'Solid', 'Summer'),
(3, 'Female', 'Kurti', 'Green', 'Printed', 'All Season'),
(3, 'Female', 'Saree Blouse', 'Red', 'Solid', 'All Season');

-- Other Tops
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Blazer', 'Black', 'Solid', 'Winter'),
(3, 'Male', 'Blazer', 'Gray', 'Solid', 'All Season'),
(3, 'Male', 'Sweater', 'Gray', 'Solid', 'Winter'),
(3, 'Female', 'Blazer', 'Black', 'Solid', 'Winter');

-- ===== BOTTOMS =====

-- Jeans
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Jeans', 'Blue', 'Solid', 'All Season'),
(3, 'Male', 'Jeans', 'Black', 'Solid', 'All Season'),
(3, 'Female', 'Jeans', 'Blue', 'Solid', 'All Season'),
(3, 'Female', 'Jeans', 'Black', 'Solid', 'All Season');

-- Formal Pants & Trousers
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Formal Pants', 'Black', 'Solid', 'All Season'),
(3, 'Male', 'Formal Pants', 'Gray', 'Solid', 'All Season'),
(3, 'Male', 'Trousers', 'Beige', 'Solid', 'Summer'),
(3, 'Male', 'Trousers', 'Brown', 'Solid', 'All Season'),
(3, 'Female', 'Trousers', 'Black', 'Solid', 'All Season');

-- Chinos & Khakis
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Chinos', 'Khaki', 'Solid', 'Summer'),
(3, 'Male', 'Chinos', 'Navy Blue', 'Solid', 'All Season'),
(3, 'Male', 'Chinos', 'Beige', 'Solid', 'Summer');

-- Traditional Bottoms
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Churidar', 'White', 'Solid', 'All Season'),
(3, 'Male', 'Dhoti', 'Cream', 'Solid', 'Summer'),
(3, 'Female', 'Palazzo', 'White', 'Solid', 'Summer'),
(3, 'Female', 'Palazzo', 'Black', 'Solid', 'All Season'),
(3, 'Female', 'Leggings', 'Black', 'Solid', 'All Season'),
(3, 'Female', 'Churidar', 'White', 'Solid', 'All Season'),
(3, 'Female', 'Salwar', 'Cream', 'Solid', 'Summer');

-- Casual Bottoms
INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
(3, 'Male', 'Shorts', 'Blue', 'Solid', 'Summer'),
(3, 'Male', 'Shorts', 'Black', 'Solid', 'Summer'),
(3, 'Female', 'Skirt', 'Black', 'Solid', 'All Season'),
(3, 'Female', 'Skirt', 'Navy Blue', 'Solid', 'All Season');

-- ===== Insert items for another user (User ID 1) for testing =====

INSERT INTO wardrobe (user_id, gender, cloth_type, color, pattern, season) VALUES
-- Tops
(1, 'Male', 'Shirt', 'White', 'Solid', 'All Season'),
(1, 'Male', 'T-Shirt', 'Black', 'Solid', 'Summer'),
(1, 'Male', 'Kurta', 'Cream', 'Solid', 'All Season'),

-- Bottoms
(1, 'Male', 'Jeans', 'Blue', 'Solid', 'All Season'),
(1, 'Male', 'Formal Pants', 'Black', 'Solid', 'All Season'),
(1, 'Male', 'Palazzo', 'White', 'Solid', 'Summer');

-- Verification Queries
SELECT '=== Wardrobe Summary ===' AS Info;

SELECT 
    gender,
    cloth_type,
    COUNT(*) as count
FROM wardrobe
GROUP BY gender, cloth_type
ORDER BY gender, count DESC;

SELECT '=== User Wardrobe Counts ===' AS Info;

SELECT 
    user_id,
    gender,
    COUNT(*) as total_items,
    COUNT(CASE WHEN cloth_type IN ('Shirt', 'T-Shirt', 'Kurta', 'Kurti', 'Top', 'Blazer') THEN 1 END) as tops,
    COUNT(CASE WHEN cloth_type IN ('Jeans', 'Trousers', 'Formal Pants', 'Palazzo', 'Leggings') THEN 1 END) as bottoms
FROM wardrobe
GROUP BY user_id, gender
ORDER BY user_id;

SELECT '=== Color Distribution ===' AS Info;

SELECT 
    color,
    COUNT(*) as count
FROM wardrobe
GROUP BY color
ORDER BY count DESC;

SELECT '=== Sample Complete Wardrobe (User 3) ===' AS Info;

SELECT 
    wardrobe_id,
    cloth_type,
    color,
    pattern,
    season
FROM wardrobe
WHERE user_id = 3
ORDER BY 
    CASE 
        WHEN cloth_type IN ('Shirt', 'T-Shirt', 'Kurta', 'Kurti', 'Top', 'Blazer', 'Sweater') THEN 1
        WHEN cloth_type IN ('Jeans', 'Trousers', 'Formal Pants', 'Palazzo', 'Leggings', 'Churidar') THEN 2
        ELSE 3
    END,
    cloth_type;

-- =============================================
-- Expected Results:
-- - User 3 will have 50+ wardrobe items
-- - Mix of tops and bottoms for combination testing
-- - Variety of colors for color matching demonstrations
-- - Seasonal variety for filtering
-- - Both formal and casual items
-- =============================================
