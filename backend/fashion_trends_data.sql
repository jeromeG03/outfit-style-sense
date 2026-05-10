-- Fashion Trends Data - Realistic E-commerce Insights
-- Simulates trends from Amazon, Myntra, Ajio, Meesho, Flipkart Fashion

USE outfit_recommendation_db;

-- Create fashion_trends table
CREATE TABLE IF NOT EXISTS fashion_trends (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    platform VARCHAR(50),
    search_volume INT,
    growth_percentage DOUBLE,
    price_range VARCHAR(50),
    popularity_score INT,
    season VARCHAR(50),
    region VARCHAR(50),
    description TEXT,
    is_trending BOOLEAN DEFAULT TRUE,
    trend_start_date DATETIME,
    last_updated DATETIME
);

-- Clear existing data
TRUNCATE TABLE fashion_trends;

-- Insert trending data based on actual e-commerce patterns

-- ETHNIC WEAR - FEMALE
INSERT INTO fashion_trends (item_name, category, gender, platform, search_volume, growth_percentage, price_range, popularity_score, season, region, description, is_trending, trend_start_date, last_updated) VALUES
('Anarkali Suits with Gota Patti Work', 'Ethnic Wear', 'Female', 'Meesho', 45000, 42.5, '₹1,200 - ₹3,500', 95, 'Wedding', 'North India', 'Traditional Anarkali suits with intricate gota patti embroidery, perfect for festive occasions', TRUE, NOW(), NOW()),
('Palazzo Kurta Sets', 'Ethnic Wear', 'Female', 'Myntra', 38000, 38.2, '₹800 - ₹2,500', 92, 'Summer', 'Pan-India', 'Comfortable palazzo pants paired with trendy short kurtas, ideal for casual and office wear', TRUE, NOW(), NOW()),
('Banarasi Silk Sarees', 'Traditional', 'Female', 'Amazon', 32000, 28.7, '₹5,000 - ₹25,000', 90, 'Wedding', 'North India', 'Luxurious Banarasi silk sarees with traditional zari work for weddings and special occasions', TRUE, NOW(), NOW()),
('Organza Sarees with Digital Prints', 'Ethnic Wear', 'Female', 'Ajio', 29000, 51.3, '₹1,500 - ₹4,000', 88, 'Festival', 'Pan-India', 'Lightweight organza sarees featuring modern digital prints and contemporary designs', TRUE, NOW(), NOW()),
('Sharara Suits', 'Ethnic Wear', 'Female', 'Myntra', 27000, 45.1, '₹2,000 - ₹6,000', 87, 'Wedding', 'North India', 'Elegant sharara sets with heavy dupatta, trending for Eid and wedding functions', TRUE, NOW(), NOW()),
('Cotton Kurta Sets with Block Prints', 'Ethnic Wear', 'Female', 'Meesho', 35000, 33.4, '₹600 - ₹1,800', 85, 'Monsoon', 'Pan-India', 'Breathable cotton kurtas with traditional block printing, perfect for everyday wear', TRUE, NOW(), NOW()),
('Lehenga Choli Sets', 'Wedding Collection', 'Female', 'Myntra', 41000, 39.8, '₹3,500 - ₹15,000', 93, 'Wedding', 'Pan-India', 'Designer lehenga choli sets with sequin and thread work for bridal and festive occasions', TRUE, NOW(), NOW()),
('Kanchipuram Silk Sarees', 'Traditional', 'Female', 'Flipkart', 24000, 22.1, '₹8,000 - ₹30,000', 89, 'Wedding', 'South India', 'Pure Kanchipuram silk sarees with temple borders and traditional motifs', TRUE, NOW(), NOW()),
('Indo-Western Gowns', 'Indo-Western', 'Female', 'Ajio', 31000, 48.6, '₹2,500 - ₹7,000', 86, 'Party', 'Pan-India', 'Fusion gowns blending Indian embroidery with western silhouettes', TRUE, NOW(), NOW()),
('Chanderi Dress Materials', 'Ethnic Wear', 'Female', 'Amazon', 19000, 25.9, '₹1,000 - ₹3,000', 82, 'Summer', 'Central India', 'Lightweight Chanderi cotton dress materials perfect for stitching custom outfits', TRUE, NOW(), NOW()),

-- ETHNIC WEAR - MALE
('Kurta Pajama Sets with Nehru Jacket', 'Ethnic Wear', 'Male', 'Myntra', 28000, 35.7, '₹1,500 - ₹4,500', 88, 'Wedding', 'North India', 'Complete ethnic ensemble with embroidered Nehru jacket for festive occasions', TRUE, NOW(), NOW()),
('Pathani Suits', 'Ethnic Wear', 'Male', 'Ajio', 22000, 41.2, '₹1,200 - ₹3,000', 84, 'Festival', 'North India', 'Traditional Pathani kurta sets, trending during Ramadan and Eid celebrations', TRUE, NOW(), NOW()),
('Designer Sherwanis', 'Wedding Collection', 'Male', 'Myntra', 26000, 37.9, '₹5,000 - ₹20,000', 91, 'Wedding', 'Pan-India', 'Embroidered sherwanis with churidar for grooms and wedding guests', TRUE, NOW(), NOW()),
('Cotton Linen Kurtas', 'Ethnic Wear', 'Male', 'Amazon', 31000, 28.4, '₹800 - ₹2,000', 83, 'Summer', 'Pan-India', 'Breathable linen-cotton blend kurtas for casual and semi-formal wear', TRUE, NOW(), NOW()),
('Silk Kurta Sets', 'Ethnic Wear', 'Male', 'Flipkart', 18000, 32.1, '₹2,000 - ₹5,000', 81, 'Festival', 'Pan-India', 'Premium silk kurtas with matching bottoms for Diwali and festive occasions', TRUE, NOW(), NOW()),

