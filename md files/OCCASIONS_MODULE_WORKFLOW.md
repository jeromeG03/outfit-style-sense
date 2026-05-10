# Global Occasions Module - Workflow Documentation

## Overview
The Global Occasions module displays Indian festivals and global celebrations with detailed descriptions, helping users choose appropriate attire for specific events.

## Database Schema
**Table:** `occasions`
- `occasion_id` (Primary Key, Auto Increment)
- `occasion_name` (VARCHAR, Not Null) - e.g., "Diwali", "Holi", "Christmas"
- `occasion_type` (VARCHAR, Not Null) - e.g., "Festival", "Wedding", "Corporate"
- `region` (VARCHAR) - e.g., "North India", "South India", "Global"
- `description` (TEXT) - Detailed styling guide and cultural context

**Current Data:** 90 occasions in database

---

## Frontend Component

### OccasionPage.tsx
**Location:** `/components/Occasion/OccasionPage.tsx`

### Workflow:

1. **Page Load:**
   - Fetches all occasions from backend API
   - Displays loading state while fetching
   - Shows error message if backend is unavailable

2. **Event Selection:**
   - User sees dropdown with all occasion names
   - User selects an event from the dropdown
   - Selected occasion ID is stored in state

3. **Display Description:**
   - Filters occasions by selected ID
   - Displays complete details:
     - Occasion name
     - Occasion type (badge)
     - Region
     - Full description with styling guide
     - Cultural context box

4. **Empty State:**
   - Shows placeholder message when no occasion is selected
   - Shows loading message during data fetch

### Key Features:
✅ Real-time data fetching from database
✅ Dropdown populated with actual occasion names
✅ Description auto-displays on selection
✅ Error handling for API failures
✅ Loading states for better UX
✅ Responsive design
✅ Cultural context information

---

## Backend API

### Controller: OccasionController.java
**Location:** `/backend/src/main/java/com/example/outfit/controller/OccasionController.java`

### Available Endpoints:

#### 1. Get All Occasions
**URL:** `GET http://localhost:8080/api/occasions`
**Description:** Fetches all occasions from database
**Response:**
```json
[
  {
    "occasionId": 1,
    "occasionName": "Diwali",
    "occasionType": "Festival",
    "region": "Pan India",
    "description": "The Festival of Lights..."
  },
  ...
]
```

#### 2. Get Occasion by ID
**URL:** `GET http://localhost:8080/api/occasions/{id}`
**Description:** Fetches a specific occasion by ID
**Example:** `GET http://localhost:8080/api/occasions/1`
**Response:**
```json
{
  "occasionId": 1,
  "occasionName": "Diwali",
  "occasionType": "Festival",
  "region": "Pan India",
  "description": "The Festival of Lights celebrates the victory of light over darkness..."
}
```

#### 3. Get Occasions by Type
**URL:** `GET http://localhost:8080/api/occasions/type/{type}`
**Description:** Filters occasions by type
**Example:** `GET http://localhost:8080/api/occasions/type/Festival`
**Response:** Array of occasions matching the type

---

## Data Flow Diagram

```
┌─────────────────┐
│   User Browser  │
│  OccasionPage   │
└────────┬────────┘
         │
         │ 1. Page loads
         │ GET /api/occasions
         │
         ▼
┌─────────────────────┐
│   Spring Boot API   │
│ OccasionController  │
└────────┬────────────┘
         │
         │ 2. Query database
         │
         ▼
┌─────────────────────┐
│   MySQL Database    │
│  occasions table    │
└────────┬────────────┘
         │
         │ 3. Return 90 occasions
         │
         ▼
┌─────────────────┐
│   Frontend      │
│ Populate dropdown│
└────────┬────────┘
         │
         │ 4. User selects event
         │
         ▼
┌─────────────────┐
│  Display Info   │
│  - Name         │
│  - Type         │
│  - Region       │
│  - Description  │
└─────────────────┘
```

---

## Interface Mapping

### Backend Entity ➔ Frontend Interface

| Database Column | Java Entity Field | TypeScript Interface | Display Name |
|----------------|-------------------|---------------------|--------------|
| occasion_id | occasionId | occasionId | ID |
| occasion_name | occasionName | occasionName | Event Name |
| occasion_type | occasionType | occasionType | Category |
| region | region | region | Region |
| description | description | description | Styling Guide |

**Important:** 
- Database uses snake_case (occasion_id)
- Java entities use camelCase (occasionId)
- TypeScript interface uses camelCase (occasionId)
- JPA @Column annotations handle the mapping

---

## Usage Example

### Frontend Implementation:

```typescript
// Fetch all occasions
useEffect(() => {
  fetch('http://localhost:8080/api/occasions')
    .then(res => res.json())
    .then(data => setOccasions(data))
    .catch(err => console.error(err));
}, []);

// Handle event selection
const handleSelect = (id: number) => {
  setSelectedOccasionId(id);
};

// Display selected occasion
const activeOccasion = occasions.find(o => o.occasionId === selectedOccasionId);
```

