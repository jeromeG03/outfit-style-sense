# 👗 Smart Outfit Combination System - User Guide

## Overview
The Digital Closet now includes an intelligent outfit combination system that automatically suggests matching clothing items based on:
- **Color Theory** - Complementary and harmonious color matching
- **Clothing Type** - Appropriate top-bottom pairings
- **Pattern Rules** - Solid with patterns, avoiding pattern clashes
- **Season Matching** - Weather-appropriate combinations
- **Style Tips** - Fashion recommendations for each item

---

## 🎨 How It Works

### Color Matching Rules
The system uses professional color theory to match clothes:

**White** matches with: Black, Navy Blue, Blue, Gray, Red, Green, Brown, Beige, Maroon, Olive, Pink, Purple
**Black** matches with: White, Gray, Red, Pink, Blue, Yellow, Gold, Silver, Beige, Cream, Orange
**Blue** matches with: White, Black, Gray, Beige, Brown, Khaki, Navy Blue, Cream, Pink, Yellow
**Navy Blue** matches with: White, Beige, Cream, Gray, Brown, Khaki, Red, Pink, Mustard
**Red** matches with: White, Black, Navy Blue, Gray, Beige, Blue, Cream

### Clothing Type Combinations
Smart pairing of tops and bottoms:

**Shirts** → Jeans, Trousers, Chinos, Formal Pants, Shorts, Palazzo, Skirt
**Kurtas** → Churidar, Palazzo, Jeans, Leggings, Salwar, Dhoti
**T-Shirts** → Jeans, Shorts, Trousers, Joggers, Palazzo, Skirt
**Blazers** → Formal Pants, Trousers, Jeans, Skirt

### Pattern Matching
- **Solid** works with: Everything
- **Striped/Checked/Printed/Floral** work best with: Solid

---

## 🚀 API Endpoints

### 1. Get Suggestions for a Specific Item
**Endpoint:** `GET /api/wardrobe/suggestions/{itemId}/user/{userId}`

**Example:** Get suggestions for wardrobe item #5 for user #3
```
GET http://localhost:8080/api/wardrobe/suggestions/5/user/3
```

**Response:**
```json
{
  "sourceItem": {
    "wardrobeId": 5,
    "clothType": "Shirt",
    "color": "White",
    "pattern": "Solid",
    "season": "All Season"
  },
  "suggestions": [
    {
      "item": {
        "wardrobeId": 15,
        "clothType": "Jeans",
        "color": "Blue"
      },
      "matchScore": 90,
      "compatibility": "Excellent",
      "reasons": [
        "Perfect color match",
        "Suitable clothing type",
        "Pattern complements well"
      ]
    }
  ],
  "totalSuggestions": 12,
  "styleTips": [
    "White pairs well with almost any color",
    "Try navy blue or black for a classic look",
    "Tuck in for formal look, untucked for casual"
  ]
}
```

### 2. Get Complete Outfit Combinations
**Endpoint:** `GET /api/wardrobe/outfits/user/{userId}`

**Example:** Get all outfit combinations for user #3
```
GET http://localhost:8080/api/wardrobe/outfits/user/3
```

**Response:**
```json
{
  "totalOutfits": 45,
  "wardrobeItems": 25,
  "outfits": [
    {
      "top": {
        "wardrobeId": 5,
        "clothType": "Shirt",
        "color": "White"
      },
      "bottom": {
        "wardrobeId": 15,
        "clothType": "Jeans",
        "color": "Black"
      },
      "score": 90,
      "rating": "Excellent Match",
      "occasion": "Casual Daily Wear, Shopping, Movies"
    }
  ]
}
```

### 3. Get Smart Outfit Combinations with Filters
**Endpoint:** `GET /api/wardrobe/outfits/user/{userId}/smart`

**Query Parameters:**
- `occasion` - Filter by occasion (casual, formal, traditional, etc.)
- `season` - Filter by season (Summer, Winter, All Season, etc.)
- `limit` - Maximum number of outfits to return

**Examples:**

Get casual summer outfits:
```
GET http://localhost:8080/api/wardrobe/outfits/user/3/smart?occasion=casual&season=summer&limit=10
```

Get formal outfits:
```
GET http://localhost:8080/api/wardrobe/outfits/user/3/smart?occasion=formal&limit=5
```

**Response:**
```json
{
  "totalOutfits": 10,
  "filters": {
    "occasion": "casual",
    "season": "summer"
  },
  "outfits": [...]
}
```

---

## 📊 Match Scoring System

Each outfit combination gets a score out of 100:

- **Color Match (40 points)** - Complementary color combination
- **Type Match (30 points)** - Appropriate top-bottom pairing
- **Pattern Match (20 points)** - Pattern harmony
- **Season Match (10 points)** - Suitable for same season