-- INDO-WESTERN - FEMALE 
('Crop Top with Long Skirt Sets', 'Indo-Western', 'Female', 'Myntra', 36000, 55.3, '₹1,500 - ₹4,000', 91, 'Party', 'Pan-India', 'Trendy crop tops paired with flowy skirts, perfect for cocktail events', TRUE, NOW(), NOW()),
('Dhoti Pants with Asymmetric Tops', 'Indo-Western', 'Female', 'Ajio', 21000, 47.8, '₹1,800 - ₹4,500', 84, 'Party', 'Urban India', 'Modern dhoti-style pants with contemporary asymmetric kurtas', TRUE, NOW(), NOW()),
('Cape Style Kurtis', 'Indo-Western', 'Female', 'Myntra', 27000, 44.2, '₹1,200 - ₹3,500', 86, 'Party', 'Pan-India', 'Flowy cape-style kurtas adding drama to ethnic looks', TRUE, NOW(), NOW()),
('Jacket Style Kurta Sets', 'Indo-Western', 'Female', 'Amazon', 23000, 39.6, '₹1,600 - ₹4,000', 82, 'Festival', 'Pan-India', 'Kurtas with attached or separate jacket layers for a modern ethnic look', TRUE, NOW(), NOW()),

-- INDO-WESTERN - MALE
('Bandh Gala Suits', 'Indo-Western', 'Male', 'Myntra', 24000, 42.8, '₹3,500 - ₹10,000', 87, 'Wedding', 'Pan-India', 'Modern bandh gala jackets paired with trousers for receptions and formal events', TRUE, NOW(), NOW()),
('Nehru Jackets with Jeans', 'Indo-Western', 'Male', 'Ajio', 20000, 38.5, '₹1,500 - ₹4,000', 80, 'Party', 'Urban India', 'Embroidered Nehru jackets styled with denim for smart casual looks', TRUE, NOW(), NOW()),
('Asymmetric Kurtas', 'Indo-Western', 'Male', 'Myntra', 17000, 35.2, '₹1,200 - ₹3,000', 79, 'Festival', 'Urban India', 'Modern asymmetric cut kurtas blending traditional and contemporary styles', TRUE, NOW(), NOW()),

-- WESTERN WEAR - FEMALE
('Midi Dresses with Floral Prints', 'Western Wear', 'Female', 'Myntra', 33000, 32.4, '₹1,000 - ₹3,000', 85, 'Summer', 'Urban India', 'Breezy midi-length dresses with floral patterns for casual outings', TRUE, NOW(), NOW()),
('High-Waist Jeans', 'Western Wear', 'Female', 'Amazon', 42000, 29.7, '₹1,200 - ₹3,500', 88, 'Spring', 'Pan-India', 'Trending high-waisted jeans in various washes and fits', TRUE, NOW(), NOW()),
('Blazer and Trouser Sets', 'Formal', 'Female', 'Myntra', 19000, 36.8, '₹2,500 - ₹6,000', 81, 'Spring', 'Urban India', 'Professional co-ord sets perfect for corporate wear', TRUE, NOW(), NOW()),
('Maxi Dresses', 'Western Wear', 'Female', 'Ajio', 26000, 31.5, '₹1,200 - ₹3,500', 83, 'Summer', 'Pan-India', 'Floor-length maxi dresses in solid colors and prints', TRUE, NOW(), NOW()),

-- WESTERN WEAR - MALE
('Slim Fit Formal Shirts', 'Formal', 'Male', 'Amazon', 38000, 24.3, '₹800 - ₹2,500', 84, 'Spring', 'Pan-India', 'Crisp formal shirts in various colors for office and formal events', TRUE, NOW(), NOW()),
('Chinos and Trousers', 'Western Wear', 'Male', 'Myntra', 34000, 27.8, '₹1,000 - ₹3,000', 83, 'Spring', 'Pan-India', 'Versatile chinos and formal trousers in neutral tones', TRUE, NOW(), NOW()),
('Casual Blazers', 'Western Wear', 'Male', 'Ajio', 21000, 33.2, '₹2,000 - ₹5,000', 80, 'Winter', 'Urban India', 'Smart casual blazers for business casual and semi-formal occasions', TRUE, NOW(), NOW()),

