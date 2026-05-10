# System Flow Documentation
## Outfit Style Sense - Smart Indian Dress Stylist

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Actors and Their Roles](#actors-and-their-roles)
3. [Use Cases with Detailed Flows](#use-cases-with-detailed-flows)
4. [Data Flow Scenarios](#data-flow-scenarios)
5. [System Architecture Layers](#system-architecture-layers)
6. [Database Entities and Relationships](#database-entities-and-relationships)
7. [Process Descriptions](#process-descriptions)

---

## System Overview

**System Name:** Outfit Style Sense - Smart Indian Dress Stylist

**Purpose:** An intelligent wardrobe management and outfit recommendation system that helps users build a digital closet and receive AI-powered fashion suggestions based on color theory, pattern matching, and Indian styling rules.

**Key Features:**
- Email-based authentication with secure password reset
- Digital wardrobe management (add, view, delete clothing items)
- Intelligent outfit recommendations using AI matching algorithms
- Match scoring (0-100 points) with visual feedback
- Style tips generation based on fashion rules
- Occasion and season-based filtering
- Personalization features (skin tone analysis, color psychology)

**Technology Stack:**
- Frontend: React 19 + TypeScript 5.8 + Tailwind CSS
- Backend: Spring Boot 3.2.3 + Java 17
- Database: MySQL 8.0
- External Services: Gmail SMTP for email

---

## Actors and Their Roles

### 1. User (Primary Actor)
**Role:** End-user who interacts with the system to manage wardrobe and get outfit recommendations

**Capabilities:**
- Sign up with email, username, and password
- Log in using email and password
- Reset password using email verification
- Add clothing items to digital wardrobe
- View all wardrobe items
- Delete unwanted items
- Get outfit suggestions for specific items
- View complete outfit combinations
- Filter outfits by occasion and season
- View match scores and style tips
- Analyze skin tone for color recommendations
- Browse color psychology information
- View fashion trends
- Explore occasion-based styling

**Cannot Do:**
- Modify master data (trends, occasions, psychology rules)
- Access other users' wardrobes
- Delete system data

### 2. Admin (Secondary Actor)
**Role:** System administrator who manages master data and content

**Capabilities:**
- Manage fashion trends database
- Update occasion styling rules
- Maintain color psychology information
- View analytics and usage reports
- Moderate user-generated content

**Cannot Do:**
- Access user passwords
- Modify user wardrobe items directly

### 3. Email System (External System)
**Role:** Third-party service for sending emails

**Interaction:**
- Triggered by system during password reset flow
- Sends 6-digit verification codes to users
- Operates independently from main system
- Gmail SMTP or console logging mode

### 4. AI Recommendation Engine (Internal Component)
**Role:** Intelligent component that powers outfit matching

**Capabilities:**
- Calculate match scores (0-100) based on multiple factors
- Generate outfit combinations from user's wardrobe
- Apply color theory rules
- Match patterns harmoniously
- Consider seasonal compatibility
- Generate contextual style tips

---

## Use Cases with Detailed Flows

### MODULE 1: AUTHENTICATION

---

#### UC1: Login with Email

**Primary Actor:** User  
**Preconditions:** User has registered account  
**Postconditions:** User is authenticated and redirected to home page

**Main Flow:**
1. User navigates to Login page
2. System displays email and password input fields
3. User enters email address (e.g., user@example.com)
4. User enters password
5. User clicks "Login" button
6. System validates email format
7. System sends credentials to backend API: POST /api/users/login
8. Backend queries users table in database
9. Backend verifies email exists
10. Backend compares hashed password with stored password
11. Backend generates JWT authentication token
12. Backend returns success response with token
13. Frontend stores token in localStorage
14. System redirects user to Home page
15. User sees welcome message

**Alternative Flow 1: Invalid Credentials**
- At step 10, if email doesn't exist or password is incorrect
- Backend returns error message: "Invalid email or password"
- Frontend displays error alert
- User remains on login page

**Alternative Flow 2: Empty Fields**
- At step 6, if email or password is empty
- System displays validation error
- User cannot submit form

---

#### UC2: Sign Up

**Primary Actor:** User  
**Preconditions:** User has valid email address  
**Postconditions:** New user account created in database

**Main Flow:**
1. User navigates to Signup page
2. System displays registration form with fields: email, username, password
3. User enters email address
4. User enters username
5. User enters password
6. User clicks "Sign Up" button
7. Frontend validates all fields are filled
8. Frontend validates email format
9. Frontend sends data to backend API: POST /api/users/signup
10. Backend checks if email already exists in database
11. Backend checks if username already exists in database
12. Backend hashes password using BCrypt
13. Backend creates new user record in users table
14. Backend sets auth_provider to "local"
15. Backend returns success response
16. Frontend displays success message
17. System redirects to Login page
18. User can now log in with new credentials

**Alternative Flow 1: Duplicate Email**
- At step 10, if email already exists
- Backend returns error: "Email already registered"
- Frontend displays error message
- User remains on signup page

**Alternative Flow 2: Duplicate Username**
- At step 11, if username already exists
- Backend returns error: "Username already taken"
- Frontend displays error message

---

#### UC3: Forgot Password

**Primary Actor:** User  
**Preconditions:** User has registered email  
**Postconditions:** Password reset code sent to user's email

**Main Flow:**
1. User clicks "Forgot Password?" link on Login page
2. System opens password reset modal (Step 1 of 3)
3. User enters email address
4. User clicks "Send Code" button
5. Frontend validates email format
6. Frontend sends request to backend: POST /api/users/forgot-password
7. Backend checks if email exists in users table
8. Backend generates 6-digit random code (e.g., "847362")
9. Backend calculates expiry time: current time + 15 minutes
10. Backend saves to password_reset_tokens table:
    - email: user@example.com
    - token: "847362"
    - expiry_date: "2026-04-16 10:15:00"
    - used: false
11. Backend calls EmailService
12. EmailService sends email with subject: "Password Reset Code"
13. Email contains: "Your verification code is: 847362. Valid for 15 minutes."
14. Backend returns success response
15. Frontend advances modal to Step 2
16. System displays: "Code sent to your email"
17. User checks email inbox

**Alternative Flow 1: Email Not Found**
- At step 7, if email doesn't exist
- Backend returns error: "Email not registered"
- Frontend displays error message

**Alternative Flow 2: Development Mode**
- At step 12, if email service is in console mode
- System prints code to backend console log
- Developer can see code in terminal

---

#### UC4: Reset Password

**Primary Actor:** User  
**Preconditions:** User has received 6-digit verification code  
**Postconditions:** User's password updated in database

**Main Flow:**
1. User sees Step 2 of password reset modal
2. User enters 6-digit code received via email
3. User clicks "Verify Code" button
4. Frontend sends request: POST /api/users/verify-reset-code
5. Backend queries password_reset_tokens table
6. Backend finds token matching email and code
7. Backend checks expiry_date > current time
8. Backend checks used = false
9. Backend returns success: "Code verified"
10. Frontend advances to Step 3
11. User enters new password
12. User confirms new password
13. User clicks "Reset Password" button
14. Frontend validates passwords match
15. Frontend sends request: POST /api/users/reset-password
16. Backend queries password_reset_tokens again
17. Backend validates token again (security check)
18. Backend hashes new password with BCrypt
19. Backend updates users table: password = hashed_password
20. Backend updates password_reset_tokens: used = true
21. Backend returns success
22. Frontend displays success message
23. Modal closes
24. User redirected to Login page
25. User can log in with new password

**Alternative Flow 1: Invalid Code**
- At step 6, if code doesn't match
- Backend returns error: "Invalid verification code"
- Frontend displays error
- User can retry

**Alternative Flow 2: Expired Code**
- At step 7, if current time > expiry_date
- Backend returns error: "Code has expired. Request a new one."
- User must start over from UC3

**Alternative Flow 3: Already Used Code**
- At step 8, if used = true
- Backend returns error: "Code already used"
- Prevents replay attacks

---

#### UC5: Google OAuth Login

**Primary Actor:** User  
**Preconditions:** User has Google account  
**Postconditions:** User authenticated via Google

**Main Flow:**
1. User clicks "Continue with Google" button on Login page
2. Frontend initiates Google OAuth flow
3. User redirected to Google consent screen
4. User grants permissions
5. Google returns authorization code
6. Frontend sends code to backend: POST /api/users/google-auth
7. Backend validates code with Google servers
8. Backend retrieves user profile (email, name)
9. Backend checks if email exists in users table
10. If exists: Backend retrieves user record
11. If not exists: Backend creates new user with auth_provider = "google"
12. Backend generates JWT token
13. Backend returns token to frontend
14. Frontend stores token
15. User redirected to Home page

**Alternative Flow: Google Authentication Failure**
- At step 7, if validation fails
- Backend returns error
- User redirected back to login page

---

### MODULE 2: WARDROBE MANAGEMENT

---

#### UC6: Add Wardrobe Item

**Primary Actor:** User  
**Preconditions:** User is logged in  
**Postconditions:** New clothing item added to user's wardrobe

**Main Flow:**
1. User navigates to Wardrobe page
2. User clicks "Add New Item" button
3. System displays add item form with fields:
   - Clothing Type (dropdown: Shirt, Jeans, Kurta, etc.)
   - Color (dropdown: White, Black, Blue, Red, etc.)
   - Pattern (dropdown: Solid, Striped, Checked, Floral, Printed)
   - Season (dropdown: Summer, Winter, Monsoon, All Season)
   - Occasion (dropdown: Casual, Formal, Traditional, Office, etc.)
   - Image Upload (optional)
4. User selects "Shirt" as clothing type
5. User selects "White" as color
6. User selects "Solid" as pattern
7. User selects "All Season" as season
8. User selects "Casual" as occasion
9. User optionally uploads image
10. User clicks "Add to Wardrobe" button
11. Frontend validates all required fields
12. Frontend sends request: POST /api/wardrobe/user/{userId}
13. Backend validates user authentication
14. Backend creates new wardrobe record in database:
    - user_id: 3
    - cloth_type: "Shirt"
    - color: "White"
    - pattern: "Solid"
    - season: "All Season"
    - occasion: "Casual"
    - image_url: "default.jpg" or uploaded path
15. Backend saves record to wardrobe table
16. Backend returns success with new item ID
17. Frontend refreshes wardrobe list
18. System displays success message: "Item added successfully"
19. New item appears in wardrobe grid

**Alternative Flow: Missing Required Field**
- At step 11, if any required field is empty
- Frontend displays validation error
- User cannot submit form

---

#### UC7: View My Wardrobe

**Primary Actor:** User  
**Preconditions:** User is logged in  
**Postconditions:** User sees all their clothing items

**Main Flow:**
1. User navigates to Wardrobe page
2. Frontend sends request: GET /api/wardrobe/user/{userId}
3. Backend queries wardrobe table WHERE user_id = {userId}
4. Backend retrieves all wardrobe items
5. Backend returns JSON array of items
6. Frontend receives data
7. Frontend displays items in responsive grid (2 columns on desktop, 1 on mobile)
8. Each item shows:
   - Clothing type and color (e.g., "White Shirt")
   - Pattern and season info
   - Occasion tag
   - Thumbnail image
   - "Find Matching Items" button
   - Delete icon
9. User can scroll through all items
10. User can filter by type, color, or occasion

**Alternative Flow: Empty Wardrobe**
- At step 4, if no items found
- Frontend displays empty state message
- Shows "Start building your digital wardrobe" message
- Displays add item button prominently

---

#### UC8: Delete Wardrobe Item

**Primary Actor:** User  
**Preconditions:** User has at least one item in wardrobe  
**Postconditions:** Item removed from database

**Main Flow:**
1. User viewing wardrobe items
2. User hovers over item to delete
3. Delete icon appears
4. User clicks delete icon
5. System displays confirmation dialog: "Are you sure you want to delete this item?"
6. User clicks "Confirm"
7. Frontend sends request: DELETE /api/wardrobe/{itemId}
8. Backend validates user owns this item
9. Backend deletes record from wardrobe table
10. Backend returns success
11. Frontend removes item from UI
12. System displays success message: "Item deleted"
13. Wardrobe list updates

**Alternative Flow: User Cancels**
- At step 6, user clicks "Cancel"
- Dialog closes
- No action taken

---

#### UC9: Upload Clothing Image

**Primary Actor:** User  
**Preconditions:** User is adding or editing wardrobe item  
**Postconditions:** Image stored and linked to wardrobe item

**Main Flow:**
1. User in add/edit wardrobe item form
2. User clicks "Upload Image" button
3. System opens file picker dialog
4. User selects image file (JPG, PNG)
5. Frontend validates file type and size
6. Frontend uploads image to server
7. Backend receives image file
8. Backend generates unique filename
9. Backend saves file to public/assets/images/
10. Backend returns image URL
11. Frontend displays preview
12. Image URL saved with wardrobe item

**Alternative Flow: Invalid File**
- At step 5, if file is not image or too large
- Frontend displays error: "Please upload valid image (max 5MB)"
- User must select different file

---

### MODULE 3: OUTFIT RECOMMENDATION ENGINE (CORE FEATURE)

---

#### UC10: Get Outfit Suggestions

**Primary Actor:** User  
**Preconditions:** User has multiple items in wardrobe  
**Postconditions:** User sees matching items with compatibility scores

**Main Flow:**
1. User viewing wardrobe on "My Wardrobe" tab
2. User sees "White Shirt" item card
3. User clicks "Find Matching Items" button on White Shirt
4. Frontend sends request: GET /api/wardrobe/suggestions/5/user/3
   (where 5 is itemId, 3 is userId)
5. Backend WardrobeController receives request
6. Backend fetches selected item details from database:
   - Item: White Shirt
   - Color: White
   - Type: Shirt
   - Pattern: Solid
   - Season: All Season
7. Backend fetches all other user's wardrobe items
8. Backend calls OutfitCombinationService.getSuggestionsForItem()
9. AI Service begins matching process for each item:

   **For Blue Jeans:**
   - Color Match: White + Blue → Check COLOR_COMBINATIONS map
     - White pairs with Blue? YES → 40 points
   - Type Match: Shirt + Jeans → Check CLOTH_TYPE_COMBINATIONS
     - Shirt pairs with Jeans? YES → 30 points
   - Pattern Match: Solid + Solid → Check PATTERN_COMBINATIONS
     - Solid pairs with Solid? YES → 20 points
   - Season Match: All Season + All Season → Check SEASON_COMBINATIONS
     - All Season compatible? YES → 10 points
   - **Total Score: 100/100**
   - Compatibility: "Excellent Match"
   - Reasons: ["Perfect color match", "Suitable clothing type", "Pattern complements well"]

   **For Black Formal Pants:**
   - Color Match: White + Black → 40 points (complementary)
   - Type Match: Shirt + Trousers → 30 points
   - Pattern Match: Solid + Solid → 20 points
   - Season Match: All Season + All Season → 10 points
   - **Total Score: 100/100**

   **For Red Kurta (won't match well):**
   - Color Match: White + Red → 0 points (not in complementary list)
   - Type Match: Shirt + Kurta → 0 points (both are tops)
   - Pattern Match: Solid + Solid → 20 points
   - Season Match: All Season + Summer → 10 points
   - **Total Score: 30/100 - Below threshold, not shown**

10. AI Service filters out matches below 50 points
11. AI Service sorts by match score (highest first)
12. AI Service generates style tips:
    - Analyzes color: "White pairs well with almost any color - a versatile wardrobe staple"
    - Analyzes type: "Tuck in your shirt for a formal look, or leave it untucked for casual occasions"
    - Analyzes pattern: "Solid colors are timeless and easy to mix and match"
13. Backend returns JSON response:
```json
{
  "selectedItem": {
    "id": 5,
    "clothType": "Shirt",
    "color": "White",
    "pattern": "Solid"
  },
  "suggestions": [
    {
      "item": {
        "id": 7,
        "clothType": "Jeans",
        "color": "Blue"
      },
      "matchScore": 100,
      "compatibility": "Excellent Match",
      "reasons": [
        "Perfect color match",
        "Suitable clothing type",
        "Pattern complements well"
      ]
    },
    {
      "item": {
        "id": 8,
        "clothType": "Formal Pants",
        "color": "Black"
      },
      "matchScore": 100,
      "compatibility": "Excellent Match",
      "reasons": [...]
    }
  ],
  "styleTips": [
    "White pairs well with almost any color - a versatile wardrobe staple",
    "Tuck in your shirt for a formal look, or leave it untucked for casual occasions"
  ]
}
```
14. Frontend receives response
15. Frontend switches to "Suggestions" tab automatically
16. Frontend displays suggestions in grid layout
17. Each suggestion shows:
    - Item image and description
    - Match score badge (100) in emerald green
    - Compatibility rating: "Excellent Match"
    - List of reasons with checkmarks
    - Animated entrance with stagger effect
18. Below suggestions, style tips section displays with star icons
19. User can click on any suggested item to see its full details

**Alternative Flow: No Matches Found**
- At step 10, if all items score below 50
- Backend returns empty suggestions array
- Frontend displays: "No matching items found. Add more items to your wardrobe!"

---

#### UC11: View Complete Outfits

**Primary Actor:** User  
**Preconditions:** User has both top and bottom clothing items  
**Postconditions:** User sees pre-generated outfit combinations

**Main Flow:**
1. User on Wardrobe page
2. User clicks "Complete Outfits" tab
3. Frontend sends request: GET /api/wardrobe/outfits/user/3
4. Backend WardrobeController receives request
5. Backend fetches all user's wardrobe items from database
6. Backend separates items into categories:
   - Tops: Shirts, T-Shirts, Kurtas, Blouses (items where type is top)
   - Bottoms: Jeans, Trousers, Palazzo, Churidar, Leggings (items where type is bottom)
7. Backend calls OutfitCombinationService.getCompleteOutfits()
8. AI Service generates all possible top-bottom combinations:

   **Combination 1: White Shirt + Blue Jeans**
   - Calculate match score (same logic as UC10): 100/100
   - Determine rating: "Excellent Match"
   - Detect occasion: "Casual" (both items tagged casual)
   - Style tip: "Perfect casual weekend outfit"

   **Combination 2: White Shirt + Black Formal Pants**
   - Calculate match score: 100/100
   - Rating: "Excellent Match"
   - Occasion: "Office, Business Meetings"
   - Style tip: "Professional and polished look"

   **Combination 3: Black T-Shirt + Blue Jeans**
   - Calculate match score: 100/100
   - Rating: "Excellent Match"
   - Occasion: "Casual, Party"

   [Process continues for all combinations...]

9. AI Service filters out combinations below 50 points
10. AI Service sorts by match score
11. Backend returns JSON array of outfit combinations
12. Frontend receives response
13. Frontend displays outfits as visual cards:
    - Each card shows:
      * Top item (colored box with type): "White Shirt"
      * Plus icon in center
      * Bottom item (colored box): "Blue Jeans"
      * Animated progress bar showing match score (0-100)
      * Match score number: "100"
      * Compatibility badge: "Excellent Match" in emerald green
      * Occasion tags: "Casual · Weekend · Brunch"
      * Style tip icon
14. Cards animate in with stagger effect
15. User can scroll through all combinations
16. Progress bars animate from 0 to actual score

**Alternative Flow: Insufficient Items**
- At step 6, if user has only tops OR only bottoms (not both)
- Backend returns empty array
- Frontend displays: "Add more tops and bottoms to generate outfits!"

---

#### UC12: Smart Filter by Occasion

**Primary Actor:** User  
**Preconditions:** User has outfit combinations generated  
**Postconditions:** Only outfits matching selected occasion are shown

**Main Flow:**
1. User on "Complete Outfits" tab
2. User sees filter dropdown at top
3. User clicks "Filter by Occasion"
4. Dropdown shows options: Casual, Formal, Traditional, Office, Party, Wedding, Gym
5. User selects "Casual"
6. Frontend sends request: GET /api/wardrobe/outfits/user/3/smart?occasion=casual&limit=10
7. Backend receives request with occasion parameter
8. Backend fetches all wardrobe items
9. Backend generates all combinations
10. Backend filters combinations where:
    - top.occasion = "Casual" OR bottom.occasion = "Casual"
    - OR detected overall occasion = "Casual"
11. Backend returns filtered outfits
12. Frontend updates display
13. Only casual outfits shown
14. Filter badge displays: "Filtered by: Casual"
15. User sees relevant outfits only

**Alternative Flow: Clear Filter**
- User clicks "Clear Filters"
- Frontend requests all outfits without filters
- All combinations shown again

---

#### UC13: Smart Filter by Season

**Primary Actor:** User  
**Preconditions:** User viewing outfit combinations  
**Postconditions:** Only seasonal outfits displayed

**Main Flow:**
1. User on "Complete Outfits" tab
2. User clicks "Filter by Season"
3. Dropdown shows: Summer, Winter, Monsoon, All Season
4. User selects "Summer"
5. Frontend sends request: GET /api/wardrobe/outfits/user/3/smart?season=summer&limit=10
6. Backend filters combinations where:
   - top.season = "Summer" OR top.season = "All Season"
   - AND bottom.season = "Summer" OR bottom.season = "All Season"
7. Backend returns filtered results
8. Frontend displays summer-appropriate outfits
9. Filter badge shows: "Season: Summer"

---

#### UC14: View Match Score

**Primary Actor:** User  
**Preconditions:** User viewing suggestions or outfits  
**Postconditions:** User understands compatibility level

**Main Flow:**
1. User viewing outfit combination card
2. Card displays match score prominently
3. Score shown as large number: "100"
4. Animated progress bar fills from left (0%) to score value (100%)
5. Color-coded badge indicates rating:
   - 80-100: Emerald green badge "Excellent Match"
   - 65-79: Blue badge "Good Match"
   - 50-64: Amber badge "Decent Match"
6. User can hover/tap for score breakdown tooltip:
   - Color Match: 40/40
   - Type Compatibility: 30/30
   - Pattern Harmony: 20/20
   - Season Match: 10/10
7. User understands why this is a good match

---

#### UC15: Get Style Tips

**Primary Actor:** User  
**Preconditions:** User viewing suggestions  
**Postconditions:** User receives fashion advice

**Main Flow:**
1. User on Suggestions tab after requesting matches
2. Below suggestion cards, Style Tips section displays
3. Section header: "Style Tips" with star icon
4. AI-generated tips shown as cards:
   - Each tip in separate card with background color
   - Star icon prefix
   - Tip text: "White pairs well with almost any color..."
5. Tips are contextual based on:
   - Selected item color
   - Selected item type
   - Selected item pattern
   - Matching items
6. Tips provide actionable advice:
   - "Tuck in your shirt for formal, untucked for casual"
   - "Add a belt to define your waist"
   - "Layer with a blazer for professional settings"
7. User reads tips and applies to outfit choices

---

### MODULE 4: PERSONALIZATION FEATURES

---

#### UC16: Analyze Skin Tone

**Primary Actor:** User  
**Preconditions:** User has camera or photo  
**Postconditions:** User receives color recommendations

**Main Flow:**
1. User navigates to Skin Tone page
2. User clicks "Upload Photo" or "Take Photo"
3. System accesses camera or file picker
4. User captures/selects face photo
5. Frontend uploads image to backend
6. Backend sends image to AI analysis service
7. AI detects skin tone category:
   - Fair, Medium, Olive, Brown, Dark
8. Backend queries skin_tone_rules table
9. Backend retrieves recommended colors for detected tone
10. Backend returns:
    - Detected tone: "Medium"
    - Recommended colors: ["Blue", "Green", "Purple", "White"]
    - Colors to avoid: ["Yellow", "Pale Pink"]
11. Frontend displays results with color swatches
12. User sees personalized color palette

---

#### UC17: Get Color Psychology

**Primary Actor:** User  
**Preconditions:** None  
**Postconditions:** User learns color meanings

**Main Flow:**
1. User navigates to Psychology page
2. Frontend requests: GET /api/psychology/colors
3. Backend queries color_psychology table
4. Backend returns all colors with:
   - Color name and hex value
   - Psychological meaning
   - Mood impact
   - Cultural significance
   - Suitable occasions
5. Frontend displays as colorful cards
6. User browses colors
7. Each card shows:
   - Large color swatch
   - Color name
   - Psychology: "Red - Confidence and Energy"
   - Occasions: "Festivals, Celebrations, Important Events"
8. User learns when to wear each color

---

#### UC18: Browse Occasion Styles

**Primary Actor:** User  
**Preconditions:** None  
**Postconditions:** User sees styling guidelines

**Main Flow:**
1. User navigates to Occasions page
2. Frontend requests: GET /api/occasions
3. Backend queries occasions table
4. Backend returns occasions with styling rules
5. Frontend displays occasion cards:
   - Wedding: Traditional wear, vibrant colors
   - Office: Formal, muted colors, professional
   - Party: Bold colors, trendy styles
   - Interview: Conservative, solid colors
6. User selects "Wedding"
7. System shows:
   - Recommended outfit types
   - Suitable colors
   - Pattern suggestions
   - Accessories to add
8. User gets inspiration for event

---

#### UC19: View Fashion Trends

**Primary Actor:** User  
**Preconditions:** None  
**Postconditions:** User sees current trends

**Main Flow:**
1. User navigates to Trends page
2. Frontend requests: GET /api/trends
3. Backend queries fashion_trends table
4. Backend retrieves trends sorted by popularity
5. Frontend displays trend cards:
   - Trend name
   - Description
   - Popularity rating
   - Season applicability
   - Example images
6. User browses latest Indian fashion trends
7. User gets ideas for wardrobe additions

---

#### UC20: Virtual Trial Room (Future Feature)

**Primary Actor:** User  
**Preconditions:** User has outfit combination  
**Postconditions:** User sees virtual preview

**Main Flow:**
1. User on outfit combination card
2. User clicks "Try Virtually" button
3. System opens virtual trial room
4. System generates avatar based on user's profile
5. System renders selected outfit on avatar
6. User can rotate, zoom, change poses
7. User sees realistic preview

---

## Data Flow Scenarios

### Scenario 1: Complete User Journey - First Time User

**Step-by-Step Data Flow:**

1. **User Arrives at Application**
   - Browser → Frontend (React App loads)
   - Frontend checks localStorage for authentication token
   - No token found → Redirect to Login page

2. **User Decides to Sign Up**
   - User clicks "Sign Up" link
   - Browser navigates to /signup route
   - Frontend renders SignupPage component

3. **User Submits Registration**
   ```
   USER INPUT:
   Email: john@example.com
   Username: john_doe
   Password: SecurePass123!

   DATA FLOW:
   Frontend → Validation → API Call
   POST http://localhost:8080/api/users/signup
   Body: {"email": "john@example.com", "userName": "john_doe", "password": "SecurePass123!"}
   
   Backend receives request
   → UserController.signup()
   → UserService.createUser()
   → Check email not exists: SELECT * FROM users WHERE email = 'john@example.com'
   → Check username not exists: SELECT * FROM users WHERE userName = 'john_doe'
   → Hash password with BCrypt: $2a$10$... (hashed value)
   → INSERT INTO users (email, userName, password, authProvider) 
       VALUES ('john@example.com', 'john_doe', '$2a$10$...', 'local')
   → Return success

   Response → Frontend
   → Display "Account created successfully"
   → Redirect to Login page
   ```

4. **User Logs In**
   ```
   DATA FLOW:
   POST http://localhost:8080/api/users/login
   Body: {"email": "john@example.com", "password": "SecurePass123!"}

   Backend:
   → SELECT * FROM users WHERE email = 'john@example.com'
   → User found with ID = 3
   → Compare passwords: BCrypt.matches(input, stored)
   → Match = true
   → Generate JWT token with userId=3
   → Return {"token": "eyJhbGc...", "userId": 3, "userName": "john_doe"}

   Frontend:
   → Store token in localStorage
   → Store userId in state
   → Redirect to /home
   ```

5. **User Adds First Wardrobe Item**
   ```
   DATA FLOW:
   User fills form: Type=Shirt, Color=White, Pattern=Solid, Season=All Season, Occasion=Casual
   
   POST http://localhost:8080/api/wardrobe/user/3
   Headers: Authorization: Bearer eyJhbGc...
   Body: {"clothType": "Shirt", "color": "White", "pattern": "Solid", "season": "All Season", "occasion": "Casual"}

   Backend:
   → Verify JWT token → Extract userId=3
   → INSERT INTO wardrobe (userId, clothType, color, pattern, season, occasion, imageUrl)
       VALUES (3, 'Shirt', 'White', 'Solid', 'All Season', 'Casual', 'default.jpg')
   → New record ID = 15
   → Return {"id": 15, "clothType": "Shirt", ...}

   Frontend:
   → Add item to wardrobe state
   → Display item card in grid
   ```

6. **User Adds More Items (Second Item)**
   ```
   User adds: Type=Jeans, Color=Blue, Pattern=Solid, Season=All Season, Occasion=Casual
   
   INSERT INTO wardrobe (userId, clothType, color, pattern, season, occasion, imageUrl)
   VALUES (3, 'Jeans', 'Blue', 'Solid', 'All Season', 'Casual', 'default.jpg')
   New record ID = 16
   ```

7. **User Requests Outfit Suggestions**
   ```
   User clicks "Find Matching Items" on White Shirt (ID=15)

   DATA FLOW:
   GET http://localhost:8080/api/wardrobe/suggestions/15/user/3
   
   Backend Query Flow:
   1. Fetch selected item:
      SELECT * FROM wardrobe WHERE id = 15
      Result: {id:15, clothType:'Shirt', color:'White', pattern:'Solid', season:'All Season'}
   
   2. Fetch all other user items:
      SELECT * FROM wardrobe WHERE userId = 3 AND id != 15
      Result: [{id:16, clothType:'Jeans', color:'Blue', ...}]
   
   3. For each item, calculate match:
      OutfitCombinationService.calculateCompatibility(whiteShirt, blueJeans)
      
      Color Check:
        isColorMatch('White', 'Blue')
        → Check COLOR_COMBINATIONS.get('White').contains('Blue')
        → TRUE → colorPoints = 40
      
      Type Check:
        isTypeCompatible('Shirt', 'Jeans')
        → Check CLOTH_TYPE_COMBINATIONS.get('Shirt').contains('Jeans')
        → TRUE → typePoints = 30
      
      Pattern Check:
        isPatternCompatible('Solid', 'Solid')
        → Check PATTERN_COMBINATIONS.get('Solid').contains('Solid')
        → TRUE → patternPoints = 20
      
      Season Check:
        isSeasonCompatible('All Season', 'All Season')
        → TRUE → seasonPoints = 10
      
      Total = 40 + 30 + 20 + 10 = 100
      Rating = "Excellent Match" (score >= 80)
      Reasons = ["Perfect color match", "Suitable clothing type", "Pattern complements well"]
   
   4. Generate style tips:
      getStyleTips('White', 'Shirt', 'Solid')
      → "White pairs well with almost any color - a versatile wardrobe staple"
      → "Tuck in your shirt for a formal look, or leave it untucked for casual occasions"
   
   5. Build response:
      {
        "suggestions": [{
          "item": {id:16, clothType:'Jeans', color:'Blue'},
          "matchScore": 100,
          "compatibility": "Excellent Match",
          "reasons": [...]
        }],
        "styleTips": [...]
      }

   Frontend:
   → Switch to Suggestions tab
   → Render suggestion cards with animated entrance
   → Display match score badge: 100 (emerald green)
   → Show compatibility: "Excellent Match"
   → List reasons with checkmarks
   → Display style tips with star icons
   ```

8. **User Views Complete Outfits**
   ```
   User clicks "Complete Outfits" tab

   DATA FLOW:
   GET http://localhost:8080/api/wardrobe/outfits/user/3

   Backend Query Flow:
   1. Fetch all user items:
      SELECT * FROM wardrobe WHERE userId = 3
      Result: [
        {id:15, clothType:'Shirt', color:'White', ...},
        {id:16, clothType:'Jeans', color:'Blue', ...}
      ]
   
   2. Separate into tops and bottoms:
      Tops = items where clothType IN ('Shirt', 'T-Shirt', 'Kurta', ...)
        → [White Shirt]
      Bottoms = items where clothType IN ('Jeans', 'Trousers', 'Palazzo', ...)
        → [Blue Jeans]
   
   3. Generate all combinations:
      For each top in Tops:
        For each bottom in Bottoms:
          Combination: White Shirt + Blue Jeans
          Calculate match score (same logic as step 7): 100
          Detect occasion: min(top.occasion, bottom.occasion) = 'Casual'
          Create outfit object
   
   4. Return array:
      [{
        "top": {id:15, clothType:'Shirt', color:'White'},
        "bottom": {id:16, clothType:'Jeans', color:'Blue'},
        "matchScore": 100,
        "compatibility": "Excellent Match",
        "occasion": "Casual",
        "styleTip": "Perfect weekend casual look"
      }]

   Frontend:
   → Render outfit cards
   → Show top item (white box with "White Shirt")
   → Show bottom item (blue box with "Blue Jeans")
   → Animate progress bar from 0 to 100
   → Display match score: 100
   → Show badge: "Excellent Match" (emerald)
   → Display occasion tags: "Casual · Weekend · Brunch"
   ```

---

### Scenario 2: Password Reset Flow (Detailed)

**Complete Data Journey:**

1. **User Initiates Reset**
   ```
   User clicks "Forgot Password?" on Login page
   → Modal opens (Step 1/3)
   
   User enters: email = "john@example.com"
   
   POST http://localhost:8080/api/users/forgot-password
   Body: {"email": "john@example.com"}
   ```

2. **Backend Processes Request**
   ```
   UserController.forgotPassword()
   → UserService.initiatePasswordReset("john@example.com")
   
   Query 1: Check email exists
   SELECT * FROM users WHERE email = 'john@example.com'
   → User found (id=3)
   
   Query 2: Delete any existing tokens for this email
   DELETE FROM password_reset_tokens WHERE email = 'john@example.com'
   
   Generate code:
   Random.nextInt(900000) + 100000 = 847362 (6 digits)
   
   Calculate expiry:
   LocalDateTime.now().plusMinutes(15) = "2026-04-16 10:15:00"
   
   Query 3: Save token
   INSERT INTO password_reset_tokens (email, token, expiryDate, used, createdAt)
   VALUES ('john@example.com', '847362', '2026-04-16 10:15:00', false, now())
   ```

3. **Email Service Sends Code**
   ```
   EmailService.sendPasswordResetEmail("john@example.com", "847362")
   
   IF (development mode):
     Console output:
     =====================================
     PASSWORD RESET CODE: 847362
     FOR EMAIL: john@example.com
     EXPIRES: 2026-04-16 10:15:00
     =====================================
   
   IF (production mode):
     JavaMailSender.send(
       to: "john@example.com",
       subject: "Password Reset Code",
       body: "Your verification code is: 847362. Valid for 15 minutes."
     )
   ```

4. **User Receives and Enters Code**
   ```
   Frontend advances to Step 2/3
   
   User enters: code = "847362"
   
   POST http://localhost:8080/api/users/verify-reset-code
   Body: {"email": "john@example.com", "token": "847362"}
   ```

5. **Backend Verifies Code**
   ```
   UserService.verifyResetCode("john@example.com", "847362")
   
   Query: Find token
   SELECT * FROM password_reset_tokens 
   WHERE email = 'john@example.com' 
     AND token = '847362' 
     AND used = false
   
   Token found:
   {
     id: 5,
     email: 'john@example.com',
     token: '847362',
     expiryDate: '2026-04-16 10:15:00',
     used: false,
     createdAt: '2026-04-16 10:00:00'
   }
   
   Validation checks:
   1. Token exists? YES ✓
   2. Current time (10:05) < expiry time (10:15)? YES ✓
   3. used = false? YES ✓
   
   Return: {"success": true}
   ```

6. **User Enters New Password**
   ```
   Frontend advances to Step 3/3
   
   User enters: 
     newPassword = "NewSecure456!"
     confirmPassword = "NewSecure456!"
   
   Frontend validates: passwords match ✓
   
   POST http://localhost:8080/api/users/reset-password
   Body: {
     "email": "john@example.com",
     "token": "847362",
     "newPassword": "NewSecure456!"
   }
   ```

7. **Backend Updates Password**
   ```
   UserService.resetPassword("john@example.com", "847362", "NewSecure456!")
   
   Query 1: Re-verify token (security check)
   SELECT * FROM password_reset_tokens 
   WHERE email = 'john@example.com' AND token = '847362' AND used = false
   → Valid ✓
   
   Hash new password:
   BCrypt.hashpw("NewSecure456!") = "$2a$10$xyz..."
   
   Query 2: Update user password
   UPDATE users 
   SET password = '$2a$10$xyz...' 
   WHERE email = 'john@example.com'
   → 1 row updated
   
   Query 3: Mark token as used
   UPDATE password_reset_tokens 
   SET used = true 
   WHERE email = 'john@example.com' AND token = '847362'
   → 1 row updated
   
   Return: {"success": true, "message": "Password reset successfully"}
   ```

8. **User Logs In with New Password**
   ```
   Frontend closes modal
   → Displays success message
   → User returns to login form
   
   User enters:
     email = "john@example.com"
     password = "NewSecure456!"
   
   POST http://localhost:8080/api/users/login
   
   Backend:
   → SELECT * FROM users WHERE email = 'john@example.com'
   → BCrypt.matches("NewSecure456!", stored_hash)
   → Match = true ✓
   → Generate JWT token
   → Return success
   
   User successfully logged in with new password ✓
   ```

---

## System Architecture Layers

### Layer 1: Frontend (React + TypeScript)

**Components:**
- **Authentication Pages**
  - LoginPage.tsx: Email/password input, forgot password modal
  - SignupPage.tsx: Registration form with email
  - ForgotPasswordModal: 3-step verification process

- **Wardrobe Management**
  - WardrobePage.tsx: Three-tab interface
    - My Wardrobe tab: Grid of items
    - Complete Outfits tab: Outfit combinations
    - Suggestions tab: Match results

- **Personalization Pages**
  - SkinTonePage.tsx: Photo upload and analysis
  - PsychologyPage.tsx: Color meanings
  - TrendsPage.tsx: Fashion trends
  - OccasionPage.tsx: Event styling

**State Management:**
- React useState hooks for local state
- User authentication stored in localStorage
- API calls using fetch/axios

**Routing:**
- React Router for navigation
- Protected routes (require authentication)
- Public routes (login, signup)

---

### Layer 2: Backend (Spring Boot + Java)

**Controllers:**
- **UserController**: Authentication endpoints
  - POST /api/users/login
  - POST /api/users/signup
  - POST /api/users/forgot-password
  - POST /api/users/verify-reset-code
  - POST /api/users/reset-password
  - POST /api/users/google-auth

- **WardrobeController**: Wardrobe CRUD and recommendations
  - POST /api/wardrobe/user/{userId}
  - GET /api/wardrobe/user/{userId}
  - DELETE /api/wardrobe/{itemId}
  - GET /api/wardrobe/suggestions/{itemId}/user/{userId}
  - GET /api/wardrobe/outfits/user/{userId}
  - GET /api/wardrobe/outfits/user/{userId}/smart

- **OccasionController**: Occasion management
- **ColorPsychologyController**: Color data
- **SkinToneRuleController**: Skin tone analysis
- **TrendsController**: Fashion trends

**Services:**
- **UserService**: User authentication logic
- **WardrobeService**: Wardrobe operations
- **OutfitCombinationService**: AI matching engine ⭐
- **EmailService**: Email sending

**Repositories (JPA):**
- UserRepository
- WardrobeRepository
- PasswordResetTokenRepository
- OccasionRepository
- ColorPsychologyRepository
- SkinToneRuleRepository
- FashionTrendsRepository

---

### Layer 3: Database (MySQL)

**Tables:**
```
users
├── id (PRIMARY KEY)
├── email (UNIQUE)
├── userName (UNIQUE)
├── password (hashed)
├── authProvider (local/google)
└── createdAt

wardrobe
├── id (PRIMARY KEY)
├── userId (FOREIGN KEY → users.id)
├── clothType
├── color
├── pattern
├── season
├── occasion
└── imageUrl

password_reset_tokens
├── id (PRIMARY KEY)
├── email (FOREIGN KEY → users.email)
├── token (6-digit)
├── expiryDate
├── used (boolean)
└── createdAt

occasions
├── id (PRIMARY KEY)
├── occasionName
├── formalityLevel
├── dressCodes
└── description

fashion_trends
├── id (PRIMARY KEY)
├── trendName
├── description
├── popularity
├── season
└── createdAt

skin_tone_rules
├── id (PRIMARY KEY)
├── toneType
├── recommendedColors
├── avoidColors
└── description

color_psychology
├── id (PRIMARY KEY)
├── color
├── psychology
├── culturalSignificance
├── mood
└── occasions
```

---

## Process Descriptions

### Process P7: Outfit Combination Service (CORE AI ENGINE)

**Purpose:** Calculate outfit compatibility and generate recommendations

**Algorithm Components:**

1. **Color Matching (40 points max)**
   ```
   COLOR_COMBINATIONS = {
     "White": ["Blue", "Black", "Navy", "Red", "Maroon", "Green", "Pink", "Purple", "Brown", "Grey"],
     "Black": ["White", "Red", "Pink", "Gold", "Grey", "Purple"],
     "Blue": ["White", "Beige", "Brown", "Grey", "Navy"],
     "Red": ["Black", "White", "Gold", "Cream"],
     "Navy": ["White", "Beige", "Pink", "Gold"],
     ... (16 colors total)
   }
   
   isColorMatch(color1, color2):
     if COLOR_COMBINATIONS.get(color1).contains(color2):
       return 40 points
     else:
       return 0 points
   ```

2. **Clothing Type Compatibility (30 points max)**
   ```
   CLOTH_TYPE_COMBINATIONS = {
     "Shirt": ["Jeans", "Trousers", "Chinos", "Formal Pants"],
     "T-Shirt": ["Jeans", "Shorts", "Joggers", "Trousers"],
     "Kurta": ["Churidar", "Palazzo", "Salwar", "Leggings"],
     "Blouse": ["Saree", "Lehenga", "Palazzo"],
     ... (20+ types)
   }
   
   isTypeCompatible(type1, type2):
     if CLOTH_TYPE_COMBINATIONS.get(type1).contains(type2):
       return 30 points
     else:
       return 0 points
   ```

3. **Pattern Harmony (20 points max)**
   ```
   PATTERN_COMBINATIONS = {
     "Solid": ["Solid", "Striped", "Checked", "Floral", "Printed"],  // Solid goes with everything
     "Striped": ["Solid"],  // Stripes only with solid
     "Checked": ["Solid"],
     "Floral": ["Solid"],
     "Printed": ["Solid"]
   }
   
   isPatternCompatible(pattern1, pattern2):
     if PATTERN_COMBINATIONS.get(pattern1).contains(pattern2):
       return 20 points
     else:
       return 0 points
   ```

4. **Season Compatibility (10 points max)**
   ```
   SEASON_COMBINATIONS = {
     "Summer": ["Summer", "All Season"],
     "Winter": ["Winter", "All Season"],
     "Monsoon": ["Monsoon", "All Season"],
     "All Season": ["Summer", "Winter", "Monsoon", "All Season"]
   }
   
   isSeasonCompatible(season1, season2):
     if SEASON_COMBINATIONS.get(season1).contains(season2):
       return 10 points
     else:
       return 0 points
   ```

5. **Total Score Calculation**
   ```
   calculateMatchScore(item1, item2):
     colorPoints = isColorMatch(item1.color, item2.color)
     typePoints = isTypeCompatible(item1.clothType, item2.clothType)
     patternPoints = isPatternCompatible(item1.pattern, item2.pattern)
     seasonPoints = isSeasonCompatible(item1.season, item2.season)
     
     total = colorPoints + typePoints + patternPoints + seasonPoints
     return total  // 0-100
   ```

6. **Rating Assignment**
   ```
   getRating(score):
     if score >= 80:
       return "Excellent Match"
     else if score >= 65:
       return "Good Match"
     else if score >= 50:
       return "Decent Match"
     else:
       return "Poor Match"  // Not shown to users
   ```

7. **Style Tips Generation**
   ```
   getStyleTips(color, clothType, pattern):
     tips = []
     
     // Color-based tips
     switch(color):
       case "White":
         tips.add("White pairs well with almost any color - a versatile wardrobe staple")
         break
       case "Black":
         tips.add("Black creates a slimming effect and exudes sophistication")
         break
       case "Blue":
         tips.add("Blue is calming and professional - perfect for office settings")
         break
     
     // Type-based tips
     switch(clothType):
       case "Shirt":
         tips.add("Tuck in your shirt for a formal look, or leave it untucked for casual occasions")
         break
       case "Jeans":
         tips.add("Blue jeans are perfect for casual outings, weekend brunches, and relaxed gatherings")
         break
     
     // Pattern-based tips
     switch(pattern):
       case "Solid":
         tips.add("Solid colors are timeless and easy to mix and match")
         break
       case "Striped":
         tips.add("Vertical stripes create an elongating effect")
         break
     
     return tips
   ```

---

## Database Entities and Relationships

### Entity Relationship Diagram (Text Format)

```
┌──────────────────────────────────────────┐
│              USERS                       │
├──────────────────────────────────────────┤
│ PK id (INT AUTO_INCREMENT)               │
│    email (VARCHAR UNIQUE NOT NULL)       │
│    userName (VARCHAR UNIQUE)             │
│    password (VARCHAR NOT NULL)           │
│    authProvider (VARCHAR)                │
│    createdAt (TIMESTAMP)                 │
└──────────────────────────────────────────┘
          │                    │
          │ 1                  │ 1
          │                    │
          │ n                  │ n
          ▼                    ▼
┌─────────────────────┐  ┌──────────────────────────┐
│    WARDROBE         │  │ PASSWORD_RESET_TOKENS    │
├─────────────────────┤  ├──────────────────────────┤
│ PK id               │  │ PK id                    │
│ FK userId           │──│ FK email                 │
│    clothType        │  │    token (6-digit)       │
│    color            │  │    expiryDate            │
│    pattern          │  │    used (BOOLEAN)        │
│    season           │  │    createdAt             │
│    occasion         │  └──────────────────────────┘
│    imageUrl         │
└─────────────────────┘

┌──────────────────────────┐
│       OCCASIONS          │
├──────────────────────────┤
│ PK id                    │
│    occasionName          │
│    formalityLevel        │
│    dressCodes            │
│    description           │
└──────────────────────────┘

┌──────────────────────────┐
│    FASHION_TRENDS        │
├──────────────────────────┤
│ PK id                    │
│    trendName             │
│    description           │
│    popularity            │
│    season                │
│    createdAt             │
└──────────────────────────┘

┌──────────────────────────┐
│    SKIN_TONE_RULES       │
├──────────────────────────┤
│ PK id                    │
│    toneType              │
│    recommendedColors     │
│    avoidColors           │
│    description           │
└──────────────────────────┘

┌──────────────────────────┐
│   COLOR_PSYCHOLOGY       │
├──────────────────────────┤
│ PK id                    │
│    color                 │
│    psychology            │
│    culturalSignificance  │
│    mood                  │
│    occasions             │
└──────────────────────────┘
```

### Relationships:

1. **users ↔ wardrobe**: One-to-Many
   - One user can have many wardrobe items
   - Each wardrobe item belongs to one user
   - Foreign Key: wardrobe.userId → users.id

2. **users ↔ password_reset_tokens**: One-to-Many
   - One user can have multiple reset tokens (over time)
   - Each token belongs to one user
   - Foreign Key: password_reset_tokens.email → users.email

3. **wardrobe ↔ occasions**: Many-to-One (implicit)
   - Wardrobe items reference occasion names
   - Occasions table provides master data

4. **wardrobe ↔ fashion_trends**: No direct FK (implicit association)
   - Trends inform recommendations
   - OutfitCombinationService uses trends data

---

## Summary

This document provides comprehensive flow descriptions that can be used to create:

1. **Use Case Diagrams:**
   - 20 use cases across 4 modules
   - Actor interactions clearly defined
   - Preconditions and postconditions specified

2. **Data Flow Diagrams:**
   - External entities identified
   - Process descriptions with inputs/outputs
   - Data store interactions mapped
   - Complete scenarios from user action to database

3. **System Architecture Diagrams:**
   - Three-layer architecture (Frontend, Backend, Database)
   - Component relationships
   - API endpoints documented

4. **Entity Relationship Diagrams:**
   - 7 database tables with relationships
   - Primary and foreign keys identified
   - Cardinality specified

**Key Flows to Emphasize in Diagrams:**
- Authentication with password reset (security feature)
- Outfit suggestion generation (core AI feature)
- Complete outfit combinations (user value)
- Match scoring algorithm (technical innovation)

Use this documentation as your reference guide while creating visual diagrams in tools like Draw.io, Lucidchart, or Microsoft Visio.