**Ratings:**
- **80-100:** Excellent Match ⭐⭐⭐⭐⭐
- **65-79:** Good Match ⭐⭐⭐⭐
- **50-64:** Decent Match ⭐⭐⭐

---

## 🎯 Usage Examples

### Example 1: White Shirt
**Input:** White Shirt (Solid, All Season)

**Best Matches:**
- Black Jeans (90 points) - "Excellent Match"
- Navy Blue Trousers (85 points) - "Excellent Match"
- Blue Chinos (80 points) - "Excellent Match"

**Occasion:** Office, Business Meetings, Casual Outings

### Example 2: Maroon Kurta
**Input:** Maroon Kurta (Solid, Winter)

**Best Matches:**
- White Churidar (90 points) - "Excellent Match"
- Cream Palazzo (85 points) - "Excellent Match"
- Beige Dhoti (80 points) - "Excellent Match"

**Occasion:** Festivals, Traditional Events, Weddings

### Example 3: Black T-Shirt
**Input:** Black T-Shirt (Solid, Summer)

**Best Matches:**
- Blue Jeans (90 points) - "Excellent Match"
- Gray Shorts (85 points) - "Excellent Match"
- Beige Chinos (75 points) - "Good Match"

**Occasion:** Casual Outings, Weekend, Gym

---

## 🗂️ Sample Data Setup

1. Open MySQL Workbench
2. Open file: `backend/sample_wardrobe_data.sql`
3. Execute the script
4. This will add 50+ sample wardrobe items for testing

**Result:**
- User #3: Complete wardrobe with diverse items
- User #1: Basic wardrobe for testing
- Mix of male and female clothing
- Various colors, patterns, and seasons

---

## 💡 Style Tips Provided

The system provides contextual style tips:

**For White Items:**
- "White pairs well with almost any color"
- "Try navy blue or black for a classic look"

**For Shirts:**
- "Tuck in for formal look, untucked for casual"
- "Roll up sleeves for a relaxed vibe"

**For Kurtas:**
- "Pair with traditional bottoms for festive occasions"
- "Try with jeans for a modern fusion look"

**For Red Items:**
- "Red makes a bold statement - pair with neutrals"
- "Best with black, white, or navy blue"

---

## 🎨 Supported Colors

White, Black, Blue, Navy Blue, Gray, Red, Green, Brown, Beige, Pink, Yellow, Purple, Orange, Maroon, Khaki, Cream

## 👔 Supported Clothing Types

**Tops:** Shirt, T-Shirt, Kurta, Kurti, Top, Blazer, Polo Shirt, Sweater, Saree Blouse, Formal Shirt

**Bottoms:** Jeans, Trousers, Formal Pants, Palazzo, Leggings, Churidar, Skirt, Shorts, Salwar, Dhoti, Chinos

**Patterns:** Solid, Striped, Checked, Printed, Floral, Polka Dot

**Seasons:** Summer, Winter, Monsoon, All Season

---

## 🔧 Integration with Frontend

To integrate with your React frontend:

```typescript
// Get suggestions for a specific item
const getSuggestions = async (itemId: number, userId: number) => {
  const response = await fetch(
    `http://localhost:8080/api/wardrobe/suggestions/${itemId}/user/${userId}`
  );
  return await response.json();
};

// Get complete outfit combinations
const getOutfits = async (userId: number) => {
  const response = await fetch(
    `http://localhost:8080/api/wardrobe/outfits/user/${userId}`
  );
  return await response.json();
};

// Get filtered outfits
const getSmartOutfits = async (
  userId: number, 
  occasion?: string, 
  season?: string,
  limit?: number
) => {
  const params = new URLSearchParams();
  if (occasion) params.append('occasion', occasion);
  if (season) params.append('season', season);
  if (limit) params.append('limit', limit.toString());
  
  const response = await fetch(
    `http://localhost:8080/api/wardrobe/outfits/user/${userId}/smart?${params}`
  );
  return await response.json();
};
```

---

## ✅ Testing Checklist

1. ✅ Run `sample_wardrobe_data.sql` in MySQL Workbench
2. ✅ Backend running on port 8080
3. ✅ Test endpoint: `/api/wardrobe/user/3` (should return wardrobe items)
4. ✅ Test endpoint: `/api/wardrobe/suggestions/5/user/3` (suggestions for item #5)
5. ✅ Test endpoint: `/api/wardrobe/outfits/user/3` (complete outfits)
6. ✅ Test endpoint: `/api/wardrobe/outfits/user/3/smart?occasion=casual&season=summer`

---

## 🎯 Next Steps

1. **Execute SQL Script** - Load sample wardrobe data
2. **Test APIs** - Verify all endpoints work correctly
3. **Update Frontend** - Integrate suggestion cards in wardrobe page
4. **Add UI Components** - Display outfit combinations beautifully
5. **User Feedback** - Allow users to save favorite combinations

---

**Powered by Color Theory & Fashion Intelligence** 🎨👔👗
