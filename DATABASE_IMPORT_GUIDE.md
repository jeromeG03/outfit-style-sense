# Railway Database Import - Step by Step Guide

## 🎯 Your Current Status
✅ Database exported: `database_export_2026-06-20_111229.sql` (76.56 KB)
✅ Code pushed to GitHub
⏳ Need to: Import database to Railway MySQL

---

## 📋 Two Easy Methods to Import

### **METHOD 1: MySQL Workbench (Easiest - Recommended)**

#### **Step 1: Get Railway MySQL Connection Details**

1. Go to https://railway.app
2. Sign in with GitHub
3. Create New Project → "Deploy from GitHub repo" → Select `jeromeG03/outfit-style-sense`
4. Click **"+ New"** → **"Database"** → **"Add MySQL"**
5. Wait 30-60 seconds for MySQL to deploy (green checkmark)
6. Click on the **MySQL service** card
7. Click **"Connect"** tab → You'll see connection details
8. **COPY THESE VALUES** (click copy button next to each):
   - **Host** (e.g., `monorail.proxy.rlwy.net`)
   - **Port** (e.g., `12345`)
   - **Username** (e.g., `root`)
   - **Password** (click "Show" then copy)
   - **Database** (e.g., `railway`)

---

#### **Step 2: Connect with MySQL Workbench**

1. **Open MySQL Workbench**
2. Click **"+"** next to "MySQL Connections"
3. **Fill in the connection details**:
   - **Connection Name**: `Railway - Outfit App`
   - **Hostname**: [Paste Host from Railway]
   - **Port**: [Paste Port from Railway]
   - **Username**: [Paste Username from Railway]
   - Click **"Store in Keychain"** → Enter [Password from Railway]

4. Click **"Test Connection"**
   - Should say "Successfully made the MySQL connection"
   - If it fails, double-check the values

5. Click **"OK"** to save

---

#### **Step 3: Import Your Database**

1. **Open the connection** (double-click on it)
2. Go to menu: **Server** → **Data Import**
3. Select **"Import from Self-Contained File"**
4. Click **"..."** button and navigate to:
   ```
   C:\Users\jjerome\Downloads\outfit-style-sense---smart-indian-dress-stylist (1)\database_export_2026-06-20_111229.sql
   ```
5. Under **"Default Target Schema"**:
   - Select **"Dump Structure and Data"**
6. At the bottom right, click **"Start Import"**
7. Wait for import to complete (should take 10-30 seconds)
8. Look for **"Import completed"** message

---

#### **Step 4: Verify Import**

1. In MySQL Workbench, click **Schemas** tab (left panel)
2. Click **refresh** icon 🔄
3. You should see: `outfit_recommendation_db` database
4. Expand it → Expand **Tables**
5. You should see all your tables:
   - `users`
   - `wardrobe`
   - `occasions`
   - `fashion_trends`
   - `skin_tone_rules`
   - `color_psychology`
   - `password_reset_tokens`

✅ **Database import complete!**

---

### **METHOD 2: Railway CLI (For Advanced Users)**

#### **Step 1: Install Railway CLI**

Open PowerShell and run:
```powershell
npm install -g @railway/cli
```

If you don't have Node.js/npm:
- Download from: https://nodejs.org/
- Install and restart terminal

---

#### **Step 2: Login to Railway**

```powershell
railway login
```
- This opens browser → Click "Authorize"

---

#### **Step 3: Link to Your Project**

```powershell
railway link
```
- Select your project from the list

---

#### **Step 4: Connect to MySQL**

```powershell
railway run mysql -h ${{MYSQLHOST}} -P ${{MYSQLPORT}} -u ${{MYSQLUSER}} -p${{MYSQLPASSWORD}} ${{MYSQLDATABASE}}
```

Or simpler:
```powershell
railway connect mysql
```

---

#### **Step 5: Import Database**

Once connected to MySQL prompt, run:
```sql
source C:/Users/jjerome/Downloads/outfit-style-sense---smart-indian-dress-stylist (1)/database_export_2026-06-20_111229.sql
```

Wait for import... then:
```sql
SHOW DATABASES;
USE outfit_recommendation_db;
SHOW TABLES;
```

You should see all 7 tables!

Type `exit` to quit MySQL.

---

### **METHOD 3: Railway Dashboard SQL Editor (Quick Test)**

**Note**: This method has limitations (large files might timeout)

1. Go to Railway project → Click MySQL service
2. Click **"Data"** tab
3. Click **"Query"** button
4. Open your `database_export_2026-06-20_111229.sql` in a text editor
5. Copy small portions of SQL (do NOT copy the entire file at once)
6. Paste into Railway query editor
7. Click **"Run Query"**
8. Repeat for all sections

⚠️ **Not recommended for files larger than 10KB**

---

## 🚨 Troubleshooting

### **Cannot connect to Railway MySQL**

**Problem**: Connection timeout or refused

**Solutions**:
1. Check Railway MySQL is running (green indicator)
2. Copy connection details again (they might have changed)
3. Verify firewall isn't blocking the connection
4. Try using Railway CLI method instead

---

### **Import fails with "Access Denied"**

**Problem**: Wrong credentials

**Solutions**:
1. Re-copy password from Railway (click "Show" then copy exactly)
2. Make sure username is correct (usually `root`)
3. Check you're using the Railway MySQL credentials, not your local ones

---

### **Database name conflict**

**Problem**: Database `outfit_recommendation_db` already exists

**Solutions**:

**Option A**: Drop existing database first:
```sql
DROP DATABASE IF EXISTS outfit_recommendation_db;
```
Then re-import.

**Option B**: Your export file already has `DROP DATABASE` command, so it should auto-replace.

---

### **Large file import timeout**

**Problem**: Import takes too long or times out

**Solutions**:
1. Use MySQL Workbench instead of Railway CLI
2. Compress the import:
   ```powershell
   gzip database_export_2026-06-20_111229.sql
   ```
3. Import in smaller chunks

---

## ✅ After Successful Import

Once import is complete, proceed to deploy your backend:

1. **In Railway project**, click **"+ New"**
2. Select **"GitHub Repo"** → Your repo
3. Set **Root Directory**: `backend`
4. Add environment variables (linking to MySQL service)
5. Deploy!

See `RAILWAY_QUICK_START.md` for full deployment guide.

---

## 💡 Quick Verification SQL Queries

After import, run these in MySQL Workbench to verify:

```sql
-- Check database exists
SHOW DATABASES LIKE 'outfit%';

-- Use the database
USE outfit_recommendation_db;

-- Check all tables exist
SHOW TABLES;

-- Count records in key tables
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as wardrobe_count FROM wardrobe;
SELECT COUNT(*) as occasions_count FROM occasions;
SELECT COUNT(*) as trends_count FROM fashion_trends;

-- Check one user record
SELECT * FROM users LIMIT 1;
```

Expected results:
- 7 tables total
- Some data in each table
- No errors

---

## 🆘 Still Stuck?

**Option 1**: Skip database import temporarily
- Deploy backend with empty database
- Railway MySQL will create tables automatically (via Hibernate)
- You can add data manually later

**Option 2**: Contact me with specific error message
- What step failed?
- What error message did you see?
- Screenshot helps!

---

**Recommended**: Use **METHOD 1 (MySQL Workbench)** - it's the most reliable and visual! 👍
