# Project Diagrams Documentation
## Outfit Style Sense - Smart Indian Dress Stylist

---

## 2.4 USE CASE DIAGRAM

### Overview
The Use Case Diagram illustrates the functional requirements of the Outfit Style Sense system, showing interactions between actors (User and Admin) and the various use cases organized into four main modules.

### Actors

**1. User (Primary Actor)**
- End-user who interacts with the system to manage their wardrobe and receive outfit recommendations
- Can perform all user-facing operations

**2. Admin (Secondary Actor)**
- System administrator who manages master data
- Maintains fashion trends, color psychology rules, and occasion-based styling guidelines

**3. Email System (External System)**
- Third-party service for sending password reset emails
- Triggered during forgot password and reset password workflows

**4. AI Recommendation Engine (Internal Component)**
- Intelligent system component that powers outfit matching
- Uses color theory, pattern matching, and fashion rules

### Use Case Modules

#### Module 1: Authentication
| Use Case ID | Use Case Name | Description |
|------------|---------------|-------------|
| UC1 | Login with Email | User authenticates using email and password |
| UC2 | Sign Up | New user creates an account with email, username, and password |
| UC3 | Forgot Password | User initiates password reset by providing email |
| UC4 | Reset Password | User sets new password after verifying 6-digit code |
| UC5 | Google OAuth Login | User logs in using Google account (alternative authentication) |

#### Module 2: Wardrobe Management
| Use Case ID | Use Case Name | Description |
|------------|---------------|-------------|
| UC6 | Add Wardrobe Item | User adds clothing item with details (type, color, pattern, season) |
| UC7 | View My Wardrobe | User views all stored clothing items in digital closet |
| UC8 | Delete Wardrobe Item | User removes unwanted items from wardrobe |
| UC9 | Upload Clothing Image | User uploads photo of clothing item (optional) |

#### Module 3: Outfit Recommendation Engine (Core Feature)
| Use Case ID | Use Case Name | Description |
|------------|---------------|-------------|
| UC10 | Get Outfit Suggestions | System suggests matching items for a selected clothing piece |
| UC11 | View Complete Outfits | System displays pre-generated top+bottom outfit combinations |
| UC12 | Smart Filter by Occasion | User filters outfits by occasion (casual, formal, traditional, etc.) |
| UC13 | Smart Filter by Season | User filters outfits by season (summer, winter, monsoon) |
| UC14 | View Match Score | System displays 0-100 compatibility score for outfit combinations |
| UC15 | Get Style Tips | AI provides fashion advice based on color theory and trends |

#### Module 4: Personalization Features
| Use Case ID | Use Case Name | Description |
|------------|---------------|-------------|
| UC16 | Analyze Skin Tone | User uploads photo for AI-based skin tone analysis |
| UC17 | Get Color Psychology | User learns color meanings and impact on mood |
| UC18 | Browse Occasion Styles | User explores outfit recommendations for specific events |
| UC19 | View Fashion Trends | User browses current Indian fashion trends and styles |
| UC20 | Virtual Trial Room | User visualizes outfits on virtual model (future feature) |

### Key Relationships

**Include Relationships:**
- UC3 (Forgot Password) includes interaction with Email System
- UC10, UC11, UC14, UC15 are powered by AI Recommendation Engine

**Actor Relationships:**
- User interacts with all 20 use cases
- Admin manages UC17, UC18, UC19 (master data maintenance)
- Email System is triggered by password reset workflows
- AI Engine processes outfit recommendation requests

---

## 2.5 DATA FLOW DIAGRAM

### DFD Level 0: Context Diagram

The Context Diagram provides a high-level view of the entire system showing interactions between external entities and the central system.

#### External Entities

**1. User**
- **Inputs to System:**
  - Login Credentials (email, password)
  - Wardrobe Items (clothing details)
  - Outfit Preferences (occasion, season filters)
  
- **Outputs from System:**
  - Authentication Status (success/failure)
  - Outfit Recommendations (suggestions, complete outfits)
  - Match Scores & Tips (0-100 scores, style advice)

**2. Admin**
- **Inputs to System:**
  - Fashion Trends Data (latest styles)
  - Occasion Rules (event-specific guidelines)
  - Color Psychology (color meanings)
  
- **Outputs from System:**
  - Analytics Report (usage statistics)

**3. Email Service**
- **System to Email:** Password Reset Emails
- **Email to User:** 6-Digit Verification Code

**4. Database (outfit_recommendation_db)**
- **System to Database:** CRUD Operations (Create, Read, Update, Delete)
- **Database to System:** User Data, Wardrobe Data, Recommendations