-- CASUAL WEAR - UNISEX
('Graphic T-Shirts', 'Casual', 'Unisex', 'Myntra', 48000, 22.6, '₹400 - ₹1,200', 82, 'Spring', 'Pan-India', 'Trendy graphic tees with pop culture and abstract designs', TRUE, NOW(), NOW()),
('Oversized Hoodies', 'Casual', 'Unisex', 'Amazon', 41000, 35.9, '₹800 - ₹2,500', 85, 'Winter', 'Pan-India', 'Comfortable oversized hoodies in solid colors and prints', TRUE, NOW(), NOW()),
('Denim Jackets', 'Casual', 'Unisex', 'Flipkart', 29000, 28.4, '₹1,200 - ₹3,500', 81, 'Winter', 'Pan-India', 'Classic denim jackets in various washes and distressed styles', TRUE, NOW(), NOW()),

-- ACCESSORIES - FEMALE
('Oxidized Silver Jewelry Sets', 'Accessories', 'Female', 'Meesho', 37000, 48.7, '₹300 - ₹1,500', 89, 'Festival', 'Pan-India', 'Trendy oxidized silver necklaces, earrings, and bangles for ethnic looks', TRUE, NOW(), NOW()),
('Statement Earrings', 'Accessories', 'Female', 'Myntra', 31000, 41.3, '₹400 - ₹2,000', 86, 'Party', 'Pan-India', 'Oversized and statement earrings in various designs', TRUE, NOW(), NOW()),
('Embroidered Potli Bags', 'Accessories', 'Female', 'Amazon', 22000, 36.5, '₹500 - ₹2,000', 83, 'Wedding', 'Pan-India', 'Traditional potli bags with embroidery and mirror work', TRUE, NOW(), NOW()),
('Juttis and Mojaris', 'Accessories', 'Female', 'Ajio', 28000, 33.8, '₹600 - ₹2,500', 84, 'Wedding', 'North India', 'Embroidered traditional footwear for ethnic outfits', TRUE, NOW(), NOW()),

-- ACCESSORIES - MALE
('Leather Formal Belts', 'Accessories', 'Male', 'Amazon', 26000, 19.4, '₹500 - ₹2,000', 78, 'Spring', 'Pan-India', 'Classic leather belts for formal and casual wear', TRUE, NOW(), NOW()),
('Ethnic Mojaris', 'Accessories', 'Male', 'Myntra', 19000, 29.7, '₹800 - ₹3,000', 79, 'Wedding', 'North India', 'Traditional embroidered mojaris for ethnic outfits', TRUE, NOW(), NOW()),
('Designer Wallets', 'Accessories', 'Male', 'Flipkart', 32000, 21.3, '₹600 - ₹3,500', 77, 'Spring', 'Pan-India', 'Leather and synthetic wallets in various styles', TRUE, NOW(), NOW()),

-- FOOTWEAR - FEMALE
('Platform Heels', 'Accessories', 'Female', 'Myntra', 29000, 37.2, '₹1,200 - ₹4,000', 85, 'Party', 'Urban India', 'Comfortable platform heels for parties and formal events', TRUE, NOW(), NOW()),
('Kolhapuri Chappals', 'Accessories', 'Female', 'Amazon', 24000, 26.8, '₹400 - ₹1,500', 81, 'Summer', 'Pan-India', 'Traditional handcrafted Kolhapuri footwear', TRUE, NOW(), NOW()),

-- FOOTWEAR - MALE
('Formal Leather Shoes', 'Accessories', 'Male', 'Myntra', 33000, 23.5, '₹1,500 - ₹5,000', 82, 'Spring', 'Pan-India', 'Oxford and Derby style formal shoes', TRUE, NOW(), NOW()),
('Casual Sneakers', 'Accessories', 'Male', 'Amazon', 44000, 31.7, '₹1,200 - ₹4,000', 87, 'Spring', 'Pan-India', 'Trendy sneakers for casual and athleisure looks', TRUE, NOW(), NOW()),

-- ACTIVE WEAR - UNISEX
('Yoga Pants and Leggings', 'Activewear', 'Unisex', 'Amazon', 39000, 42.1, '₹600 - ₹2,500', 86, 'Spring', 'Pan-India', 'Stretchable and moisture-wicking yoga wear', TRUE, NOW(), NOW()),
('Sports Bras', 'Activewear', 'Female', 'Myntra', 27000, 38.9, '₹500 - ₹2,000', 83, 'Spring', 'Pan-India', 'High-support sports bras forworkouts', TRUE, NOW(), NOW()),
('Gym Shorts and Track Pants', 'Activewear', 'Unisex', 'Flipkart', 35000, 29.3, '₹500 - ₹1,800', 81, 'Spring', 'Pan-India', 'Comfortable activewear bottoms for workouts', TRUE, NOW(), NOW());

-- Verification query
SELECT 'Fashion trends data inserted successfully!' AS status;
SELECT COUNT(*) AS total_trends FROM fashion_trends;
SELECT category, COUNT(*) AS count FROM fashion_trends GROUP BY category ORDER BY count DESC;
SELECT platform, COUNT(*) AS items FROM fashion_trends GROUP BY platform;
