# Deployment Guide - Avijo.in Investor Tracking Dashboard

## 🚀 Vercel Deployment Steps

### 1. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

**Variable Name:** `VITE_SUPABASE_URL`  
**Value:** `https://kgryjgaiueqbrraorwkb.supabase.co`

**Variable Name:** `VITE_SUPABASE_ANON_KEY`  
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtncnlqZ2FpdWVxYnJyYW9yd2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjk4MzgsImV4cCI6MjA2OTkwNTgzOH0.dSCfP8WlBDukpH-TH4QU7Zu3YjRc72Y4hs4qSfxJYRU`

### 2. Build Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist/spa`
- **Install Command:** `npm install`

### 3. Domain Configuration
Once deployed, you can:
- Use the auto-generated Vercel domain
- Add a custom domain like `avijo.vercel.app` or your own domain

### 4. Supabase Configuration
Make sure your Supabase project allows the new Vercel domain:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel domain to Site URL and Redirect URLs

## 📱 Features Deployed
✅ User Authentication (Login/Signup)  
✅ Investor Database Management  
✅ Real-time Dashboard Analytics  
✅ CSV Export Functionality  
✅ Responsive Design  
✅ Secure Data Storage  

## 🔧 Troubleshooting
If you encounter issues:
1. Check environment variables are set correctly
2. Verify Supabase URL configuration includes Vercel domain
3. Check browser console for any CORS errors
4. Ensure database tables are created (they are!)

Your investor tracking dashboard is ready for production! 🎉
