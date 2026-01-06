# GitHub Pages Fix Guide

## Current Configuration Status ✅

Your repository is configured correctly for GitHub Pages with GitHub Actions.

## How to Fix GitHub Pages Settings

### 1. Go to Repository Settings
- URL: https://github.com/f20230152/CAMPUS-WORKING-FINAL/settings/pages

### 2. Configure Source
**IMPORTANT:** Set the source to:
- **Source:** `GitHub Actions` (NOT "Deploy from a branch")

### 3. Verify Workflow
- Go to: https://github.com/f20230152/CAMPUS-WORKING-FINAL/actions
- Check if "Deploy to GitHub Pages" workflow is running
- If it shows errors, check the error logs

### 4. Enable Pages (if needed)
If Pages is disabled:
1. Go to Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Click "Save"

## Your Site URL
Once fixed, your site will be available at:
```
https://f20230152.github.io/CAMPUS-WORKING-FINAL/
```

## Common Issues & Fixes

### Issue: "Pages is disabled"
**Fix:** Enable Pages in Settings → Pages → Select "GitHub Actions" as source

### Issue: "Workflow not running"
**Fix:** 
1. Go to Actions tab
2. Check if workflow is enabled
3. If disabled, enable it in Settings → Actions → General → Workflow permissions

### Issue: "Build failing"
**Fix:**
1. Check Actions tab for error messages
2. Common issues:
   - Missing `package-lock.json` (should be committed)
   - Node version mismatch
   - Build errors

## Current Configuration Files ✅

- ✅ `.github/workflows/deploy.yml` - Correctly configured
- ✅ `vite.config.js` - Base path configured correctly
- ✅ `index.html` - Entry point correct
- ✅ `package-lock.json` - Should be committed

## Need Help?
If issues persist, check:
1. Repository visibility (must be public for free GitHub Pages)
2. Actions permissions (Settings → Actions → General)
3. Pages permissions (Settings → Pages)

