# GitHub Setup Guide

## 📋 Step-by-Step Instructions

### Step 1: Initialize Git Repository (if not already done)

Open your terminal in the project root directory and run:

```bash
git init
```

### Step 2: Check What Will Be Committed

```bash
git status
```

This shows which files will be tracked. Make sure sensitive files (like `.env`, `database.sqlite`) are not listed.

### Step 3: Add All Files

```bash
git add .
```

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Ecell BVDU Quiz Platform"
```

### Step 5: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `ecell-quiz-platform` (or your preferred name)
   - **Description**: "Ecell BVDU Navi Mumbai Quiz Portal - Interactive quiz platform for college events"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Step 6: Connect Local Repository to GitHub

GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ecell-quiz-platform.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/ecell-quiz-platform.git
```

### Step 7: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

### Step 8: Verify

Go to your GitHub repository page and verify all files are uploaded correctly.

---

## ✅ What's Included in Your Repository

Your repository includes:
- ✅ All source code (client and server)
- ✅ Configuration files (package.json, etc.)
- ✅ Documentation (README.md, DEPLOYMENT.md, etc.)
- ✅ .gitignore (excludes sensitive files)

**Excluded** (thanks to .gitignore):
- ❌ `node_modules/` (dependencies)
- ❌ `.env` files (environment variables)
- ❌ `database.sqlite` (database file)
- ❌ `server/uploads/` (uploaded images)
- ❌ Build files

---

## 🔒 Important: Before Pushing

### Check for Sensitive Information

Make sure you haven't committed:
- ❌ Real API keys or secrets
- ❌ Database passwords
- ❌ Personal information
- ❌ `.env` files with real credentials

### Environment Variables

The project uses environment variables. Make sure:
- ✅ `.env` files are in `.gitignore` ✅ (already done)
- ✅ `.env.example` files are included (shows what variables are needed)
- ✅ No real secrets are in the code

---

## 📝 Recommended Repository Settings

After creating the repository, consider:

1. **Add Topics/Tags** (in repository settings):
   - `quiz-platform`
   - `react`
   - `nodejs`
   - `express`
   - `ecell`

2. **Add Description**:
   - "Interactive quiz platform for Ecell BVDU Navi Mumbai college events"

3. **Pin Important Files**:
   - README.md
   - QUICK_DEPLOY.md

---

## 🚀 Next Steps After GitHub Upload

Once uploaded, you can:

1. **Deploy to Render** (see `QUICK_DEPLOY.md`)
2. **Deploy to Vercel + Railway** (see `QUICK_DEPLOY.md`)
3. **Share with collaborators**
4. **Set up CI/CD** (optional)

---

## 🆘 Troubleshooting

### "Repository not found" error
- Check the repository URL is correct
- Make sure you have access to the repository
- Verify your GitHub credentials

### "Permission denied" error
- If using HTTPS, you may need a Personal Access Token
- If using SSH, make sure your SSH key is added to GitHub
- Check: https://docs.github.com/en/authentication

### Large file upload issues
- `node_modules` should be in .gitignore (already done)
- If you accidentally committed large files, use `git rm --cached` to remove them

### Want to update later?
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 📚 Useful Git Commands

```bash
# Check status
git status

# See what changed
git diff

# View commit history
git log

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name
```

---

## ✨ Repository Structure

Your GitHub repository will look like:

```
ecell-quiz-platform/
├── client/              # React frontend
├── server/              # Express backend
├── .gitignore          # Git ignore rules
├── README.md           # Main documentation
├── QUICK_DEPLOY.md     # Deployment guide
├── DEPLOYMENT.md       # Detailed deployment info
├── GITHUB_SETUP.md     # This file
└── package.json        # Root package.json
```

---

**Ready to deploy?** Check out `QUICK_DEPLOY.md` for deployment instructions! 🚀

