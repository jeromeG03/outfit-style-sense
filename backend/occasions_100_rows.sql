-- 100+ Occasions Data with Gender-Specific Styling Details
USE outfit_recommendation_db;

-- Clear existing data
TRUNCATE TABLE occasions;

-- FESTIVALS - MALE
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Festival', 'Diwali', 'Pan-India', 'Festival of lights, grand traditional wear like silks and embroidered ethnic outfits', 'Male',
'• Traditional: Silk kurta with churidar, embroidered Nehru jacket, sherwani
• Modern: Designer kurta with slim trousers, bandi jacket
• Fabric: Silk, brocade, cotton silk',
'• Royal: Maroon, deep red, gold, cream, navy blue
• Festive: Orange, yellow, emerald green
• Metallic accents: Gold, copper threading',
'• Mojaris or jutis, silk pocket square, gold/silver kada, turban for special events, stole',
'✅ DO: Rich fabrics, vibrant colors, iron well
❌ DON''T: All black, overly casual, skip accessories'),

('Festival', 'Holi', 'Pan-India', 'Festival of colors, comfortable white cottons or light breathable fabrics', 'Male',
'• Casual: White kurta with pajama or churidar
• Modern: White t-shirt with white chinos
• Fabric: Cotton, khadi (easy to wash)',
'• Base: White or light pastels
• After play: Rainbow colors!
• Tip: Old comfortable clothes',
'• Sunglasses (protect from colors), minimal jewelry, kolhapuri chappals, waterproof watch',
'✅ DO: White/light colors, oil on skin before play, comfortable footwear
❌ DON''T: Expensive clothes, silk, heavy jewelry'),

('Festival', 'Eid al-Fitr', 'Pan-India', 'Celebratory traditional wear, elegant embroidery and festive ethnic wear', 'Male',
'• Traditional: Kurta with pajama, sherwani with churidar
• Modern: Pathani suit, Lucknowi kurta
• Fabric: Cotton, silk, linen blend',
'• Classic: White, cream, light gold, mint green
• Festive: Powder blue, rose, lavender
• Avoid: Very dark colors',
'• Traditional cap (topi), elegant mojaris, pocket square, attar perfume, prayer beads',
'✅ DO: Fresh clean clothes, modest style, traditional footwear
❌ DON''T: Flashy jewelry, shorts, western casuals'),

('Festival', 'Navratri (Garba Night)', 'Gujarat', 'High-energy dance event, colorful traditional Gujarati attire', 'Male',
'• Traditional: Kediyu with dhoti or churidar
• Modern: Kurta with koti (jacket), dhoti pants
• Fabric: Cotton, cotton-silk (breathable for dancing)',
'• Vibrant: Orange, red, yellow, green, blue
• Mirror work: Traditional mirror embroidery
• Dandiya colors: Coordinate with dandiya sticks',
'• Colorful pagdi (turban), mojaris, oxidized jewelry, dandiya sticks, small waist bag',
'✅ DO: Comfortable for dancing, vibrant colors, traditional look
❌ DON''T: Heavy fabrics, tight fits, formal shoes'),

('Festival', 'Durga Puja (Ashtami)', 'West Bengal', 'Peak festival day, traditional Bengali attire', 'Male',
'• Traditional: Punjabi-pajama (kurta-pyjama), dhuti-kurta
• Modern: Designer kurta with churidar
• Fabric: Cotton, silk, khadi',
'• Classic: White, cream, off-white with subtle borders
• Festive: Light yellow, terracotta, maroon
• Traditional: Handloom weaves',
'• Traditional Bengali sandals, minimal gold chain, pocket square, gamcha (towel)',
'✅ DO: Clean traditional look, handloom fabric, comfortable
❌ DON''T: Western wear, loud patterns, heavy accessories'),

('Festival', 'Ganesh Chaturthi', 'Maharashtra', 'Vibrant celebration, traditional Marathi attire', 'Male',
'• Traditional: Kurta with dhoti, sadra with pheta
• Modern: Designer kurta with churidar
• Fabric: Cotton, silk for evening',
'• Festive: Saffron, red, yellow, green
• Traditional: White with colored borders
• Gold accents: Zari work',
'• Pheta (traditional turban), kolhapuri chappals, rudraksha mala, waist cloth',
'✅ DO: Traditional Marathi style, comfortable for celebrations
❌ DON''T: All black, western formals'),

('Festival', 'Pongal', 'Tamil Nadu', 'Harvest festival, traditional silk attire', 'Male',
'• Traditional: Silk veshti (dhoti) with angavastram, silk shirt
• Modern: Silk kurta with veshti
• Fabric: Pure silk, cotton silk',
'• Traditional: White with gold border, cream
• Modern: Light gold, beige, off-white
• Borders: Gold, red zari work',
'• Traditional jutis, gold chain, sandalwood paste, traditional watch',
'✅ DO: Traditional silk, gold borders, clean pressed look
❌ DON''T: Stitched lower wear for traditional, synthetic fabrics'),

('Festival', 'Onam', 'Kerala', 'Harvest festival, classic kasavu attire', 'Male',
'• Traditional: White mundu with gold border, kurta
• Kasavu mundu: White with gold zari border
• Fabric: Cotton, silk',
'• Classic: White with gold border
• Modern: White with red/maroon border
• Keep traditional',
'• Minimal gold jewelry, sandalwood paste, leather chappals, traditional watch',
'✅ DO: Fresh white clothes, traditional Kerala style
❌ DON''T: Bright colors, synthetic fabrics'),

('Festival', 'Bihu', 'Assam', 'Harvest festival, traditional Assamese attire', 'Male',
'• Traditional: Dhoti-kurta, gamosa (traditional towel-scarf)
• Modern: Silk kurta with pajama
• Fabric: Pat silk, muga silk',
'• Traditional: White, cream with red borders
• Gamosa: White with red threadwork
• Natural tones',
'• Gamosa around neck/waist, traditional jaapi (hat), wooden sandals',
'✅ DO: Traditional Assamese style, gamosa important
❌ DON''T: Western wear, skip gamosa'),

('Festival', 'Lohri', 'Punjab', 'Winter bonfire festival, warm festive attire', 'Male',
'• Traditional: Kurta with warm jacket, turban
• Modern: Warm Nehru jacket with kurta-pajama
• Fabric: Wool blend, warm cotton',
'• Festive: Orange, yellow, red, green
• Warm tones: Mustard, rust, brown
• Bright and cheerful',
'• Colorful turban, warm shawl, traditional jutis, kada',
'✅ DO: Warm layers, bright colors, comfortable
❌ DON''T: Light fabrics, dark colors only'),

('Festival', 'Makar Sankranti', 'Gujarat/Rajasthan', 'Kite festival, bright comfortable traditional wear', 'Male',
'• Traditional: Kurta with koti, dhoti or churidar
• Modern: Casual kurta with jeans
• Fabric: Breathable cotton',
'• Bright: Yellow, orange, red, green (kite colors)
• Comfortable: Light pastels
• Avoid: Dark colors',
'• Sun protection accessories, comfortable mojaris, tilak, small utility bag for kite flying',
'✅ DO: Comfortable, bright colors, sun protection
❌ DON''T: Restrictive clothes, formal wear'),

('Festival', 'Karwa Chauth', 'North India', 'Fasting festival for married couples', 'Male',
'• Traditional: Kurta-pajama, sherwani
• Modern: Designer kurta with churidar
• Fabric: Silk, brocade',
'• Festive: Red, maroon, gold, cream
• Rich: Deep colors with embroidery
• Traditional preferred',
'• Mojaris, pocket square, wristwatch, minimal jewelry',
'✅ DO: Support wife with good attire, traditional look
❌ DON''T: Casual wear, shorts'),

('Festival', 'Gudi Padwa', 'Maharashtra', 'Marathi New Year, traditional festive wear', 'Male',
'• Traditional: Kurta-pajama with shawl, pheta (turban)
• Modern: Designer ethnic wear
• Fabric: Silk, cotton',
'• New Year: Bright auspicious colors
• Traditional: Saffron, yellow, green
• Gold accents',
'• Pheta (turban), kolhapuris, traditional jewelry, fresh flowers',
'✅ DO: New clothes, traditional Marathi style
❌ DON''T: Old/worn clothes, all black'),

('Festival', 'Ugadi', 'Andhra/Telangana/Karnataka', 'Telugu/Kannada New Year, festive traditional attire', 'Male',
'• Traditional: Silk kurta with dhoti/panche
• Modern: Designer kurta with churidar
• Fabric: Silk, cotton',
'• Auspicious: Yellow, gold, red, green
• New beginnings: Bright colors
• Traditional silks',
'• Traditional jutis, sandalwood paste, silk angavastram, gold accessories',
'✅ DO: New clothes, silk preferred, bright colors
❌ DON''T: Dark colors, worn clothes');

-- FESTIVALS - FEMALE
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Festival', 'Diwali', 'Pan-India', 'Festival of lights, grand traditional wear like silks and lehengas', 'Female',
'• Traditional: Silk saree (Banarasi, Kanjeevaram), lehenga choli, anarkali
• Modern: Designer sharara, palazzo suit, Indo-Western gown
• Fabric: Silk, georgette, velvet, brocade',
'• Classic: Red, maroon, gold, orange, yellow, green
• Modern: Fuschia pink, royal blue, emerald, peacock green
• Metallics: Gold, silver embellishments',
'• Kundan/polki jewelry, bangles, maang tikka, potli bag, embellished heels/jutis, jasmine gajra',
'✅ DO: Coordinate jewelry, bindis, mehendi
❌ DON''T: Over-accessorize, white, skip makeup'),

('Festival', 'Holi', 'Pan-India', 'Festival of colors, comfortable white cottons or light breathable fabrics', 'Female',
'• Traditional: White cotton kurta with salwar
• Modern: White palazzo with kurta, white indo-western
• Fabric: Cotton, khadi, denim (washable)',
'• Base: White, cream, light yellow, light pink
• Post-play: Rainbow transformation!
• Old comfortable clothes',
'• Minimal silver jewelry, comfortable flats/kolhapuris, dupatta, waterproof watch, sunglasses',
'✅ DO: Apply oil before play, tie hair, old clothes
❌ DON''T: Designer wear, leather accessories, heavy makeup'),

('Festival', 'Eid al-Fitr', 'Pan-India', 'Celebratory traditional wear, elegant embroidery and shararas', 'Female',
'• Traditional: Sharara suit, anarkali, palazzo suit
• Modern: Designer gharara, kurti with skirt
• Fabric: Georgette, chiffon, silk',
'• Classic: Pastels - mint, peach, powder blue, lilac
• Festive: Gold, silver, rose gold
• Elegant: Subtle embroidery colors',
'• Statement earrings, bangles, embroidered dupatta, clutch, elegant heels, hijab (if preferred)',
'✅ DO: Modest elegance, fresh clothes, delicate jewelry
❌ DON''T: Too revealing, very loud colors, heavy makeup'),

('Festival', 'Navratri (Garba Night)', 'Gujarat', 'High-energy dance event, colorful chaniya cholis', 'Female',
'• Traditional: Chaniya choli with dupatta, lehenga
• Modern: Indo-western garba outfit, flared skirt with crop top
• Fabric: Cotton, georgette with mirror work',
'• Vibrant: Red, yellow, green, blue, orange, pink
• Mirror work: Heavy mirror and thread embroidery
• Dandiya coordination: Colorful contrasts',
'• Oxidized jewelry, bangles, maang tikka, embroidered mojaris, dandiya sticks, potli bag',
'✅ DO: Comfortable for dancing, vibrant colors, traditional jewelry
❌ DON''T: Tight fits, heavy fabrics, high heels'),

('Festival', 'Durga Puja (Ashtami)', 'West Bengal', 'Peak festival day, traditional laal-paar sarees', 'Female',
'• Traditional: Laal-paar saree (white with red border), tant saree
• Modern: Designer Bengali saree, silk saree
• Fabric: Tant cotton, silk, handloom',
'• Traditional: White with red border (laal-paar)
• Festive: Red, maroon, yellow, terracotta
• Handloom patterns',
'• Red/white bangles (shakha-pola), sindoor, large red bindi, gold jewelry, traditional sandals',
'✅ DO: Traditional Bengali style, alta on hands/feet, fresh flowers in hair
❌ DON''T: Western wear, minimal jewelry, synthetic sarees'),

('Festival', 'Ganesh Chaturthi', 'Maharashtra', 'Vibrant celebration, traditional Nauvari or Paithani sarees', 'Female',
'• Traditional: Nauvari saree (9-yard), Paithani saree
• Modern: Silk saree, lehenga choli
• Fabric: Silk, cotton silk, paithani weave',
'• Festive: Green, yellow, red, orange, magenta
• Traditional: Rich Paithani colors
• Gold zari work',
'• Traditional Marathi nath (nose ring), bangles, gajra, bindi, kolhapuris, waist belt',
'✅ DO: Traditional Maharashtrian jewelry, fresh gajra
❌ DON''T: Western wear, minimal accessories'),

('Festival', 'Pongal', 'Tamil Nadu', 'Harvest festival, traditional silk sarees', 'Female',
'• Traditional: Kanchipuram silk saree, traditional drape
• Modern: Silk saree with contemporary draping
• Fabric: Pure Kanchipuram silk, Mysore silk',
'• Traditional: Red, maroon, gold, green, purple
• Borders: Heavy gold zari work
• Auspicious colors',
'• Temple jewelry, jasmine gajra, gold bangles, kumkum, traditional jutis, maang tikka',
'✅ DO: Heavy silk, gold jewelry, traditional hairstyle with flowers
❌ DON''T: Synthetic sarees, minimal jewelry, modern draping'),

('Festival', 'Onam', 'Kerala', 'Harvest festival, classic kasavu sarees', 'Female',
'• Traditional: Kasavu saree (white with gold border), set mundu
• Two-piece: Set mundu traditional Kerala attire
• Fabric: Pure cotton or silk kasavu',
'• Classic: White with gold zari border
• Elegant: Cream with golden border
• Traditional only',
'• Gold jewelry (Kerala style), jasmine gajra, simple earrings, traditional jimikki, small bindi',
'✅ DO: White and gold, fresh jasmine, traditional Kerala jewelry
❌ DON''T: Colorful sarees, western accessories, heavy makeup'),

('Festival', 'Bihu', 'Assam', 'Harvest festival, traditional muga silk mekhela chadors', 'Female',
'• Traditional: Mekhela chador (two-piece), riha with chador
• Modern: Designer Assamese traditional wear
• Fabric: Muga silk, pat silk, eri silk',
'• Traditional: Golden muga, white, red
• Festive: Bright colors with traditional weaves
• Natural silk tones',
'• Traditional Assamese jewelry (dugdugi, jonbiri), flowers in hair, traditional gamosa',
'✅ DO: Traditional muga silk, Assamese jewelry patterns
❌ DON''T: Western wear, synthetic fabrics'),

('Festival', 'Lohri', 'Punjab', 'Winter bonfire festival, bright patiala suits and warm festive layers', 'Female',
'• Traditional: Patiala suit, salwar kameez with warm dupatta
• Modern: Sharara with warm embroidered jacket
• Fabric: Velvet, wool blend, warm cotton',
'• Festive: Bright yellow, orange, red, green, pink
• Warm: Mustard, rust, burgundy
• Cheerful vibrant tones',
'• Heavy dupatta, traditional jutis, warm shawl, bangles, traditional Punjabi jewelry, maang tikka',
'✅ DO: Warm layers, bright colors, traditional Punjabi look
❌ DON''T: Light fabrics, pastel only, no layers'),

('Festival', 'Makar Sankranti', 'Gujarat/Rajasthan', 'Kite festival, bright and comfortable cotton traditional wear', 'Female',
'• Traditional: Comfortable kurta with salwar, bandhani dupatta
• Modern: Cotton palazzo suit
• Fabric: Breathable cotton, lightweight',
'• Kite colors: Yellow, orange, red, green, blue
• Comfortable: Light pastels, white
• Bright festive tones',
'• Colorful bangles, comfortable jutis, small bindi, sun protection dupatta, minimal jewelry',
'✅ DO: Comfortable, bright colors, breathable fabrics
❌ DON''T: Heavy attire, dark colors, restrictive fits'),

('Festival', 'Karwa Chauth', 'North India', 'Fasting festival, heavy traditional wear in reds and pinks', 'Female',
'• Traditional: Heavy silk saree, bridal lehenga, anarkali
• Modern: Designer sharara, gharara, heavy suit
• Fabric: Silk, velvet, georgette with heavy work',
'• Bridal tones: Red, maroon, pink, orange, gold
• Heavy embroidery: Zari, sequins, stones
• Auspicious colors',
'• Complete bridal jewelry, mehendi, bangles, bindi, maang tikka, nath, heavy dupatta, embroidered jutis',
'✅ DO: Full bridal look, heavy jewelry, mehendi on hands
❌ DON''T: Simple attire, minimal jewelry, light colors'),

('Festival', 'Gudi Padwa', 'Maharashtra', 'Marathi New Year, traditional nauvari sarees and bright ethnic wear', 'Female',
'• Traditional: Nauvari saree, Paithani saree
• Modern: Silk saree, lehenga choli
• Fabric: Silk, paithani weave',
'• New Year: Bright yellow, green, orange, magenta
• Auspicious: Red, gold
• Traditional Paithani colors',
'• Nath (nose ring), Maharashtrian jewelry, gajra, bangles, bindi, traditional jutis',
'✅ DO: New clothes, traditional style, Maharashtrian jewelry
❌ DON''T: Old clothes, western wear, minimal accessories'),

('Festival', 'Ugadi', 'Andhra/Telangana/Karnataka', 'New Year, festive silks and bright traditional colors', 'Female',
'• Traditional: Silk saree (Kanchipuram, Pochampally), pattu pavada
• Modern: Designer silk saree, half-saree
• Fabric: Pure silk, cotton silk',
'• Auspicious: Yellow, red, green, gold, magenta
• New beginnings: Bright festive colors
• Silk with zari',
'• Gold temple jewelry, jasmine flowers, kumkum, bangles, traditional toe rings, jutis',
'✅ DO: New silk clothes, temple jewelry, traditional hairstyle
❌ DON''T: Dark colors, synthetic fabrics, minimal jewelry');

-- WEDDINGS & OCCASIONS
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Pre-Wedding', 'Roka Ceremony', 'Pan-India', 'Intimate gathering, light pastel traditional wear', 'Female',
'• Traditional: Pastel saree, light lehenga, anarkali suit
• Modern: Palazzo suit, indo-western dress
• Fabric: Georgette, chiffon, silk',
'• Pastels: Peach, mint, powder blue, lavender, blush pink
• Light: Cream, gold, champagne
• Elegant soft tones',
'• Delicate jewelry, small clutch, elegant heels, light makeup, soft bindi, minimal bangles',
'✅ DO: Elegant pastels, light makeup, family-appropriate
❌ DON''T: Heavy bridal look, too casual, dark colors'),

('Pre-Wedding', 'Haldi Ceremony', 'Pan-India', 'Messy daytime event, yellow or white breathable cottons', 'Female',
'• Traditional: Yellow cotton kurta-salwar, white kurta
• Modern: Yellow palazzo suit, lehenga
• Fabric: Cotton, chiffon (easy wash)',
'• Haldi colors: Yellow, white, orange, cream
• Bright: Marigold tones
• Washable fabrics',
'• Minimal jewelry (will get messy), flower jewelry, comfortable flats, skip expensive accessories',
'✅ DO: Comfortable, yellow/white, old jewelry
❌ DON''T: Expensive outfits, heavy jewelry, light colors that stain'),

('Pre-Wedding', 'Mehendi Function', 'Pan-India', 'Festive and colorful, green hues and sleeveless styles', 'Female',
'• Traditional: Green lehenga, anarkali, palazzo suit
• Modern: Indo-western outfit, sharara
• Fabric: Georgette, net, silk blend',
'• Mehendi green: All shades of green, mint, olive
• Complementary: Pink, orange, yellow, gold
• Floral patterns',
'• Light jewelry (mehendi application on hands), flower jewelry, anklets, comfortable heels, haath phool',
'✅ DO: Sleeveless/easy hands access, green tones, comfortable
❌ DON''T: Full sleeves, white, heavy bangles'),

('Pre-Wedding', 'Sangeet Night', 'Pan-India', 'Dance night, glamorous lehengas and Indo-western outfits', 'Female',
'• Glamorous: Heavy lehenga, sharara, Indo-western gown
• Modern: Sequins outfit, cocktail lehenga
• Fabric: Georgette, net, velvet with embellishments',
'• Vibrant: Fuschia, royal blue, emerald, purple, gold
• Glamorous: Sequins, metallics, jewel tones
• Party colors',
'• Statement jewelry, clutch, dancing heels, bold makeup, styled hair, maang tikka',
'✅ DO: Glamorous, comfortable for dancing, party makeup
❌ DON''T: Too heavy to dance, uncomfortable shoes'),

('Wedding', 'Wedding Reception', 'Pan-India', 'Grand evening event, heavy designer sarees and gowns', 'Female',
'• Formal: Heavy designer saree, reception lehenga
• Modern: Indo-western gown, anarkali gown
• Fabric: Silk, velvet, net with heavy work',
'• Rich: Maroon, navy, emerald, wine, royal blue
• Elegant: Metallics, jewel tones
• Heavy embroidery',
'• Statement jewelry, elegant clutch, designer heels, bold makeup, styled updo, dupatta draping',
'✅ DO: Grand elegant look, coordinate with partner
❌ DON''T: Outdress bride, too casual, uncomfortable heels');

-- PROFESSIONAL - FEMALE
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Professional', 'Corporate Interview', 'Global', 'Strictly formal, well-fitted formal attire', 'Female',
'• Formal: Pantsuit, skirt suit, formal saree
• Conservative: Sheath dress with blazer
• Fabric: Wool blend, cotton, silk (saree)',
'• Conservative: Navy, black, charcoal grey, beige
• Professional: White, light blue
• Avoid: Loud colors',
'• Closed-toe pumps, minimal jewelry, professional watch, structured bag, subtle makeup',
'✅ DO: Conservative fit, professional appearance, minimal accessories
❌ DON''T: Sleeveless without blazer, loud prints, strong perfume'),

('Professional', 'Daily Office Wear', 'Global', 'Standard business attire, professional yet comfortable', 'Female',
'• Business casual: Formal kurta with trousers, shirt with skirt
• Western: Formal dress, blazer with pants
• Fabric: Cotton, linen, polyester blend',
'• Professional: Navy, grey, beige, white, pastels
• Safe: Muted tones, subtle patterns
• Avoid: Neon, very bright',
'• Office-appropriate shoes, minimal jewelry, watch, laptop bag, light makeup',
'✅ DO: Professional, comfortable, neat appearance
❌ DON''T: Too casual, revealing, excessive accessories'),

('Smart Casual', 'Tech Conference', 'Global', 'Smart casual, comfortable yet polished look', 'Female',
'• Modern: Smart blazer with jeans, kurta with trousers
• Casual: Nice top with formal pants
• Fabric: Cotton, denim, linen blend',
'• Smart: Navy, grey, white, pastels
• Tech-friendly: Black, minimalist tones
• Comfortable neutrals',
'• Comfortable shoes, minimal tech-friendly accessories, small bag, light makeup',
'✅ DO: Professional but approachable, comfortable shoes
❌ DON''T: Too formal suit, gym wear, party attire');

-- CASUAL & PARTY - FEMALE
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Party', 'Cocktail Party', 'Urban India', 'Elegant evening social event, stylish cocktail attire', 'Female',
'• Cocktail: Knee to midi dress, saree gown
• Indo-Western: Drape dress, sharara
• Fabric: Satin, silk, chiffon, velvet',
'• Classic: Black, navy, emerald, wine, gold
• Bold: Ruby red, silver metallics
• Elegant: Pastels with shimmer',
'• Heels (4-6 inch), statement or minimal jewelry, clutch, bold makeup, styled hair',
'✅ DO: Evening makeup, heels, accessorize well
❌ DON''T: Lehenga, skip heels, daytime attire'),

('Casual', 'Coffee Date', 'Global', 'Effortlessly stylish, smart casual attire', 'Female',
'• Casual: Nice dress, jeans with stylish top
• Modern: Kurta with jeans, co-ord set
• Fabric: Cotton, denim, linen',
'• Comfortable: Pastels, neutrals, denim blue
• Stylish: White, beige, soft pink
• Effortless tones',
'• Comfortable flats/sandals, small purse, minimal jewelry, sunglasses, light makeup',
'✅ DO: Comfortable, effortlessly stylish, light makeup
❌ DON''T: Overdressed, gym wear, party makeup'),

('Casual', 'Dinner Date', 'Global', 'Elegant evening wear for romantic dinner', 'Female',
'• Evening: Elegant dress, saree, nice top with skirt
• Modern: Jumpsuit, co-ord set
• Fabric: Silk, satin, chiffon blend',
'• Romantic: Soft pink, red, black, wine
• Elegant: Navy, emerald, champagne
• Evening tones',
'• Heels or elegant flats, statement jewelry, clutch, evening makeup, styled hair',
'✅ DO: Elegant evening look, heels, romantic colors
❌ DON''T: Too casual, gym wear, overly formal');

-- TRAVEL & LEISURE
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Travel', 'Beach Vacation', 'Global', 'Lightweight resort wear, comfortable beach attire', 'Female',
'• Resort: Sundresses, linen shirts, shorts, swimwear
• Cover-ups: Kaftans, sarongs, beach kimonos
• Fabric: Cotton, linen, quick-dry',
'• Beach: Bright colors, tropical prints, whites
• Summer: Coral, turquoise, yellow, pastels
• Light neutrals',
'• Sun hat, sunglasses, beach bag, flip-flops, minimal jewelry, sunscreen',
'✅ DO: Light breathable fabrics, sun protection
❌ DON''T: Heavy fabrics, formal wear, expensive jewelry'),

('Travel', 'Hill Station Trip', 'North/South India', 'Layered winter wear, stylish cold-weather clothing', 'Female',
'• Winter: Sweaters, jackets, thermals underneath
• Layers: Warm kurta with leggings, jeans with coats
• Fabric: Wool, fleece, warm cotton',
'• Winter: Deep reds, browns, grey, black, navy
• Cozy: Warm earth tones, burgundy
• Layering neutrals',
'• Warm boots, scarves, gloves, winter hat, warm socks, minimal jewelry',
'✅ DO: Multiple layers, warm footwear, weather-appropriate
❌ DON''T: Light fabrics, sandals, insufficient layers'),

('Travel', 'Desert Safari', 'Rajasthan/Middle East', 'Breathable fabrics, sun protection, neutral comfortable tones', 'Female',
'• Desert: Loose cotton pants, breathable kurtas, linen dresses
• Protection: Long sleeves, light scarves
• Fabric: Cotton, linen, breathable fabrics',
'• Desert: Beige, khaki, cream, tan, sand
• Protection: Whites, light neutrals
• Earth tones',
'• Sun hat, sunglasses, comfortable sandals, light scarf, sunscreen, small backpack',
'✅ DO: Sun protection, breathable fabrics, comfortable shoes
❌ DON''T: Dark colors, tight fits, heavy fabrics');

-- ACTIVEWEAR - UNISEX
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Activewear', 'Gym/Workout', 'Global', 'Moisture-wicking fabrics and proper training wear', 'Unisex',
'• Activewear: Moisture-wicking t-shirts, training shorts/leggings
• Layers: Track jacket, training vest
• Fabric: Polyester blend, spandex, technical fabrics',
'• Performance: Dark colors (hide sweat), bright accents
• Functional: Black, grey, navy with neon highlights
• Breathable technical fabrics',
'• Training shoes, sweat-wicking headband, gym gloves, water bottle, small towel, fitness tracker',
'✅ DO: Proper training shoes, moisture-wicking fabrics, supportive fit
❌ DON''T: Cotton (holds sweat), jeans, fashion over function'),

('Activewear', 'Yoga Session', 'Global', 'Stretchable, breathable, form-fitting comfort wear', 'Unisex',
'• Yoga: Fitted leggings, yoga pants, supportive top
• Layers: Light jacket for warm-up/cool-down
• Fabric: Spandex blend, bamboo fabric, stretchy cotton',
'• Calm: Soft pastels, neutrals, earth tones
• Practice: Black, grey, navy, white
• Soothing colors',
'• Yoga mat, water bottle, towel, headband, minimal jewelry, bare feet or yoga socks',
'✅ DO: Stretchable fabrics, comfortable fit, breathable
❌ DON''T: Loose clothing, jeans, heavy fabrics, jewelry that dangles'),

('Travel', 'Airport Travel', 'Global', 'Comfort first, co-ord sets and slip-on shoes', 'Unisex',
'• Comfortable: Co-ord sets, loose pants, soft t-shirts
• Layers: Light jacket, cardigan
• Fabric: Cotton blend, jersey, comfortable fabrics',
'• Travel: Neutrals - black, grey, navy, beige
• Comfortable: Soft earth tones
• Practical colors',
'• Slip-on shoes, travel neck pillow, backpack, headphones, eye mask, reusable water bottle',
'✅ DO: Comfort priority, slip-on shoes, layers
❌ DON''T: Tight clothing, complicated shoes, heavy accessories'),

('Casual', 'Sunday Brunch', 'Global', 'Relaxed daytime casual wear', 'Unisex',
'• Casual: Nice t-shirts, casual shirts, comfortable pants
• Relaxed: Polo shirts, casual button-downs
• Fabric: Cotton, linen blend',
'• Brunch: Light colors, pastels, whites, beiges
• Casual: Denim blue, soft pinks, mint
• Daytime tones',
'• Casual shoes/sneakers, sunglasses, watch, minimal accessories, light scent',
'✅ DO: Clean casual look, comfort, appropriate for public
❌ DON''T: Gym wear, sleepwear, party attire, overly formal'),

('Casual', 'Movie Night', 'Global', 'Extreme comfort, cozy casual wear', 'Unisex',
'• Comfort: Oversized tees, hoodies, soft pants, joggers
• Cozy: Comfortable jeans, casual comfortable wear
• Fabric: Cotton, fleece',
'• Comfort: Any comfortable - grey, black, navy
• Cozy: Soft neutrals, favorite colors
• No dress code',
'• Comfortable shoes, minimal accessories, jacket (theater AC), phone, wallet',
'✅ DO: Maximum comfort, layers for AC
❌ DON''T: Uncomfortable tight clothes, formal wear');

-- CULTURAL & SPECIAL
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Festival', 'Christmas Eve', 'Pan-India', 'Festive celebration, smart casuals with festive colors', 'Female',
'• Western: Party dress, elegant top with skirt
• Indo-Western: Fusion wear, kurta with palazzo
• Fabric: Velvet, silk, satin',
'• Festive: Red, green, white, gold, silver
• Traditional: Burgundy, forest green, navy
• Metallics',
'• Statement jewelry, heels or dressy flats, clutch, festive makeup, styled hair',
'✅ DO: Festive colors, elegant, family-appropriate
❌ DON''T: Too casual, all black (unless evening formal), beachwear'),

('National', 'Republic Day', 'Pan-India', 'Patriotic events, handloom  with tricolor accents', 'Female',
'• Traditional: Handloom saree, khadi kurta suit
• Modern: White kurta with tricolor dupatta
• Fabric: Khadi, handloom cotton',
'• Patriotic: Saffron, white, green (tricolor)
• Handloom: Natural cotton, khadi whites
• Simple elegant',
'• Tricolor pin/badge, minimal jewelry, comfortable flats, small bag, simple bindi',
'✅ DO: Handloom/khadi, tricolor accents, patriotic theme
❌ DON''T: Heavy glamorous, western party wear, loud jewelry'),

('National', 'Independence Day', 'Pan-India', 'Patriotic events, handloom cottons and traditional wear', 'Female',
'• Traditional: Handloom saree, khadi suit, cotton saree
• Modern: Tricolor themed outfit
• Fabric: Khadi, handloom, cotton',
'• Patriotic: Saffron, white, green (Indian flag)
• Handloom: Natural whites, cottons
• Simple traditional',
'• Tricolor accessories, minimal jewelry, comfortable footwear, small flag, patriotic badge',
'✅ DO: Khadi/handloom, patriotic colors, traditional
❌ DON''T: Western party wear, heavy embellishments'),

('Cultural', 'Hornbill Festival', 'Nagaland', 'Cultural exposition, tribal fusion and warm layers', 'Female',
'• Fusion: Traditional shawls with modern wear, warm layers
• Cultural: Tribal-inspired accessories
• Fabric: Wool, warm cotton, traditional weaves',
'• Tribal: Earth tones, reds, blacks, traditional patterns
• Warm: Browns, greens, natural dyes
• Cultural richness',
'• Traditional shawls, tribal jewelry, warm boots, ethnic bags, layered accessories',
'✅ DO: Respect tribal culture, warm layers, fusion style
❌ DON''T: Inappropriate tribal costumes, revealing wear'),

('Cultural', 'Mysore Dasara', 'Karnataka', 'Grand royal celebration, heavy traditional silks', 'Female',
'• Traditional: Mysore silk saree, heavy Kanchipuram
• Royal: Traditional lehenga, silk pavada
• Fabric: Pure silk, royal weaves',
'• Royal: Deep reds, golds, greens, royal blue
• Traditional: Rich silk colors, zari work
• Grand festival tones',
'• Heavy temple jewelry, jasmine gajra, gold bangles, traditional bindi, silk bag',
'✅ DO: Heavy silk, temple jewelry, traditional royal look
❌ DON''T: Casual wear, synthetic fabrics, minimal accessories');

-- More Male occasions
INSERT INTO occasions (occasion_type, occasion_name, region, description, gender, outfit_suggestions, color_palette, accessories, dos_and_donts) VALUES
('Pre-Wedding', 'Roka Ceremony', 'Pan-India', 'Intimate gathering, smart ethnic wear', 'Male',
'• Traditional: Kurta-pajama, pathani suit
• Modern: Designer kurta with trousers
• Fabric: Silk blend, cotton silk',
'• Soft: Pastels, cream, light gold, mint
• Elegant: Powder blue, rose
• Subtle tones',
'• Mojaris, pocket square, watch, minimal jewelry',
'✅ DO: Smart ethnic, clean pressed, family gathering appropriate
❌ DON''T: Too casual jeans, shorts, overly formal'),

('Pre-Wedding', 'Haldi Ceremony', 'Pan-India', 'Messy function, yellow or white cotton kurtas', 'Male',
'• Casual: Yellow/white kurta-pajama, casual kurta
• Modern: Yellow kurta with white churidar
• Fabric: Cotton (easy wash)',
'• Haldi: Yellow, white, cream
• Bright: Marigold, turmeric tones
• Washable',
'• Minimal jewelry (will get messy), comfortable mojaris, avoid expensive items',
'✅ DO: Comfortable, yellow/white, old accessories
❌ DON''T: Expensive kurtas, heavy jewelry'),

('Pre-Wedding', 'Sangeet Night', 'Pan-India', 'Dance night, stylish Indo-western or traditional with modern twist', 'Male',
'• Modern: Indo-western suit, designer kurta with jacket
• Festive: Embroidered kurta with churidar
• Fabric: Silk blend, velvet',
'• Vibrant: Royal blue, maroon, emerald, black
• Festive: Gold accents, rich colors
• Party wear',
'• Statement watch, mojaris, pocket square, styled hair, minimal cologne',
'✅ DO: Stylish, comfortable for dancing, coordinated look
❌ DON''T: Too heavy to dance, uncomfortable shoes'),

('Wedding', 'Wedding Reception', 'Pan-India', 'Grand evening, tuxedos or heavy sherwanis', 'Male',
'• Formal: Tuxedo, three-piece suit, heavy sherwani
• Traditional: Achkan, Indo-western bandh gala
• Fabric: Velvet, silk, wool blend',
'• Formal: Black, navy, maroon, wine, charcoal
• Traditional: Royal colors with embroidery
• Elegant',
'• Formal shoes, bow tie/tie, pocket square, cufflinks, watch, cologne',
'✅ DO: Sharp formal look, coordinate with partner
❌ DON''T: Too casual, outdress groom, wrinkled'),

('Professional', 'Corporate Interview', 'Global', 'Strictly formal business attire', 'Male',
'• Formal: Well-fitted suit (2-piece or 3-piece)
• Conservative: Dress shirt with trousers, tie
• Fabric: Wool blend, cotton',
'• Conservative: Navy, charcoal grey, black
• Shirts: White, light blue
• Professional',
'• Leather formal shoes (oxford), matching belt, tie, professional watch, briefcase',
'✅ DO: Iron well, polish shoes, groom facial hair, firm handshake
❌ DON''T: Sneakers, loud colors, skip tie, wrinkled clothes'),

('Professional', 'Daily Office Wear', 'Global', 'Standard business attire', 'Male',
'• Business: Dress shirt with trousers, blazer optional
• Smart casual: Formal shirt with chinos
• Fabric: Cotton, linen blend',
'• Professional: Navy, grey, white, light blue
• Safe: Earth tones, muted colors
• Business appropriate',
'• Formal shoes, leather belt, watch, laptop bag, minimal cologne',
'✅ DO: Clean pressed clothes, polished shoes, professional appearance
❌ DON''T: Jeans, t-shirts, sneakers (unless casual Friday), wrinkled'),

('Smart Casual', 'Tech Conference', 'Global', 'Clean casual with blazer', 'Male',
'• Modern: Blazer with jeans, polo with chinos
• Casual: Nice t-shirt with blazer
• Fabric: Cotton, denim, linen',
'• Tech: Navy, grey, black, white
• Casual: Comfortable neutrals
• Minimalist',
'• Comfortable shoes or clean sneakers, watch, small tech bag, minimal accessories',
'✅ DO: Smart but approachable, comfortable, clean look
❌ DON''T: Full formal suit, gym wear, party attire, wrinkled'),

('Smart Casual', 'Casual Friday', 'Global', 'Relaxed professional', 'Male',
'• Casual: Dark jeans with polo shirt, chinos with casual shirt
• Relaxed: Smart t-shirt with blazer
• Fabric: Denim, cotton, casual blends',
'• Relaxed: Navy, grey, khaki, denim
• Casual: Earth tones, comfortable colors
• Still professional',
'• Casual shoes or clean sneakers, watch, casual belt, minimal cologne',
'✅ DO: Still professional, clean, appropriate for office
❌ DON''T: Ripped jeans, shorts, flip-flops, gym wear'),

('Party', 'Cocktail Party', 'Urban India', 'Smart casual evening wear', 'Male',
'• Smart: Blazer with chinos, dress shirt (no tie)
• Modern: Turtleneck with blazer
• Fabric: Cotton, linen, velvet blazer',
'• Versatile: Navy, black, grey, burgundy
• Bold: Emerald, sapphire, jewel tones
• Evening wear',
'• Leather loafers/brogues, statement watch, belt, pocket square, subtle cologne',
'✅ DO: Smart casual, well-groomed, confident style
❌ DON''T: Full suit with tie, sneakers, excessive cologne'),

('Casual', 'Coffee Date', 'Global', 'Casual but stylish', 'Male',
'• Casual: Nice jeans with button-down, polo shirt
• Modern: Casual shirt with chinos
• Fabric: Cotton, denim',
'• Casual: Denim blue, white, pastels, neutrals
• Comfortable: Earth tones
• Effortless',
'• Casual shoes or clean sneakers, watch, sunglasses, minimal cologne',
'✅ DO: Clean casual, confident, appropriate for public
❌ DON''T: Gym wear, overly formal suit, party wear, wrinkled'),

('Casual', 'Dinner Date', 'Global', 'Smart casual evening', 'Male',
'• Evening: Sharp blazer with dark denim, dress shirt
• Smart: Nice trousers with stylish shirt
• Fabric: Cotton, denim, wool blend',
'• Evening: Dark colors - navy, black, burgundy
• Smart: White, light blue with dark bottoms
• Date night',
'• Leather shoes or dress shoes, watch, cologne, styled hair, clean look',
'✅ DO: Smart evening look, well-groomed, subtle cologne
❌ DON''T: Too casual t-shirt, gym wear, overly formal full suit'),

('Travel', 'Beach Vacation', 'Global', 'Lightweight resort wear', 'Male',
'• Resort: Linen shirts, shorts, swim trunks
• Casual: Light t-shirts, casual shorts
• Fabric: Cotton, linen, quick-dry',
'• Beach: Light colors, tropical prints, whites
• Summer: Blues, corals, pastels
• Neutrals',
'• Sunglasses, flip-flops or sandals, sun hat, beach bag, sunscreen',
'✅ DO: Light breathable, sun protection
❌ DON''T: Heavy fabrics, formal wear, dark colors'),

('Travel', 'Hill Station Trip', 'North/South India', 'Layered winter wear', 'Male',
'• Winter: Jackets, sweaters, thermals
• Layers: Warm shirt with fleece, jeans
• Fabric: Wool, fleece, warm cotton',
'• Winter: Deep colors - brown, grey, navy, black
• Warm: Earth tones, burgundy
• Layering',
'• Warm boots, gloves, scarf, winter hat, thermal socks, sunglasses',
'✅ DO: Multiple layers, warm footwear
❌ DON''T: Light fabrics, sandals, single thin layer'),

('Travel', 'Desert Safari', 'Rajasthan/Middle East', 'Breathable sun protection', 'Male',
'• Desert: Loose cotton pants, breathable shirts
• Protection: Light long sleeves, linen
• Fabric: Cotton, linen, breathable',
'• Desert: Khaki, beige, cream, tan, sand
• Protection: Whites, light neutrals
• Earth tones',
'• Sun hat, sunglasses, comfortable boots/sandals, scarf for dust, sunscreen, small backpack',
'✅ DO: Sun protection, breathable, comfortable
❌ DON''T: Dark colors, tight fits, heavy fabrics'),

('Activewear', 'Monsoon Trekking', 'Regional', 'Waterproof gear and sturdy footwear', 'Unisex',
'• Trekking: Waterproof jacket, quick-dry pants
• Layers: Moisture-wicking base layer, fleece mid-layer
• Fabric: Gore-tex, quick-dry synthetics',
'• Functional: Dark colors that hide dirt
• Visible: Bright accents for safety
• Practical outdoors',
'• Trekking boots, waterproof backpack, rain cover, trekking poles, water bottle, first aid',
'✅ DO: Proper trekking gear, waterproof everything, sturdy boots
❌ DON''T: Cotton (stays wet), sandals, denim, insufficient protection'),

('Activewear', 'Winter Ski Trip', 'Global', 'Heavy snow gear and thermal layers', 'Unisex',
'• Skiing: Waterproof ski jacket, snow pants, thermal layers
• Protection: Base layers, mid-layers, outer shell
• Fabric: Technical waterproof, insulated',
'• Snow: Bright colors for visibility, blacks
• Safety: High-visibility colors
• Waterproof technical',
'• Ski boots, goggles, helmet, gloves, ski poles, neck warmer, hand warmers',
'✅ DO: Proper ski gear, layers, waterproof outer
❌ DON''T: Cotton layers, insufficient warmth, poor visibility colors'),

('Casual', 'Summer Picnic', 'Global', 'Light comfortable outdoor casual', 'Unisex',
'• Casual: Shorts, sundresses, light t-shirts, breathable clothes
• Comfortable: Loose fits, natural fabrics
• Fabric: Cotton, linen, breathable',
'• Summer: Light colors, pastels, whites, florals
• Outdoor: Comfortable neutrals
• Bright cheerful',
'• Sun hat, sunglasses, sunscreen, picnic blanket, comfortable sandals/sneakers',
'✅ DO: Comfortable, weather appropriate, outdoors-friendly
❌ DON''T: Dark heavy fabrics, formal wear, uncomfortable shoes'),

('Sport', 'Golf Outing', 'Global', 'Sport-specific dress code', 'Unisex',
'• Golf: Collared polo shirts, tailored shorts/pants
• Club standard: Golf-appropriate attire
• Fabric: Moisture-wicking, stretch',
'• Club: Classic colors - navy, white, pastels
• Traditional: Khaki, golf greens
• Professional sport',
'• Golf shoes, golf gloves, sun visor/cap, sunglasses, golf club bag, tees',
'✅ DO: Follow club dress code, collared shirt, golf shoes
❌ DON''T: Jeans, t-shirts, cargo shorts, sneakers (unless allowed)'),

('Cultural', 'Art Gallery Opening', 'Global', 'Avant-garde smart casual', 'Unisex',
'• Artistic: Smart monochrome, minimalist chic
• Modern: Blazer with unique pieces
• Fabric: Quality materials, interesting textures',
'• Artistic: Black, white, monochrome, bold accent
• Gallery: Sophisticated neutrals
• Cultured understated',
'• Statement piece (watch, shoes, bag), minimal jewelry, artistic flair, comfortable shoes',
'✅ DO: Artistic expression, smart casual, conversation-starting pieces
❌ DON''T: Gym wear, too casual, overly formal suit'),

('Cultural', 'Theater/Musical Show', 'Global', 'Smart evening wear', 'Unisex',
'• Evening: Smart blazer, elegant dress, coordinated outfit
• Cultured: Dress pants with nice top, semi-formal
• Fabric: Quality fabrics, polished look',
'• Theater: Dark elegant - navy, black, burgundy
• Classic: Timeless sophisticated tones
• Evening appropriate',
'• Dress shoes, elegant coat, small clutch/wallet, minimal accessories, light scent',
'✅ DO: Smart evening look, respectful of venue, comfortable shoes
❌ DON''T: Ripped jeans, shorts, flip-flops, overly casual'),

('Party', 'Music Concert (Rock/Pop)', 'Global', 'Casual edgy comfortable', 'Unisex',
'• Concert: Band t-shirts, leather jackets, denim
• Edgy: Comfortable jeans, boots, casual trendy
• Fabric: Denim, cotton, leather',
'• Concert: Black, denim, dark colors
• Edgy: Band merchandise, rock aesthetic
• Comfortable casual',
'• Comfortable boots or sneakers, small backpack/crossbody, earplugs, phone, minimal valuables',
'✅ DO: Comfortable shoes, dress for standing, layered (venue temp varies)
❌ DON''T: Expensive jewelry, uncomfortable shoes, heavy bags, formal wear'),

('Cultural', 'Music Concert (Classical)', 'Pan-India', 'Traditional elegant attire', 'Unisex',
'• Traditional: Silk saree, elegant kurta-pajama
• Elegant: Smart traditional ethnic wear
• Fabric: Silk, fine cotton, traditional weaves',
'• Classical: Rich traditional - maroon, gold, navy
• Elegant: Sophisticated silk colors
• Cultured refined',
'• Traditional footwear, elegant accessories, cultural respect, comfortable seating attire',
'✅ DO: Traditional attire, cultural respect, comfortable for long sitting
❌ DON''T: Western casuals, shorts, loud modern fashion'),

('Formal', 'Charity Gala', 'Global', 'Black-tie event, formal evening wear', 'Unisex',
'• Black-tie: Evening gowns, tuxedos, formal suits
• Elegant: Heavy designer ethnic, formal western
• Fabric: Silk, satin, velvet, formal weaves',
'• Formal: Black, navy, wine, emerald, metallics
• Elegant: Jewel tones, rich colors
• Evening glamour',
'• Formal shoes/heels, elegant accessories, statement jewelry, clutch/formal wallet, evening makeup',
'✅ DO: Follow black-tie dress code, elegant formal, polished look
❌ DON''T: Casual wear, bright daytime colors, underdressed'),

('Academic', 'Graduation Ceremony', 'Global', 'Formal attire under graduation robes', 'Unisex',
'• Formal: Suits, formal sarees, formal dresses under robes
• Smart: Business formal, traditional formal
• Fabric: Comfortable under robes',
'• Graduation: Formal colors - navy, black, white
• Photos: Look good in photos under robes
• Professional',
'• Formal shoes, minimal jewelry (under robe), cap and gown, diploma holder, comfortable underneath',
'✅ DO: Formal underneath robes, comfortable shoes (long ceremony), photo-worthy
❌ DON''T: Casual jeans/t-shirt, uncomfortable shoes, too bulky under robes'),

('Academic', 'Academic Conference', 'Global', 'Business casual professional', 'Unisex',
'• Professional: Business casual, smart separates
• Academic: Blazer with trousers/skirt, formal kurta
• Fabric: Cotton, wool blend, professional',
'• Academic: Navy, grey, white, professional tones
• Authoritative: Conservative colors
• Comfortable for full day',
'• Comfortable formal shoes, laptop bag, conference materials, name badge, business cards, watch',
'✅ DO: Professional but comfortable, authoritative appearance, practical for all-day
❌ DON''T: Too casual, party wear, uncomfortable shoes, loud fashion'),

('Professional', 'Business Dinner', 'Global', 'Smart casual refined evening', 'Unisex',
'• Evening: Blazer with dress pants/skirt, refined ethnic
• Professional: Smart separates, polished look
• Fabric: Quality materials, professional',
'• Evening: Dark tones - navy, black, burgundy
• Refined: Subtle elegance, professional
• Dinner appropriate',
'• Dress shoes, watch, minimal accessories, subtle cologne/perfume, professional wallet',
'✅ DO: Refined evening look, professional, dinner-appropriate
❌ DON''T: Too casual, overly formal suit, loud colors'),

('Spiritual', 'Temple Pilgrimage', 'Regional', 'Modest comfortable traditional wear', 'Unisex',
'• Traditional: Simple kurta-pajama, cotton saree, dhoti
• Modest: Covering attire, traditional ethnic
• Fabric: Cotton, simple traditional weaves',
'• Spiritual: Whites, creams, traditional simple colors
• Modest: Muted tones, non-flashy
• Respectful',
'• Temple-appropriate footwear (easy remove), small bag, offerings, water bottle, towel',
'✅ DO: Modest attire, easy-remove footwear, respectful, comfortable for walking
❌ DON''T: Shorts, revealing, leather (some temples), flashy jewelry'),

('Spiritual', 'Morning Temple Aarti', 'Regional', 'Pristine traditional wear', 'Unisex',
'• Traditional: Fresh white/cream kurta-pajama, simple saree
• Pristine: Very clean, modest ethnic wear
• Fabric: Cotton, simple traditional',
'• Pure: White, cream, very light colors
• Simple: No flashy colors or patterns
• Respectful traditional',
'• Simple footwear (easy remove), offerings, minimal jewelry, fresh clean look',
'✅ DO: Fresh bathed appearance, clean clothes, respectful modest
❌ DON''T: Dark colors, western casuals, flashy accessories, unwashed');

-- Verify count
SELECT 'Database updated successfully!' AS message;
SELECT COUNT(*) AS total_occasions FROM occasions;
SELECT CONCAT('Male: ', COUNT(*)) AS male_count FROM occasions WHERE gender='Male'
UNION ALL
SELECT CONCAT('Female: ', COUNT(*)) FROM occasions WHERE gender='Female'
UNION ALL
SELECT CONCAT('Unisex: ', COUNT(*)) FROM occasions WHERE gender='Unisex';
