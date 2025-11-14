# Deployment Guide

This guide explains how to deploy the HeightechX application with the backend on Render and frontend on Vercel.

## Prerequisites

- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- Supabase account (for authentication)

## Backend Deployment (Render)

### Step 1: Prepare Backend

1. Ensure your backend code is in the `server/` directory
2. Make sure `server/package.json` has a `start` script

### Step 2: Deploy to Render

#### Option A: Using Render Dashboard

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `heightechx-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to root)

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://heightech-x.vercel.app`)
   - Add any other required environment variables

6. Click "Create Web Service"
7. Wait for deployment to complete
8. **Copy the service URL** (e.g., `https://heightechx-backend.onrender.com`)

#### Option B: Using Render Blueprint (render.yaml)

1. Push the `render.yaml` file to your repository
2. Go to https://dashboard.render.com
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect and use the `render.yaml` configuration
6. Update the `ALLOWED_ORIGINS` in the blueprint with your Vercel URL
7. Deploy

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Ensure your frontend code is in the root directory
2. Make sure `package.json` has a `build` script

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://heightechx-backend.onrender.com`)
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_INFURA_PROJECT_ID`: (Optional) Your Infura project ID
   - `VITE_INFURA_PROJECT_SECRET`: (Optional) Your Infura project secret

6. Click "Deploy"
7. Wait for deployment to complete
8. **Copy the deployment URL** (e.g., `https://heightech-x.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Edit your backend service
3. Update the `ALLOWED_ORIGINS` environment variable with your Vercel URL:
   ```
   https://heightech-x.vercel.app
   ```
4. Save and redeploy if necessary

## Environment Variables Summary

### Frontend (Vercel)
- `VITE_API_BASE_URL`: Backend API URL from Render
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_INFURA_PROJECT_ID`: (Optional) Infura project ID
- `VITE_INFURA_PROJECT_SECRET`: (Optional) Infura project secret

### Backend (Render)
- `PORT`: Automatically set by Render
- `NODE_ENV`: `production`
- `ALLOWED_ORIGINS`: Vercel frontend URL
- `SUPABASE_URL`: (If needed) Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: (If needed) Supabase service role key

## Testing the Connection

1. After both deployments are complete, visit your Vercel frontend URL
2. Open browser developer tools (F12)
3. Check the Network tab for API calls
4. Verify that requests to `/api/health` are successful
5. Check the console for any CORS errors

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Verify `ALLOWED_ORIGINS` in Render includes your exact Vercel URL
2. Ensure there are no trailing slashes in URLs
3. Check that the backend service is running and accessible

### API Connection Issues

1. Verify `VITE_API_BASE_URL` in Vercel matches your Render backend URL
2. Test the backend health endpoint directly: `https://your-backend.onrender.com/api/health`
3. Check Render logs for any errors

### Environment Variables Not Working

1. In Vercel, ensure variables are prefixed with `VITE_` for Vite projects
2. Redeploy after adding/changing environment variables
3. Clear browser cache and hard refresh

## Notes

- Render free tier services may spin down after inactivity. The first request after inactivity may be slow.
- Vercel automatically handles HTTPS and CDN distribution
- Both services support automatic deployments from GitHub on push

