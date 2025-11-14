# 🚀 Quick Deployment Checklist for Judges Demo

## ⏱️ Total Time: 15 minutes

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository is ready: `https://github.com/sahifmohammad12/HeightechX`
- [ ] Render account created (free): https://render.com
- [ ] Vercel account created (free): https://vercel.com
- [ ] Supabase credentials ready (if using auth)

---

## 🔧 STEP 1: Deploy Backend (Render) - 5 min

### Render Dashboard Setup
- [ ] Go to https://dashboard.render.com
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Connect GitHub repo: `sahifmohammad12/HeightechX`

### Service Configuration
- [ ] **Name**: `heightechx-backend`
- [ ] **Environment**: `Node`
- [ ] **Build Command**: `cd server && npm install`
- [ ] **Start Command**: `cd server && npm start`

### Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `ALLOWED_ORIGINS` = `https://heightech-x.vercel.app` *(update after Step 2)*

### Deploy
- [ ] Click **"Create Web Service"**
- [ ] Wait for deployment (2-3 min)
- [ ] **Copy backend URL**: `https://heightechx-backend.onrender.com` ✅

---

## 🎨 STEP 2: Deploy Frontend (Vercel) - 5 min

### Vercel Dashboard Setup
- [ ] Go to https://vercel.com
- [ ] Click **"Add New..."** → **"Project"**
- [ ] Import repo: `sahifmohammad12/HeightechX`

### Project Configuration
- [ ] **Framework**: `Vite` (auto-detected)
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`

### Environment Variables
- [ ] `VITE_API_BASE_URL` = `https://heightechx-backend.onrender.com`
- [ ] `VITE_SUPABASE_URL` = `your_supabase_url`
- [ ] `VITE_SUPABASE_ANON_KEY` = `your_supabase_key`
- [ ] `VITE_INFURA_PROJECT_ID` = `your_infura_id` (optional)
- [ ] `VITE_INFURA_PROJECT_SECRET` = `your_infura_secret` (optional)

### Deploy
- [ ] Click **"Deploy"**
- [ ] Wait for deployment (2-3 min)
- [ ] **Copy frontend URL**: `https://heightech-x.vercel.app` ✅

---

## 🔗 STEP 3: Connect Frontend & Backend - 2 min

### Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Open `heightechx-backend` service
- [ ] Go to **"Environment"** tab
- [ ] Edit `ALLOWED_ORIGINS`
- [ ] Set to: `https://heightech-x.vercel.app`
- [ ] Save (auto-redeploys)

---

## ✅ STEP 4: Test Everything - 2 min

### Frontend Test
- [ ] Open: `https://heightech-x.vercel.app`
- [ ] Page loads correctly ✅
- [ ] No console errors (F12 → Console) ✅

### Backend Test
- [ ] Open: `https://heightechx-backend.onrender.com/api/health`
- [ ] See: `{"status":"ok",...}` ✅

### Connection Test
- [ ] Open DevTools → Network tab
- [ ] Check API calls succeed ✅
- [ ] No CORS errors ✅

---

## 🎯 Demo URLs (Save These!)

| Service | URL |
|---------|-----|
| **Frontend** | `https://heightech-x.vercel.app` |
| **Backend** | `https://heightechx-backend.onrender.com` |
| **Health Check** | `https://heightechx-backend.onrender.com/api/health` |

---

## 🆘 Quick Fixes

| Problem | Solution |
|---------|----------|
| CORS Error | Update `ALLOWED_ORIGINS` in Render with exact Vercel URL |
| Can't Connect | Verify `VITE_API_BASE_URL` matches Render backend URL |
| Build Failed | Check environment variables are set correctly |
| Variables Not Working | Ensure Vercel vars start with `VITE_` prefix |

---

## 💡 Pro Tips for Judges

1. ✅ Deploy 1 day before demo
2. ✅ Test all features work
3. ✅ Have URLs ready to show
4. ✅ Show Network tab with API calls
5. ✅ Keep localhost as backup

---

**Status**: ☐ Not Started | ☐ In Progress | ☐ Completed

**Notes**: 
_________________________________________________
_________________________________________________

