# Signup & Login Workflow - Outfit Style Sense

## Overview
This document explains the complete signup and login workflow for the Outfit Style Sense application.

## Database Schema
**Table:** `users`
- `user_id` (Primary Key, Auto Increment)
- `user_name` (Unique, Not Null)
- `password` (Not Null)
- `gender` (VARCHAR)
- `skin_tone` (VARCHAR)
- `age` (Integer)
- `created_at` (Timestamp, Auto-generated)

---

## Signup Workflow

### Frontend (SignupPage.tsx)
**Location:** `/components/Signup/SignupPage.tsx`

**Flow:**
1. User fills in the signup form with:
   - Username (unique)
   - Password
   - Gender (Male/Female/Other)
   - Age (1-120)
   - Skin Tone (Fair/Medium/Olive/Tan/Deep)

2. On form submission:
   - Form data is validated
   - API call is made to: `POST http://localhost:8080/api/users/signup`
   - Request body format:
     ```json
     {
       "userName": "john_doe",
       "password": "securepass123",
       "gender": "Male",
       "skinTone": "Medium",
       "age": 25
     }
     ```

3. Success:
   - User data is saved to database
   - Success screen is displayed
   - User is redirected to login page

4. Error handling:
   - If username already exists → Error message displayed
   - If server is down → Connection error displayed

### Backend (Spring Boot)
**Controller:** `UserController.java`
**Service:** `UserService.java`
**Repository:** `UserRepository.java`

**Endpoint:** `POST /api/users/signup`
- Accepts User object in request body
- Saves user to database via JPA
- Returns saved User object with generated `user_id` and `created_at`

---

## Login Workflow

### Frontend (LoginPage.tsx)
**Location:** `/components/Login/LoginPage.tsx`

**Flow:**
1. User enters:
   - Username (not email!)
   - Password

2. On form submission:
   - API call is made to: `POST http://localhost:8080/api/users/login`
   - Request body format:
     ```json
     {
       "userName": "john_doe",
       "password": "securepass123"
     }
     ```

3. Success:
   - User data is retrieved from database
   - User data is stored in localStorage:
     - `localStorage.setItem('user', JSON.stringify(userData))`
     - `localStorage.setItem('isLoggedIn', 'true')`
   - User is redirected to home page

4. Error handling:
   - Invalid credentials → 401 error, message displayed
   - Server down → Connection error displayed

### Backend (Spring Boot)
**Endpoint:** `POST /api/users/login`
- Accepts username and password
- Queries database via `userRepository.findByUserName(userName)`
- Compares password (plain text comparison - can be enhanced with encryption)
- Returns User object if credentials match
- Returns 401 Unauthorized if credentials don't match

---

## Authentication State Management

### Auth Utility
**Location:** `/utils/auth.ts`

**Available Functions:**
```typescript
// Get logged-in user data
getLoggedInUser(): User | null

// Check if user is logged in
isLoggedIn(): boolean

// Logout user
logout(): void

// Get username of logged-in user
getUserName(): string | null
```

### Usage Example:
```typescript
import { getLoggedInUser, isLoggedIn, logout } from '../utils/auth';

// In any component
const user = getLoggedInUser();
if (user) {
  console.log(`Welcome ${user.userName}!`);
  console.log(`Skin Tone: ${user.skinTone}`);
  console.log(`Gender: ${user.gender}`);
}

// Check if logged in
if (isLoggedIn()) {
  // Show authenticated content
}

// Logout
logout(); // Clears localStorage
```

---

## API Endpoints Summary

### Signup
- **URL:** `http://localhost:8080/api/users/signup`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "userName": "string",
    "password": "string",
    "gender": "string",
    "skinTone": "string",
    "age": number
  }
  ```
- **Success Response:** 200 OK
  ```json
  {
    "userId": 1,
    "userName": "john_doe",
    "gender": "Male",
    "skinTone": "Medium",
    "age": 25,
    "createdAt": "2026-03-09T10:30:00"
  }
  ```

### Login
- **URL:** `http://localhost:8080/api/users/login`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "userName": "string",
    "password": "string"
  }
  ```
- **Success Response:** 200 OK
  ```json
  {
    "userId": 1,
    "userName": "john_doe",
    "gender": "Male",
    "skinTone": "Medium",
    "age": 25,
    "createdAt": "2026-03-09T10:30:00"
  }
  ```
- **Error Response:** 401 Unauthorized
  ```json
  "Invalid credentials"
  ```

---

## Testing the Workflow

### 1. Start Spring Boot Backend
```bash
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
mvn spring-boot:run
```

### 2. Start Frontend (if using Vite)
```bash
npm run dev
```

### 3. Test Signup
1. Navigate to `/signup`
2. Fill in all fields:
   - Username: `testuser123`
   - Password: `password123`
   - Gender: `Male`
   - Age: `25`
   - Skin Tone: `Medium`
3. Click "Sign Up"
4. Check database to verify user was created

### 4. Test Login
1. Navigate to `/login`
2. Enter:
   - Username: `testuser123`
   - Password: `password123`
3. Click "Sign In"
4. Verify redirect to home page
5. Check browser console for logged user data
6. Check localStorage for stored user data

---

## Security Considerations

### Current Implementation
- ⚠️ **Passwords are stored in plain text** - NOT recommended for production
- ⚠️ **No session management** - using localStorage only
- ⚠️ **CORS is open to all origins** - should be restricted in production

### Recommended Enhancements
1. **Password Encryption:**
   - Use BCrypt or similar in Spring Boot
   - Hash passwords before storing
   
2. **JWT Tokens:**
   - Implement JWT-based authentication
   - Store token instead of full user object
   
3. **Session Management:**
   - Implement server-side sessions
   - Add session timeout
   
4. **CORS Configuration:**
   - Restrict to specific frontend origin
   - Configure in application.properties

5. **Input Validation:**
   - Add stronger validation rules
   - Sanitize inputs

---

## Troubleshooting

### Issue: Signup fails with network error
- **Solution:** Ensure Spring Boot is running on port 8080
- Check: `netstat -ano | Select-String ":8080"`

### Issue: User not found after signup
- **Solution:** Check database connection
- Verify `application.properties` has correct DB credentials

### Issue: CORS error in browser
- **Solution:** Already fixed with `@CrossOrigin(origins = "*")`
- For production, specify exact origin

### Issue: Login always fails
- **Solution:** Verify username and password match exactly
- Passwords are case-sensitive
- Check database has the user record

---

## Next Steps

1. ✅ Signup form connected to backend
2. ✅ Login form connected to backend  
3. ✅ User data stored in localStorage
4. ✅ Auth utility functions created

### Recommended Additions:
- [ ] Protected routes (redirect to login if not authenticated)
- [ ] User profile page showing stored data
- [ ] Password change functionality
- [ ] Profile update functionality
- [ ] Remember me functionality
- [ ] Password strength indicator on signup
- [ ] Email verification (if email field added)

---

## Quick Reference Commands

```bash
# Start Backend
cd backend
mvn spring-boot:run

# Test API (PowerShell)
Invoke-RestMethod -Uri "http://localhost:8080/api/users/signup" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"userName":"test","password":"test123","gender":"Male","skinTone":"Fair","age":25}'

# Check if backend is running
netstat -ano | Select-String ":8080"

# Check database
mysql -u root -p
USE outfit_recommendation_db;
SELECT * FROM users;
```
