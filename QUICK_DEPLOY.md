# Quick Deployment Guide

## 🎯 Easiest Option: Render (Full Stack)

This is the **simplest** way to deploy everything with minimal changes.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/ecell-quiz.git
   git push -u origin main
   ```

2. **Go to Render**: https://render.com
   - Sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your repository

3. **Configure Render**:
   - **Name**: `ecell-quiz-platform`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `.` (leave empty)
   - **Build Command**: `npm run install-all && cd client && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or paid if you want)

4. **Add Environment Variables** (in Render dashboard):
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or leave Render's default)
   - `JWT_SECRET` = `your-super-secret-key-here` (generate a random string)
   - `FRONTEND_URL` = `https://your-app-name.onrender.com` (your Render URL)

5. **Deploy!**
   - Click "Create Web Service"
   - Wait for build to complete (~5-10 minutes first time)
   - Your app will be live at: `https://your-app-name.onrender.com`

### ✅ Done! Your app is live!

---

## 🚀 Alternative: Vercel (Frontend) + Railway (Backend)

### Part 1: Deploy Backend to Railway

1. **Go to Railway**: https://railway.app
   - Sign up/login
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Railway**:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
   - Add environment variables:
     - `PORT` = `5000`
     - `JWT_SECRET` = `your-secret-key`
     - `FRONTEND_URL` = `https://your-vercel-app.vercel.app` (you'll update this after Vercel deploy)

3. **Get Railway URL**: 
   - Railway will give you a URL like: `https://your-app.up.railway.app`
   - Copy this URL

### Part 2: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
   - Sign up/login
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Vercel**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Add Environment Variable**:
   - `REACT_APP_API_URL` = `https://your-app.up.railway.app/api`
   - (Use the Railway URL from step 1)

4. **Deploy!**

5. **Update Railway CORS**:
   - Go back to Railway
   - Update `FRONTEND_URL` environment variable to your Vercel URL

### ✅ Done! Your app is live!

---

## 📝 Important Notes

### For Render:
- ✅ Everything works out of the box
- ✅ SQLite database works
- ✅ File uploads work
- ⚠️ Free tier has cold starts (first request may be slow)
- ⚠️ Free tier sleeps after 15 minutes of inactivity

### For Vercel + Railway:
- ✅ Better performance
- ✅ No cold starts
- ✅ Separate scaling
- ⚠️ Need to manage two deployments
- ⚠️ Need to configure CORS properly

---

## 🔧 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
- Include `https://` in the URL
- For multiple URLs, separate with commas: `https://app1.com,https://app2.com`

### Database Issues
- SQLite file is created automatically on first run
- If database resets, check that `server/database.sqlite` is in `.gitignore` (it should be)

### Image Upload Issues
- Make sure `server/uploads/` directory exists
- Check file size limits (currently 5MB)
- For production, consider using cloud storage (Cloudinary, AWS S3)

### Build Failures
- Make sure all dependencies are in `package.json`
- Check that Node version is compatible (14+)
- Review build logs for specific errors

---

## 🎉 After Deployment

1. **Test Admin Login**:
   - Email: `EcellBVDU@ecell.com`
   - Password: `SharkTank2026`

2. **Create a Test Quiz**:
   - Login as admin
   - Create a quiz
   - Upload it
   - Test it as an audience member

3. **Share Your App**:
   - Share the URL with your team
   - Add custom domain (optional, in platform settings)