### Data Stores

| Data Store | Description | Key Data |
|-----------|-------------|----------|
| users | User account information | email, password, username, auth_provider |
| wardrobe | User's clothing items | user_id, cloth_type, color, pattern, season |
| password_reset_tokens | Temporary password reset codes | email, token, expiry_date, used |
| occasions | Event-based styling rules | occasion_name, dress_codes, formality_level |
| fashion_trends | Current fashion data | trend_name, description, popularity |
| skin_tone_rules | Skin tone analysis rules | tone_type, recommended_colors |
| color_psychology | Color meanings and moods | color, psychology, cultural_significance |

---

### DFD Level 1: Detailed Process Flow

This diagram shows the internal processes and data flows within the system.

#### Frontend Layer (React TypeScript)

**Process P1: Authentication Pages**
- Components: LoginPage, SignupPage, ForgotPasswordPage
- Input: User credentials
- Output: Authentication requests to backend
- Features: 3-step password reset modal, email validation

**Process P2: Wardrobe Management**
- Component: WardrobePage
- Input: Clothing item details
- Output: CRUD requests to WardrobeController
- Features: Add/view/delete items, image upload

**Process P3: Outfit Recommendation UI**
- Component: WardrobePage (Suggestions & Outfits tabs)
- Input: Filter preferences
- Output: Display suggestions and complete outfits
- Features: Match score badges, style tips, occasion tags, animated previews

**Process P4: Personalization Pages**
- Components: SkinTonePage, PsychologyPage, TrendsPage
- Input: User preferences, photos
- Output: Personalized recommendations
- Features: AI analysis, color guidance, trend browsing

#### Backend Layer (Spring Boot)

**Process P5: User Controller (Authentication API)**
- Endpoints: /login, /signup, /forgot-password, /verify-reset-code, /reset-password
- Input: User credentials, email for password reset
- Output: JWT tokens, authentication status
- Data Access: users table, password_reset_tokens table
- Integration: Email Service for sending verification codes

