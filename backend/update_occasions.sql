-- SQL Script to Update Occasions Table with Gender-Specific Data
-- Run this in MySQL after updating the Java entity classes

USE outfit_recommendation_db;

-- Add new columns to occasions table (MySQL compatible syntax)
-- First, check and add gender column
SET @dbname = 'outfit_recommendation_db';
SET @tablename = 'occasions';
SET @columnname = 'gender';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(10) NOT NULL DEFAULT 'Unisex'")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add outfit_suggestions column
SET @columnname = 'outfit_suggestions';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TEXT")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add color_palette column
SET @columnname = 'color_palette';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TEXT")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add accessories column
SET @columnname = 'accessories';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TEXT")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add dos_and_donts column
SET @columnname = 'dos_and_donts';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TEXT")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Clear existing data
TRUNCATE TABLE occasions;

-- Insert Indian Occasions for MEN
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Festival', 'Diwali', 'North India', 'The Festival of Lights is celebrated with grandeur across India. It symbolizes the victory of light over darkness and good over evil.', 'Male',
'• Traditional: Silk kurta with churidar or dhoti, embroidered Nehru jacket or sherwani
• Modern: Designer kurta with slim-fit trousers, bandi jacket
• Fabric: Silk, brocade, cotton silk
• Style: Rich embroidery, zari work, traditional motifs',
'• Royal colors: Maroon, deep red, gold, cream, ivory, navy blue
• Festive shades: Orange, yellow, emerald green
• Metallic accents: Gold, copper threading',
'• Mojari or traditional jutis
• Silk pocket square
• Gold or silver kada (bracelet)
• Turban or safa (for special events)
• Stole or dupatta',
'✅ DO: Wear traditional fabrics, go for rich colors, iron clothes well
❌ DON''T: Wear all black, avoid overly casual attire, skip accessories'),

