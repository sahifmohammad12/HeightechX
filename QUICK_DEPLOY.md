# Quick Deployment Guide for Judges Demo

This is a simplified step-by-step guide to deploy HeightechX for demonstration purposes.

## Prerequisites
- GitHub account (your code is already at: https://github.com/sahifmohammad12/HeightechX)
- Render account (free): https://render.com (Sign up with GitHub)
- Vercel account (free): https://vercel.com (Sign up with GitHub)

---

## Step 1: Deploy Backend on Render (5 minutes)

### 1.1 Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Sign up/Login with your GitHub account
3. Click **"New +"** button (top right)
4. Select **"Web Service"**

### 1.2 Connect Your Repository
1. Click **"Connect account"** if not connected
2. Select **"sahifmohammad12/HeightechX"** repository
3. Click **"Connect"**

### 1.3 Configure Backend Service
Fill in these settings:

- **Name**: `heightechx-backend`
- **Environment**: Select **"Node"**
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`

### 1.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**:

1. **Key**: `NODE_ENV`  
   **Value**: `production`

2. **Key**: `ALLOWED_ORIGINS`  
   **Value**: `https://heightech-x.vercel.app`  
   *(We'll update this after frontend deployment)*

3. Click **"Create Web Service"**

### 1.5 Wait for Deployment
- Wait 2-3 minutes for deployment to complete
- You'll see: **"Your service is live at https://heightechx-backend.onrender.com"**
- **Copy this URL** - you'll need it for Step 2!

---

## Step 2: Deploy Frontend on Vercel (5 minutes)

### 2.1 Go to Vercel Dashboard
1. Visit https://vercel.com
2. Sign up/Login with your GitHub account
3. Click **"Add New..."** → **"Project"**

### 2.2 Import Repository
1. Find **"sahifmohammad12/HeightechX"** in the list
2. Click **"Import"**

### 2.3 Configure Project
Vercel will auto-detect settings, but verify:

- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `dist` (should be auto-filled)
- **Install Command**: `npm install` (should be auto-filled)

### 2.4 Add Environment Variables
Click **"Environment Variables"** and add:

1. **Name**: `VITE_API_BASE_URL`  
   **Value**: `https://heightechx-backend.onrender.com`  
   *(Use the URL from Step 1.5)*

2. **Name**: `VITE_SUPABASE_URL`  
   **Value**: `your_supabase_url`  
   *(Your Supabase project URL)*

3. **Name**: `VITE_SUPABASE_ANON_KEY`  
   **Value**: `your_supabase_anon_key`  
   *(Your Supabase anon key)*

4. **Name**: `VITE_INFURA_PROJECT_ID`  
   **Value**: `your_infura_id`  
   *(Optional - leave empty if not using)*

5. **Name**: `VITE_INFURA_PROJECT_SECRET`  
   **Value**: `your_infura_secret`  
   *(Optional - leave empty if not using)*

### 2.5 Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: **`https://heightech-x.vercel.app`**
4. **Copy this URL!**

---

## Step 3: Update Backend CORS (2 minutes)

### 3.1 Go Back to Render
1. Return to https://dashboard.render.com
2. Click on your **"heightechx-backend"** service
3. Go to **"Environment"** tab

### 3.2 Update ALLOWED_ORIGINS
1. Find **`ALLOWED_ORIGINS`** variable
2. Click **"Edit"**
3. Change value to your Vercel URL: `https://heightech-x.vercel.app`
4. Click **"Save Changes"**
5. Service will automatically redeploy (wait 1-2 minutes)

---

## Step 4: Test Your Deployment (2 minutes)

### 4.1 Test Frontend
1. Open your Vercel URL: `https://heightech-x.vercel.app`
2. Check if the page loads correctly
3. Open browser Developer Tools (F12)
4. Go to **"Console"** tab - check for errors
5. Go to **"Network"** tab - verify API calls are working

### 4.2 Test Backend
1. Open: `https://heightechx-backend.onrender.com/api/health`
2. You should see: `{"status":"ok","message":"..."}`

### 4.3 Test Connection
1. In your frontend, try to make an API call
2. Check Network tab - requests to `/api/health` should succeed
3. No CORS errors should appear in console

---

## ✅ You're Done!

Your application is now live:
- **Frontend**: `https://heightech-x.vercel.app`
- **Backend**: `https://heightechx-backend.onrender.com`

---

## Quick Troubleshooting

### ❌ CORS Error?
- Make sure `ALLOWED_ORIGINS` in Render matches your exact Vercel URL
- No trailing slashes in URLs
- Wait for backend to finish redeploying after changing environment variables

### ❌ Frontend Can't Connect to Backend?
- Verify `VITE_API_BASE_URL` in Vercel matches your Render backend URL
- Check Render service is running (green status)
- Test backend directly: `https://your-backend.onrender.com/api/health`

### ❌ Build Failed?
- Check build logs in Vercel/Render dashboard
- Verify all environment variables are set correctly
- Make sure `package.json` has correct scripts

### ❌ Environment Variables Not Working?
- In Vercel, all frontend variables must start with `VITE_`
- Redeploy after adding/changing environment variables
- Clear browser cache (Ctrl+Shift+R)

---

## Pro Tips for Judges Demo

1. **Test Before Demo**: Deploy 1 day before to ensure everything works
2. **Keep URLs Handy**: Save both URLs in a note for easy access
3. **Have Backup**: Keep localhost version running as backup
4. **Show Health Check**: Open backend health endpoint to show it's working
5. **Network Tab**: Show judges the API calls working in browser DevTools

---

## Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://heightech-x.vercel.app` | User interface |
| **Backend** | `https://heightechx-backend.onrender.com` | API server |
| **Health Check** | `https://heightechx-backend.onrender.com/api/health` | Test backend |

---

**Total Time**: ~15 minutes  
**Difficulty**: Easy ⭐⭐

Good luck with your presentation! 🚀

