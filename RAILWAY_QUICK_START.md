# Railway.app Deployment Quick Start Checklist

## ✅ Pre-Deployment Checklist

### 1. **Export Your Database**
```powershell
# Run the export script
.\export-database.ps1
```
📁 This creates: `database_export_YYYY-MM-DD_HHMMSS.sql`

---

### 2. **Update GitHub Repository** (Optional)
✅ **Already Done!** Your code is at: https://github.com/jeromeG03/outfit-style-sense

If you made local changes, push them:
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

---

## 🚂 Railway Deployment Steps

### **Step 1: Create Railway Project** (5 min)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

---

### **Step 2: Deploy MySQL Database** (3 min)
1. In project, click "+ New"
2. Select "Database" → "Add MySQL"
3. Wait for deployment (green indicator)
4. Click MySQL service → "Variables" tab
5. **Copy these values** (you'll need them):
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

---

### **Step 3: Import Database** (10 min)

**Option A: Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to MySQL
railway connect mysql

# In MySQL prompt:
source /path/to/database_export_YYYY-MM-DD_HHMMSS.sql;
exit;
```

**Option B: MySQL Workbench**
1. Open MySQL Workbench
2. Create new connection with Railway credentials
3. Data Import/Restore → Import from Self-Contained File
4. Select your `.sql` file → Start Import

---

### **Step 4: Deploy Backend** (5 min)
1. In Railway project, click "+ New"
2. Select "GitHub Repo" → Your repo
3. Railway auto-detects Java/Maven
4. Click backend service → "Settings"
5. Set **Root Directory**: `backend`
6. Go to "Variables" tab → Add these:

**Add Service References** (click "+ New Variable" → "Add Reference"):
```
MYSQL_URL = jdbc:mysql://${MySQL.MYSQLHOST}:${MySQL.MYSQLPORT}/${MySQL.MYSQLDATABASE}
MYSQL_USER = ${MySQL.MYSQLUSER}
MYSQL_PASSWORD = ${MySQL.MYSQLPASSWORD}
```

**Manual Variables:**
```
SPRING_PROFILES_ACTIVE = prod
DDL_AUTO = validate
SHOW_SQL = false
```

7. Click "Deploy"
8. Wait for deployment (check Logs tab)
9. **Copy backend URL**: `https://YOUR-BACKEND.up.railway.app`

---

### **Step 5: Deploy Frontend** (5 min)
1. In Railway project, click "+ New"
2. Select "GitHub Repo" → Same repo
3. **Root Directory**: `/` (leave empty or set to root)
4. Go to "Variables" tab → Add:

```
VITE_API_URL = https://YOUR-BACKEND.up.railway.app
```

*Replace with your actual backend URL from Step 4*

5. Click "Deploy"
6. Wait for deployment
7. **Copy frontend URL**: `https://YOUR-FRONTEND.up.railway.app`

---

### **Step 6: Update Backend CORS** (2 min)
1. Go to Backend service → "Variables"
2. Add:
```
CORS_ALLOWED_ORIGINS = https://YOUR-FRONTEND.up.railway.app
```
3. Redeploy backend (click "Deploy" or push to GitHub)

---

## 🧪 Testing Your Deployment

### **1. Backend Health Check**
Open in browser:
```
https://YOUR-BACKEND.up.railway.app/api/occasions
```
Should return JSON data ✅

### **2. Frontend Access**
Open in browser:
```
https://YOUR-FRONTEND.up.railway.app
```
Should load the app ✅

### **3. Test User Login**
- Try logging in with existing credentials
- Check browser console for errors
- Verify data loads (wardrobe, trends, etc.)

---

## 🎯 Post-Deployment

### **Generate Custom Domains**
1. Click service → "Settings" → "Domains"
2. Click "Generate Domain" for cleaner URL
3. Update CORS and API URLs if needed

### **Monitor Your App**
- **Logs**: Service → "Logs" (real-time logs)
- **Metrics**: Service → "Metrics" (CPU, RAM, Network)
- **Deployments**: View history and rollback if needed

### **Enable Webhooks** (Optional)
- Service → "Settings" → "Webhooks"
- Get notified on deployment events

---

## 📊 Expected Resource Usage

| Service  | RAM Usage | Monthly Cost (Estimate) |
|----------|-----------|-------------------------|
| MySQL    | ~500 MB   | ~$2-3                  |
| Backend  | ~1 GB     | ~$5-7                  |
| Frontend | ~100 MB   | ~$0-1                  |
| **Total**| ~1.6 GB   | **~$7-11/month**       |

💡 **Tip**: Railway offers $5 free credits to start!

---

## 🐛 Common Issues & Fixes

### **Backend fails to start**
```
❌ Problem: Database connection failed
✅ Fix: Check MySQL variables are correct
✅ Fix: Ensure MySQL service is running (green)
✅ Fix: Verify MYSQL_URL format: jdbc:mysql://HOST:PORT/DATABASE
```

### **Frontend can't reach backend**
```
❌ Problem: CORS error in browser console
✅ Fix: Update CORS_ALLOWED_ORIGINS in backend
✅ Fix: Redeploy backend after updating
✅ Fix: Check VITE_API_URL is correct in frontend
```

### **Database is empty**
```
❌ Problem: Queries return no data
✅ Fix: Import database dump (Step 3)
✅ Fix: Verify import succeeded (check MySQL logs)
✅ Fix: Connect via Railway CLI and verify tables exist
```

---

## 📚 Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Detailed Guide**: See `RAILWAY_DEPLOYMENT_GUIDE.md`

---

## ✨ You're All Set!

Your Smart Indian Outfit Recommendation System is now live on Railway!

🌐 **Frontend**: https://YOUR-FRONTEND.up.railway.app
🔧 **Backend**: https://YOUR-BACKEND.up.railway.app
💾 **Database**: Hosted on Railway MySQL

**Next Steps:**
- Share your live URL with friends/colleagues
- Monitor usage in Railway dashboard  
- Consider adding custom domain
- Setup environment-specific configurations
- Enable HTTPS (automatic on Railway)

**Need help?** Check the detailed deployment guide or Railway docs!

---

**Deployment Time**: ~30 minutes total
**Cost**: ~$7-11/month (or free with trial credits)
**Auto-Deploy**: Push to GitHub = Auto deploy! 🚀