('Festival', 'Diwali', 'North India', 'The Festival of Lights - a celebration of prosperity, new beginnings, and the triumph of good over evil.', 'Female',
'• Traditional: Silk saree (Banarasi, Kanjeevaram), lehenga choli, anarkali suit
• Modern: Designer sharara, palazzo suit, Indo-Western gown
• Fabric: Silk, georgette, velvet, brocade
• Style: Heavy embroidery, sequins, mirror work, zari borders',
'• Classic: Red, maroon, gold, orange, yellow, green
• Modern: Fuschia pink, royal blue, emerald, peacock green
• Metallics: Gold, silver embellishments',
'• Kundan or polki jewelry set
• Bangles and kadas
• Maang tikka or matha patti
• Embroidered potli bag
• Embellished jutis or heels
• Fresh jasmine gajra in hair',
'✅ DO: Coordinate jewelry with outfit, use bindis, apply mehendi
❌ DON''T: Over-accessorize, wear white (inauspicious), skip makeup'),

('Festival', 'Holi', 'Pan India', 'The vibrant Festival of Colors celebrating the arrival of spring and the victory of good over evil.', 'Male',
'• Casual: White kurta with pajama or churidar
• Modern: White t-shirt with white chinos
• Fabric: Cotton, khadi (easy to wash)
• Style: Simple, comfortable, ready to get colorful',
'• Base: White or light pastels (will be covered in colors!)
• Color play: Be ready for all rainbow colors
• Tip: Old white clothes are perfect',
'• Sunglasses or UV glasses (protect eyes from colors)
• Minimal jewelry - avoid silver/gold
• Comfortable kolhapuri chappals
• Waterproof watch (optional)',
'✅ DO: Wear white/light colors, use oil on skin before playing, comfortable footwear
❌ DON''T: Wear expensive clothes, silk or leather, avoid heavy jewelry'),

('Festival', 'Holi', 'Pan India', 'The joyous Festival of Colors marking spring''s arrival with vibrant celebrations and unity.', 'Female',
'• Traditional: White cotton kurta with salwar or leggings
• Modern: White palazzo with kurta, white indo-western outfit
• Fabric: Cotton, khadi, denim (washable fabrics)
• Style: Simple, comfortable, movement-friendly',
'• Base: White, cream, light yellow, light pink
• Tip: Whatever you wear will transform into rainbow colors!
• Avoid: Expensive embroidered or silk garments',
'• Minimal silver jewelry or skip entirely
• Comfortable flats or kolhapuris
• Dupatta (can use as protection)
• Waterproof watch
• Sunglasses',
'✅ DO: Apply oil/moisturizer before playing, tie hair securely, wear old clothes
❌ DON''T: Wear white designer wear, avoid leather accessories, skip heavy makeup'),

('Wedding', 'North Indian Wedding', 'Punjab, Delhi, Haryana', 'Grand celebrations featuring vibrant ceremonies from Mehendi to Baraat with rich cultural traditions.', 'Male',
'• Mehendi/Sangeet: Kurta with Nehru jacket, colorful turban
• Wedding: Sherwani with churidar, traditional jodhpuri suit
• Reception: Indo-Western suit, bandh gala
• Fabric: Silk, brocade, velvet
• Style: Heavy embroidery, zardozi work',
'• Mehendi: Bright colors - yellow, orange, pink, green
• Wedding: Royal - maroon, gold, cream, beige, burgundy
• Reception: Bold - navy, black, wine, royal blue',
'• Embroidered mojaris or jutis
• Turban (coordinated with outfit)
• Gold or kundan brooch
• Pocket square
• Watch (traditional or minimal)
• Stole or dupatta',
'✅ DO: Coordinate with bride''s family colors, wear comfortable shoes
❌ DON''T: Overdress the bride, wear all white, avoid torn jeans'),

('Wedding', 'North Indian Wedding', 'Punjab, Delhi, Haryana', 'Spectacular multi-day celebration filled with colorful ceremonies, music, and traditional rituals.', 'Female',
'• Mehendi: Yellow/orange lehenga, Anarkali suit, sharara
• Wedding: Heavy silk saree, bridal lehenga, gharara
• Reception: Designer gown, saree, indo-western outfit
• Fabric: Silk, velvet, georgette, net',
'• Mehendi: Yellow, orange, green, pink, mint
• Wedding: Red, maroon, pink, gold, orange
• Reception: Pastels, jewel tones, metallics',
'• Heavy kundan/polki jewelry for wedding
• Maang tikka, nath (nose ring), jhumkas
• Bangles and kadas
• Embroidered clutch or potli
• Designer heels or jutis
• Gajra in hair',
'✅ DO: Get makeup professionally done, color coordinate, break in shoes before
❌ DON''T: Wear white, overdress bride, skip trial makeup'),

('Wedding', 'South Indian Wedding', 'Tamil Nadu, Kerala, Karnataka', 'Traditional ceremonies rich in Vedic rituals, featuring temple visits and sacred customs.', 'Male',
'• Wedding: Silk veshti (dhoti) with angavastram, silk kurta
• Reception: Silk kurta with veshti, traditional pancha
• Fabric: Pure silk (Kanchipuram, Mysore silk)
• Style: Traditional draping, gold zari borders',
'• Classic: White with gold border, cream, ivory
• Modern: Light gold, beige, off-white
• Borders: Gold, red, maroon zari work',
'• Traditional gold jewelry (minimal)
• Sacred thread (yagnopaveetham)
• Gold ring or chain
• Traditional jutis
• Sandalwood tilak',
'✅ DO: Follow temple dress codes, wear silk, keep it traditional
❌ DON''T: Wear stitched clothes for certain ceremonies, avoid black'),

('Wedding', 'South Indian Wedding', 'Tamil Nadu, Kerala, Karnataka', 'Sacred ceremonies steeped in tradition, featuring elaborate rituals and temple blessings.', 'Female',
'• Wedding: Kanchipuram silk saree, Temple border saree
• Reception: Silk saree, designer lehenga
• Muhurtham: Traditional silk with heavy zari
• Fabric: Pure Kanchipuram silk, Mysore silk',
'• Traditional: Red, maroon, gold, green, purple
• Borders: Heavy gold zari work
• Modern: Teal, peacock green, royal blue with gold',
'• Temple jewelry (gold)
• Long jhumkas, heavy necklace
• Maang tikka, waist belt (odiyanam)
• Fresh jasmine gajra
• Gold bangles
• Traditional kumkum/bindi',
'✅ DO: Wear heavy silk, go for gold jewelry, traditional hairstyle with flowers
❌ DON''T: Skip the gajra, wear synthetic sarees, minimal jewelry'),

('Festival', 'Onam', 'Kerala', 'Kerala''s harvest festival celebrating King Mahabali''s annual visit with flower carpets and Sadya feast.', 'Male',
'• Traditional: White mundu (dhoti) with colored border, kurta
• Kasavu mundu: White with gold zari border
• Fabric: Cotton, silk
• Style: Clean, simple, traditional Kerala draping',
'• Classic: White with gold border
• Modern: White with red/maroon border
• Keep it minimal and traditional',
'• Minimal gold jewelry
• Traditional Kerala earrings (optional)
• Sandalwood paste on forehead
• Clean leather chappals',
'✅ DO: Wear fresh white clothes, iron well, follow traditions
❌ DON''T: Wear bright colors, avoid synthetic fabrics'),

('Festival', 'Onam', 'Kerala', 'Kerala''s harvest festival honoring prosperity, featuring pookalams and the grand Sadya feast.', 'Female',
'• Traditional: Kasavu saree (white with gold border)
• Set mundu: Two-piece Kerala traditional attire
• Fabric: Pure cotton or silk
• Style: Traditional Kerala draping',
'• Classic: White with gold zari border
• Elegant: Cream with golden border
• Traditional only - no bright colors',
'• Gold jewelry (traditional Kerala patterns)
• Jasmine flowers in hair (gajra)
• Simple gold earrings and necklace
• Traditional Kerala earrings (jimikki)
• Small bindi',
'✅ DO: Wear white and gold, fresh jasmine, traditional jewelry
❌ DON''T: Wear colorful sarees, western accessories, heavy makeup'),

('Corporate', 'Business Meeting', 'Pan India', 'Professional corporate meetings requiring formal business attire and polished appearance.', 'Male',
'• Formal: Well-fitted business suit (2-piece or 3-piece)
• Smart casual: Dress shirt with trousers, blazer optional
• Fabric: Wool blend, cotton, linen (season appropriate)
• Style: Clean lines, professional fit, wrinkle-free',
'• Conservative: Navy blue, charcoal grey, black
• Shirts: White, light blue, subtle patterns
• Safe choices: Earth tones, muted colors',
'• Leather formal shoes (oxford, derby)
• Matching leather belt
• Professional watch
• Tie or bow tie (for formal)
• Leather portfolio/briefcase
• Minimal cologne',
'✅ DO: Iron clothes well, polish shoes, groom facial hair
❌ DON''T: Wear sneakers, skip tie for very formal meetings, loud colors'),

('Corporate', 'Business Meeting', 'Pan India', 'Professional corporate setting demanding appropriate formal business attire and neat presentation.', 'Female',
'• Formal: Pantsuit or skirt suit, formal saree
• Business casual: Formal kurta with trousers, sheath dress
• Fabric: Cotton, linen, wool blend, silk (for saree)
• Style: Professional, well-fitted, conservative',
'• Conservative: Navy, black, grey, beige, white
• Pastels: Light pink, mint, lavender
• Avoid: Bright neons, very loud prints',
'• Closed-toe formal shoes (pumps, loafers)
• Minimal jewelry
• Professional watch
• Structured handbag or laptop bag
• Subtle makeup',
'✅ DO: Dress conservatively, maintain neat appearance, comfortable shoes
❌ DON''T: Wear sleeveless without jacket, loud jewelry, strong perfume'),

('Party', 'Cocktail Party', 'Urban India', 'Semi-formal evening social gathering with drinks, networking, and sophisticated ambiance.', 'Male',
'• Smart casual: Blazer with chinos or dress pants
• Modern: Turtleneck with blazer, dress shirt (no tie)
• Fabric: Cotton, linen, velvet blazer
• Style: Trendy, well-fitted, fashion-forward',
'• Versatile: Navy, black, grey, burgundy
• Bold: Jewel tones - emerald, sapphire
• Patterns: Subtle checks, textures',
'• Leather loafers or brogues
• Statement watch
• Leather belt
• Pocket square (optional)
• Subtle cologne',
'✅ DO: Dress smart casual, groom well, confident style
❌ DON''T: Overdress in full suit, wear sneakers, excessive cologne'),

('Party', 'Cocktail Party', 'Urban India', 'Elegant evening social event perfect for stylish cocktail attire and sophisticated networking.', 'Female',
'• Cocktail dress: Knee-length to midi dress
• Indo-Western: Saree gown, drape dress, sharara
• Separates: Crop top with high-waist skirt
• Fabric: Satin, silk, chiffon, velvet',
'• Classic: Black, navy, emerald, wine
• Bold: Ruby red, gold, silver metallics
• Pastels: Blush, champagne, lavender',
'• Heels (4-6 inch)
• Statement jewelry or minimal chic
• Clutch or small handbag
• Makeup: Bold lips or eyes
• Hair: Styled (updo or loose waves)',
'✅ DO: Wear heels, accessorize well, evening makeup
❌ DON''T: Overdress in lehenga, skip heels, wear daytime clothes');

-- Insert some Unisex/Global occasions
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Festival', 'Christmas', 'Global', 'Christian festival celebrating the birth of Jesus Christ with joy, gifts, and family gatherings.', 'Unisex',
'• Traditional Western: Formal attire, festive sweaters, church dress
• Indian Context: Indo-western fusion, formal ethnic
• Colors: Red, green, white, gold
• Style: Festive, warm, family-friendly',
'• Festive: Red, green, white, gold, silver
• Traditional: Navy, burgundy, forest green
• Metallics: Gold and silver accents',
'• Festive accessories
• Warm scarves or stoles
• Christmas-themed jewelry
• Comfortable formal shoes',
'✅ DO: Embrace festive colors, dress warmly if outdoors, family-appropriate
❌ DON''T: All black (unless formal evening), overly casual'),

('Festival', 'New Year Party', 'Global', 'Global celebration marking the beginning of a new year with parties, countdowns, and fresh starts.', 'Unisex',
'• Party: Cocktail dress, suit, indo-western fusion
• Club: Trendy party wear, sequins, metallics
• Fabric: Velvet, silk, satin, sequined fabrics
• Style: Glamorous, party-ready, celebratory',
'• Metallics: Gold, silver, rose gold
• Bold: Black, navy, emerald, ruby red
• Sparkle: Sequins and glitter accents',
'• Statement jewelry
• Party heels or polished shoes
• Clutch or small bag
• Party makeup (shimmer, glitter)
• Hair: Styled and polished',
'✅ DO: Go glamorous, wear sequins/metallics, party makeup
❌ DON''T: Underdress, wear uncomfortable shoes, skip the festive vibe');

-- Verify the data
SELECT occasion_name, gender, occasion_type, region FROM occasions ORDER BY gender, occasion_type;
