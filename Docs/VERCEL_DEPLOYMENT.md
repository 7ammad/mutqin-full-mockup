# Vercel Deployment Guide - SHC Demo

## Status: ✅ Code Pushed to GitHub
- **Branch:** `vercel-deployment`
- **Commit:** `a79edb5` - "feat: Demo deployment ready - SHC presentation"
- **Repository:** https://github.com/7ammad/mutqin-full-mockup.git

---

## Option 1: Automatic Deployment (If Vercel is Connected)

If your Vercel project is already connected to GitHub:

1. **Check Vercel Dashboard:**
   - Go to https://vercel.com/dashboard
   - Find your project
   - Check if it's connected to the `vercel-deployment` branch
   - Deployment should start automatically after the push

2. **If not connected:**
   - Go to Vercel Dashboard → Your Project → Settings → Git
   - Connect the repository
   - Set Production Branch to `vercel-deployment` (or create a new deployment)

---

## Option 2: Manual Deployment via Vercel CLI

If you need to deploy manually:

```powershell
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or deploy preview
vercel
```

---

## Option 3: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import from GitHub: `7ammad/mutqin-full-mockup`
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)
5. Set Production Branch: `vercel-deployment`
6. Click "Deploy"

---

## Environment Variables (If Needed)

If your app needs environment variables:

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add any required variables (for demo, you might not need any)

---

## After Deployment

Once deployed, you'll get:
- **Production URL:** `https://your-project-name.vercel.app`
- **Preview URLs:** For each branch/PR

Share the production URL with your friend for the SHC presentation!

---

## Quick Check Commands

```powershell
# Check if Vercel CLI is installed
vercel --version

# Check current deployments
vercel ls

# View deployment logs
vercel logs
```

---

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel Dashboard
2. Ensure `npm run build` works locally
3. Check for any missing environment variables
4. Verify Node.js version (Vercel uses Node 18.x by default)

---

## Next Steps After Demo

After SHC approval:
1. Set up production environment variables
2. Connect to backend API
3. Configure custom domain (if needed)
4. Set up monitoring and error tracking






