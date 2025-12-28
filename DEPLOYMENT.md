# Deployment Guide

## ⚠️ Current Issues for Vercel Deployment

Your current setup has a few things that **won't work directly** on Vercel:

1. **SQLite Database**: File-based database won't work on serverless (read-only filesystem)
2. **Local File Uploads**: Images stored in `server/uploads/` won't persist
3. **Express Server**: Needs conversion to Vercel serverless functions

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) ⭐ RECOMMENDED

**Best for**: Quick deployment with minimal changes

**Steps**:
1. Deploy frontend to Vercel
2. Deploy backend to Railway or Render (supports SQLite and file uploads)
3. Update API URLs in frontend

**Pros**: 
- Minimal code changes
- SQLite works fine
- File uploads work
- Free tiers available

**Cons**: 
- Two separate deployments
- Need to manage CORS

---

### Option 2: Full Vercel Deployment (Requires Changes)

**Best for**: Single platform deployment

**Required Changes**:
1. Replace SQLite with a cloud database (PostgreSQL, MongoDB, etc.)
2. Use cloud storage for images (Cloudinary, AWS S3, etc.)
3. Convert Express routes to Vercel serverless functions

**Pros**: 
- Single platform
- Great performance
- Easy CI/CD

**Cons**: 
- Significant code changes required
- Need external services (database + storage)

---

### Option 3: Render (Full Stack) ⭐ EASIEST

**Best for**: Deploy everything with minimal changes

**Steps**:
1. Deploy both frontend and backend to Render
2. Works with SQLite (or use PostgreSQL addon)
3. File uploads work with persistent storage

**Pros**: 
- Minimal changes needed
- Free tier available
- Supports both frontend and backend

**Cons**: 
- Slower cold starts on free tier

---

## 📋 Quick Start: Option 1 (Vercel + Railway)

### Step 1: Deploy Backend to Railway

1. **Create Railway account**: https://railway.app
2. **Create new project** → "Deploy from GitHub repo"
3. **Select your repo**
4. **Configure**:
   - Root Directory: `server`
   - Start Command: `npm start`
   - Add environment variable: `PORT` = `5000`
5. **Get your Railway URL** (e.g., `https://your-app.railway.app`)

### Step 2: Update Frontend API URL

Create `client/.env.production`:
```env
REACT_APP_API_URL=https://your-app.railway.app/api
```

### Step 3: Deploy Frontend to Vercel

1. **Push to GitHub**
2. **Go to Vercel**: https://vercel.com
3. **Import project** → Select your GitHub repo
4. **Configure**:
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Add environment variable**:
   - `REACT_APP_API_URL` = `https://your-app.railway.app/api`
6. **Deploy**

### Step 4: Update CORS in Backend

In `server/index.js`, update CORS:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
  credentials: true
}));
```

---

## 📋 Quick Start: Option 3 (Render - Full Stack)

### Step 1: Prepare for Render

1. **Update `server/index.js`** to serve frontend in production:
```javascript
// Add at the end, before app.listen
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
```

2. **Update root `package.json`**:
```json
{
  "scripts": {
    "build": "cd client && npm run build",
    "start": "cd server && npm start"
  }
}
```

### Step 2: Deploy to Render

1. **Create Render account**: https://render.com
2. **New Web Service** → Connect GitHub repo
3. **Configure**:
   - Name: `ecell-quiz-platform`
   - Environment: `Node`
   - Build Command: `npm run install-all && npm run build`
   - Start Command: `npm start`
   - Root Directory: `.` (root)
4. **Add Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or Render's assigned port)
5. **Deploy**

---

## 🔧 Required Code Changes for Vercel (Option 2)

If you want full Vercel deployment, here's what needs to change:

### 1. Replace SQLite with PostgreSQL

Install dependencies:
```bash
cd server
npm install pg
```

Create `server/database-pg.js`:
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
// ... rest of database setup
```

### 2. Use Cloudinary for Image Uploads

Install:
```bash
npm install cloudinary multer-storage-cloudinary
```

Update `server/routes/quiz.js` to use Cloudinary instead of local storage.

### 3. Convert to Vercel Serverless Functions

Create `api/` directory with serverless functions for each route.

---

## ✅ Recommended Approach

**For your use case, I recommend Option 1 (Vercel + Railway)** because:
- ✅ Minimal code changes
- ✅ SQLite works perfectly
- ✅ File uploads work
- ✅ Free tiers available
- ✅ Easy to set up

Would you like me to:
1. Create the necessary configuration files for Railway deployment?
2. Update the code for Render deployment?
3. Help you convert to full Vercel with PostgreSQL and Cloudinary?

