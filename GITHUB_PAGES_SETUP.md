# GitHub Pages Deployment Guide

This guide will help you deploy your Campus Wrapped app to GitHub Pages for free.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Your project code ready

## Step-by-Step Instructions

### Step 1: Initialize Git Repository (if not already done)

Open your terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - Campus Wrapped app"
```

### Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name your repository (e.g., `campus-wrapped` or `swiggy-campus-wrapped`)
4. **Important:** 
   - Choose **Public** (required for free GitHub Pages)
   - **DO NOT** check "Initialize with README" (you already have files)
   - **DO NOT** add .gitignore or license (you already have them)
5. Click **Create repository**

### Step 3: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

Replace:
- `YOUR-USERNAME` with your GitHub username
- `YOUR-REPO-NAME` with the repository name you created

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy when you push to `main` branch

### Step 5: Trigger the First Deployment

The workflow should automatically run after you push. If it doesn't:

1. Go to your repository → **Actions** tab
2. You should see "Deploy to GitHub Pages" workflow
3. Click on it and click **Run workflow** → **Run workflow**

### Step 6: Wait for Deployment

1. Go to **Actions** tab
2. Wait for the workflow to complete (green checkmark)
3. This usually takes 1-2 minutes

### Step 7: Access Your Site

Once deployment is complete, your site will be available at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example, if your username is `john` and repo is `campus-wrapped`:
```
https://john.github.io/campus-wrapped/
```

## How It Works

- The GitHub Actions workflow automatically:
  1. Builds your Vite app
  2. Sets the correct base path (`/repository-name/`)
  3. Deploys to GitHub Pages
  4. Updates on every push to `main` branch

## Updating Your Site

To update your site:

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. The site will automatically redeploy (check Actions tab)

## Troubleshooting

### Site shows 404 or blank page

1. Check the **Actions** tab - is the workflow successful?
2. Wait a few minutes - GitHub Pages can take time to update
3. Clear your browser cache
4. Check the URL matches: `https://username.github.io/repo-name/`

### Assets not loading

- The base path is automatically set by the workflow
- Make sure all asset paths in your code use `/assets/...` (they already do)
- Clear browser cache

### Workflow fails

1. Check the **Actions** tab for error messages
2. Common issues:
   - Missing dependencies (should be fixed now)
   - Build errors (check your code)
   - Node version issues (workflow uses Node 18)

## Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file in the `public/` folder with your domain:
   ```
   yourdomain.com
   ```
2. Update your DNS settings as per GitHub Pages instructions
3. The base path will automatically be `/` for custom domains

## Need Help?

- Check GitHub Actions logs in the **Actions** tab
- Verify your repository name matches the URL
- Make sure the workflow file is in `.github/workflows/deploy.yml`