### Backend Query:

```java
// Get all occasions
@GetMapping
public List<Occasion> getAll() {
    return service.getAllOccasions();
}

// Get specific occasion
@GetMapping("/{id}")
public Occasion getById(@PathVariable Long id) {
    return service.getOccasionById(id);
}
```

---

## Testing Guide

### Test Backend API:

**PowerShell:**
```powershell
# Test get all occasions
Invoke-RestMethod -Uri "http://localhost:8080/api/occasions" -Method GET

# Test get specific occasion
Invoke-RestMethod -Uri "http://localhost:8080/api/occasions/1" -Method GET

# Test filter by type
Invoke-RestMethod -Uri "http://localhost:8080/api/occasions/type/Festival" -Method GET
```

**curl:**
```bash
# Get all occasions
curl http://localhost:8080/api/occasions

# Get specific occasion
curl http://localhost:8080/api/occasions/1

# Filter by type
curl http://localhost:8080/api/occasions/type/Festival
```

### Test Frontend:

1. **Start Backend:** Spring Boot should be running on port 8080
2. **Start Frontend:** Run `npm run dev`
3. **Navigate:** Go to `/occasion` page
4. **Verify:**
   - Dropdown shows all occasion names
   - Selecting an event displays its description
   - Description loads from database
   - Region and type are displayed correctly

---

## Sample Database Records

Based on your database (90 occasions), here's what the data looks like:

```json
{
  "occasionId": 1,
  "occasionName": "Diwali",
  "occasionType": "Festival",
  "region": "Pan India",
  "description": "The Festival of Lights celebrates the triumph of light over darkness. Traditional attire includes vibrant sarees, lehengas, and kurta-pajamas in rich colors like red, gold, orange, and maroon..."
}
```

---

## Error Handling

### Frontend Errors:

1. **Backend Not Running:**
   ```
   Error: "Could not load occasions. Please ensure the backend is running."
   Action: Start Spring Boot server
   ```

2. **Network Error:**
   ```
   Error: Failed to fetch
   Action: Check API URL and network connection
   ```

3. **Empty Response:**
   ```
   Display: "No occasions available"
   Action: Check database has data
   ```

### Backend Errors:

1. **Occasion Not Found:**
   ```
   HTTP 500: "Occasion not found with id: X"
   Action: Verify occasion ID exists in database
   ```

2. **Database Connection Error:**
   ```
   SQLException: Connection refused
   Action: Check MySQL is running and credentials are correct
   ```

---

## Enhancements (Future):

### Recommended Additions:
- [ ] Filter occasions by type (dropdown or tabs)
- [ ] Filter by region
- [ ] Search functionality
- [ ] Add images for each occasion
- [ ] Outfit recommendations based on occasion
- [ ] Color palette suggestions for each occasion
- [ ] Weather-appropriate styling tips
- [ ] Pagination for large datasets
- [ ] Favorite/bookmark occasions
- [ ] Share occasion details

### Advanced Features:
- [ ] Multi-language support for descriptions
- [ ] AI-powered outfit matching based on occasion
- [ ] Integration with wardrobe module
- [ ] Calendar integration for upcoming occasions
- [ ] Regional customization based on user location

---

## Troubleshooting

### Issue: Dropdown is empty
**Solution:** 
1. Check Spring Boot is running: `netstat -ano | Select-String ":8080"`
2. Test API: `curl http://localhost:8080/api/occasions`
3. Check database has data: `SELECT COUNT(*) FROM occasions;`

### Issue: Description not showing
**Solution:**
1. Verify occasion has description in database
2. Check browser console for JavaScript errors
3. Ensure occasion ID is being set correctly

### Issue: CORS error
**Solution:**
Already fixed with `@CrossOrigin(origins = "*")` in controller

### Issue: Field names don't match
**Solution:** 
Already fixed - Entity uses camelCase with @Column annotations

---

## Quick Reference

**API Base URL:** `http://localhost:8080/api/occasions`

**Endpoints:**
- `GET /api/occasions` - Get all occasions
- `GET /api/occasions/{id}` - Get specific occasion
- `GET /api/occasions/type/{type}` - Get by type

**Frontend Route:** `/occasion`

**Database:** `outfit_recommendation_db.occasions` (90 records)

**Tech Stack:**
- Backend: Spring Boot, JPA, MySQL
- Frontend: React, TypeScript, Tailwind CSS
- HTTP Client: Fetch API

---

## Success Criteria ✅

Your Global Occasions module is working correctly when:

✅ Dropdown populates with all 90 occasion names from database
✅ Selecting an event displays its full description
✅ Occasion type, name, region are shown correctly
✅ Description text is formatted and readable
✅ Cultural context box appears
✅ Error handling works for offline backend
✅ Loading states show during data fetch
✅ UI is responsive and styled correctly

**Current Status:** ✅ FULLY FUNCTIONAL

Your occasions module is now connected to the database and displaying real data!