**Process P6: Wardrobe Controller (CRUD Operations)**
- Endpoints: /api/wardrobe/*, /suggestions/*, /outfits/*
- Input: Wardrobe items, suggestion requests
- Output: Item lists, outfit combinations
- Data Access: wardrobe table
- Integration: Calls OutfitCombinationService for intelligent matching

**Process P7: Outfit Combination Service (AI Matching Engine)** ⭐ Core Intelligence
- Algorithm: Color theory + pattern matching + season compatibility
- Input: User's wardrobe items, filter criteria
- Output: Outfit combinations with 0-100 match scores, style tips
- Logic:
  - **Color Matching (40 points):** Uses 16-color complementary matching rules
  - **Clothing Type (30 points):** Pairs tops with bottoms (shirt→jeans/trousers)
  - **Pattern Harmony (20 points):** Solid works with patterns
  - **Season Compatibility (10 points):** Summer items with summer season
- Data Sources: color_psychology, occasions, fashion_trends tables
- Output Format: 
  - Excellent Match (80-100 points)
  - Good Match (65-79 points)
  - Decent Match (50-64 points)

**Process P8: Email Service (Password Reset)**
- Function: sendPasswordResetEmail()
- Input: User email, 6-digit token
- Output: Email sent to user
- Mode: Console logging (development) or Gmail SMTP (production)

**Process P9: Other Controllers**
- SkinToneRuleController
- ColorPsychologyController
- OccasionController
- Endpoints for personalization features
- Data Access: skin_tone_rules, color_psychology, occasions tables

#### Data Flow Examples

**Example 1: User Gets Outfit Suggestions**
```
User clicks "Find Matching Items" on White Shirt
→ Frontend (P3) sends GET request
→ Backend WardrobeController (P6) receives request
→ P6 queries wardrobe table (D2) for user's items
→ P6 calls OutfitCombinationService (P7)
→ P7 fetches color_psychology rules (D7)
→ P7 calculates match scores (White + Blue Jeans = 100/100)
→ P7 returns suggestions with reasons and tips
→ P6 sends JSON response to frontend
→ Frontend (P3) displays suggestions with animated badges
→ User sees match scores, style tips, and compatible items
```

**Example 2: Forgot Password Flow**
```
User enters email on Login page
→ Frontend (P1) calls /forgot-password API
→ Backend UserController (P5) generates 6-digit code
→ P5 saves token to password_reset_tokens table (D3)
→ P5 calls EmailService (P8)
→ P8 sends email with verification code
→ User receives 6-digit code
→ User enters code on frontend modal
→ Frontend calls /verify-reset-code API
→ Backend validates token (checks expiry, not used)
→ User enters new password
→ Frontend calls /reset-password API
→ Backend updates users table (D1), marks token as used
→ User can now login with new password
```

---

## Technical Architecture Summary

### Technology Stack

**Frontend:**
- React 19 + TypeScript 5.8
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Vite for build tooling

**Backend:**
- Spring Boot 3.2.3
- Java 17
- Spring Data JPA
- Spring Security
- JavaMailSender (email functionality)

**Database:**
- MySQL 8.0
- 7 main tables
- JPA/Hibernate ORM

**Development Tools:**
- Maven for dependency management
- VS Code for frontend development
- IntelliJ IDEA / Eclipse for backend

### System Capabilities

✅ **Email-Based Authentication** with forgot password (6-digit code, 15-min expiry)  
✅ **Smart Outfit Recommendations** using color theory and fashion rules  
✅ **Match Scoring Algorithm** (0-100 points across 4 categories)  
✅ **Three-Tab Wardrobe Interface** (My Wardrobe | Complete Outfits | Suggestions)  
✅ **Visual Outfit Previews** with animated progress bars  
✅ **Style Tips Generation** based on AI analysis  
✅ **Occasion & Season Filtering** for smart outfit discovery  
✅ **Color-Coded Compatibility Badges** (Excellent/Good/Decent)  
✅ **Personalization Features** (skin tone, color psychology, trends)  
✅ **Responsive Design** for mobile and desktop  

---

## Database Schema Overview

```
users (id, email, username, password, auth_provider, created_at)
│
├── wardrobe (id, user_id, cloth_type, color, pattern, season, occasion, image_url)
│
├── password_reset_tokens (id, email, token, expiry_date, used, created_at)
│
occasions (id, occasion_name, formality_level, dress_codes)
│
fashion_trends (id, trend_name, description, popularity, season)
│
skin_tone_rules (id, tone_type, recommended_colors, avoid_colors)
│
color_psychology (id, color, psychology, cultural_significance, mood)
```

---

## Key Features Explained

### 1. Intelligent Outfit Matching
The system uses a sophisticated algorithm that considers:
- **16 Color Combinations** (e.g., White pairs with Blue, Black, Navy, Maroon)
- **20+ Clothing Types** (Shirts, Jeans, Kurtas, Palazzo, Sarees, etc.)
- **5 Pattern Types** (Solid, Striped, Checked, Floral, Printed)
- **4 Seasons** (Summer, Winter, Monsoon, All Season)

### 2. Match Score Calculation
```
Total Score (0-100) = 
  Color Match (40 points) + 
  Type Compatibility (30 points) + 
  Pattern Harmony (20 points) + 
  Season Match (10 points)
```

### 3. Style Tips Examples
- "White pairs well with almost any color - a versatile wardrobe staple"
- "Tuck in your shirt for a formal look, or leave it untucked for casual occasions"
- "Blue jeans are perfect for casual outings, weekend brunches, and relaxed gatherings"

### 4. User Experience Flow
1. User adds wardrobe items (White Shirt, Blue Jeans, Black Formal Pants)
2. System analyzes items and generates 11 outfit combinations
3. User clicks "Find Matching Items" on White Shirt
4. System returns 5 suggestions with 100/100 match scores
5. User views complete outfits in visual cards
6. Each outfit shows top, bottom, match score bar, style tips, and occasion tags

---

## Use This in Your Report

**For Section 2.4 (Use Case Diagram):**
1. Include the Use Case Diagram image (screenshot from above)
2. Add the "Actors" and "Use Case Modules" tables
3. Describe the 20 use cases organized into 4 modules
4. Explain key relationships between actors and use cases

**For Section 2.5 (Data Flow Diagram):**
1. Include both DFD Level 0 (Context) and Level 1 (Detailed) diagrams
2. Use the "External Entities" and "Data Stores" tables
3. Include the data flow examples (Outfit Suggestions, Forgot Password)
4. Reference the technical architecture summary

**Additional Sections You Can Add:**
- System Capabilities checklist
- Database Schema diagram
- Match Score Calculation formula
- Technology Stack breakdown

---

## Conclusion

These diagrams provide a comprehensive visual representation of the Outfit Style Sense system, demonstrating:
- Clear separation of concerns (Frontend, Backend, Database)
- Intelligent recommendation engine at the core
- User-centric design with 20 distinct use cases
- Secure authentication with email verification
- Data-driven outfit matching using AI algorithms

The system successfully combines traditional wardrobe management with modern AI-powered fashion recommendations, specifically tailored for Indian dress styles and occasions.
