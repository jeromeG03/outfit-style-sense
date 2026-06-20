# Railway.app Deployment Guide
## Smart Indian Outfit Recommendation System

---

## 📋 Prerequisites

1. GitHub account
2. Railway.app account (sign up at https://railway.app)
3. Your code pushed to GitHub repository
4. MySQL database dump ready

---

## 🚀 Deployment Steps

### **Step 1: Create Railway Account & New Project**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Connect your GitHub account and select your repository

---

### **Step 2: Deploy MySQL Database**

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will create a MySQL instance
4. Click on the MySQL service → **"Variables"** tab
5. Note these variables (you'll need them):
   - `MYSQL_URL` (or construct from: `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`)
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

---

### **Step 3: Import Your Database**

#### Option A: Using Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to MySQL
railway connect mysql
```

Then in MySQL prompt:
```sql
SOURCE /path/to/your/database-dump.sql;
```

#### Option B: Using MySQL Workbench
1. Get connection details from Railway Variables tab
2. Create new connection in MySQL Workbench:
   - Hostname: `MYSQLHOST` value
   - Port: `MYSQLPORT` value
   - Username: `MYSQLUSER` value
   - Password: `MYSQLPASSWORD` value
3. Import your SQL dump file

---

### **Step 4: Deploy Backend (Spring Boot)**

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"** → Choose your repository
3. Set **Root Directory**: `backend`
4. Railway will auto-detect it's a Java/Maven project

#### **Configure Backend Environment Variables:**

Click on backend service → **"Variables"** tab → Add these:

```env
# Database Configuration (use values from your MySQL service)
MYSQL_URL=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
MYSQL_USER=${MYSQLUSER}
MYSQL_PASSWORD=${MYSQLPASSWORD}

# Railway auto-provides PORT - Spring Boot will use it
# No need to set PORT manually

# Optional: Set active profile
SPRING_PROFILES_ACTIVE=prod

# CORS Configuration (add your frontend URL after deploying it)
CORS_ALLOWED_ORIGINS=https://your-frontend.up.railway.app
```

**Using Railway's Service Variables (Recommended):**
Railway can reference other services. Click **"+ New Variable"** → **"Add Reference"**:
- Variable: `MYSQLHOST` → Reference: MySQL service → `MYSQLHOST`
- Variable: `MYSQLPORT` → Reference: MySQL service → `MYSQLPORT`
- Variable: `MYSQLUSER` → Reference: MySQL service → `MYSQLUSER`
- Variable: `MYSQLPASSWORD` → Reference: MySQL service → `MYSQLPASSWORD`
- Variable: `MYSQLDATABASE` → Reference: MySQL service → `MYSQLDATABASE`

#### **Backend will be available at:**
`https://your-backend-name.up.railway.app`

---

### **Step 5: Deploy Frontend (React + Vite)**

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"** → Same repository
3. Set **Root Directory**: `/` (root, not backend)

#### **Configure Frontend Environment Variables:**

Click on frontend service → **"Variables"** tab:

```env
VITE_API_URL=https://your-backend-name.up.railway.app
```

**Replace with your actual backend URL from Step 4**

#### **Frontend will be available at:**
`https://your-frontend-name.up.railway.app`

---

### **Step 6: Update Backend CORS**

Go back to Backend service → Variables → Update:
```env
CORS_ALLOWED_ORIGINS=https://your-frontend-name.up.railway.app
```

**Redeploy backend** after this change.

---

## ✅ Verification Checklist

- [ ] MySQL database is running (green status)
- [ ] Database tables imported successfully
- [ ] Backend deployed successfully (check logs for "Started OutfitApplication")
- [ ] Backend health check: `https://your-backend.up.railway.app/api/users`
- [ ] Frontend deployed successfully
- [ ] Frontend loads in browser
- [ ] Frontend can connect to backend (test login)
- [ ] All features working (Wardrobe, Trends, Occasions, etc.)

---

## 🔧 Custom Domains (Optional)

### **For Frontend:**
1. Click on frontend service → **"Settings"**
2. Under **"Domains"** → Click **"Generate Domain"**
3. Or add your custom domain

### **For Backend:**
1. Click on backend service → **"Settings"**
2. Under **"Domains"** → Click **"Generate Domain"**
3. Update frontend `VITE_API_URL` with new backend domain

---

## 📊 Monitoring

- **Logs**: Click any service → "Logs" tab to see real-time logs
- **Metrics**: Monitor CPU, Memory, Network usage
- **Deployments**: View deployment history and rollback if needed

---

## 💰 Pricing

- **Starter Plan (Free Trial)**: $5 credit, perfect for testing
- **Hobby Plan**: $5/month, suitable for personal projects
- **Pro Plan**: $20/month, for production apps

**Resources:**
- MySQL: ~0.5 GB RAM
- Backend: ~1 GB RAM  
- Frontend: ~0.1 GB RAM

Total: **~$5-10/month** for all three services

---

## 🐛 Troubleshooting

### **Backend fails to start:**
- Check logs for database connection errors
- Verify MySQL environment variables are correct
- Ensure `MYSQL_URL` format is: `jdbc:mysql://HOST:PORT/DATABASE`

### **Frontend can't connect to backend:**
- Check CORS settings in backend
- Verify `VITE_API_URL` points to correct backend URL
- Check browser console for CORS errors

### **Database connection timeout:**
- Railway MySQL might take 30-60 seconds to start
- Wait and redeploy backend service

### **Port binding error:**
- Ensure backend uses `${PORT}` environment variable
- Railway provides PORT automatically

---

## 🔄 Continuous Deployment

Railway auto-deploys on every push to your GitHub repository!

**Enable/Disable:**
Service → Settings → "Source" → Toggle "Auto Deploy"

---

## 📝 Next Steps

1. **Enable HTTPS**: Railway provides SSL automatically ✅
2. **Setup Monitoring**: Use Railway metrics
3. **Backup Database**: Use Railway's backup feature or export regularly
4. **Add Custom Domain**: For professional URL
5. **Environment Secrets**: Store sensitive data in Railway variables (never in code)

---

## 🆘 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Report bugs in your repository

---

**Your application is now live! 🎉**

Frontend: `https://your-frontend.up.railway.app`
Backend API: `https://your-backend.up.railway.app`
