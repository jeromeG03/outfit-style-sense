# How to Update Occasions Database

## Method 1: Using MySQL Workbench (Recommended - Easiest)

1. **Open MySQL Workbench**
2. **Connect to your database** (localhost:3306, user: root)
3. **Open** the file `backend/update_occasions.sql`
4. **Click the lightning bolt icon** (Execute) to run the script
5. **Done!** The occasions table is now updated with gender-specific data

## Method 2: Using MySQL Command Line

1. **Open Command Prompt or PowerShell**
2. **Navigate to MySQL bin folder**:
   ```
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   ```
   (Adjust path if MySQL is installed elsewhere)

3. **Run the SQL script**:
   ```
   .\mysql.exe -u root -p"ProjectMCA@123" outfit_recommendation_db < "PATH_TO_PROJECT\backend\update_occasions.sql"
   ```
   Replace `PATH_TO_PROJECT` with your actual project path

4. **Done!**

## Method 3: Copy-Paste SQL Commands

If the above methods don't work:

1. **Open MySQL Workbench** or any MySQL client
2. **Connect to** `outfit_recommendation_db`
3. **Copy all SQL commands from** `backend/update_occasions.sql`
4. **Paste and Execute** in the SQL editor
5. **Done!**

## What This Update Does

✅ Adds new columns to occasions table:
- `gender` (Male/Female/Unisex)
- `outfit_suggestions` (detailed clothing recommendations)
- `color_palette` (color schemes for each occasion)
- `accessories` (accessory suggestions)
- `dos_and_donts` (style dos and don'ts)

✅ Inserts sample data for:
- **14 occasions for Men** (Diwali, Holi, Weddings, Business, Parties, etc.)
- **14 occasions for Women** (with detailed outfit, color, and accessory recommendations)
- **2 Unisex occasions** (Christmas, New Year)

## After Running SQL

1. **Restart the backend** if it's running
2. **Refresh your browser** (Ctrl + Shift + R)
3. **Go to Occasions page**
4. **You'll see:**
   - Gender tabs (Men / Women)
   - Separate occasions for each gender
   - Rich details: outfit suggestions, color palettes, accessories, dos & don'ts

## Verification

To verify the update worked, run this in MySQL:

```sql
SELECT occasion_name, gender, occasion_type FROM occasions ORDER BY gender, occasion_type;
```

You should see around 30 occasions with gender-specific data!
