# GitHub Pages Deployment Guide

Follow these steps to deploy your Campus Wrapped app to GitHub Pages:

## Step 1: Initialize Git Repository

If you haven't already, initialize a git repository:

```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `campus-wrapped` or `swiggy-campus-wrapped`)
3. **Do NOT** initialize with README, .gitignore, or license (you already have these)

## Step 3: Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy when you push to `main` branch

## Step 5: Update Base Path (Important!)

After your first deployment, check the URL. If it's something like:
- `https://yourusername.github.io/campus-wrapped/`

You need to update the base path in `vite.config.js`:

```js
base: '/campus-wrapped/',  // Replace with your actual repo name
```

Then commit and push:
```bash
git add vite.config.js
git commit -m "Update base path for GitHub Pages"
git push
```

## Step 6: Verify Deployment

1. Go to your repository → **Actions** tab
2. Wait for the workflow to complete (green checkmark)
3. Visit your site at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## Troubleshooting

### Assets Not Loading

If images or assets aren't loading, make sure:
1. The `base` path in `vite.config.js` matches your repository name
2. All asset paths use relative paths (they should already)
3. Rebuild and redeploy

### 404 Errors

- Ensure the base path is correct
- Check that the workflow completed successfully
- Clear browser cache

### Manual Deployment

If automatic deployment doesn't work, you can deploy manually:

```bash
npm run build
npx gh-pages -d dist
```

## Custom Domain (Optional)

If you have a custom domain:
1. Add a `CNAME` file in the `public` folder with your domain
2. Update DNS settings as per GitHub Pages instructions
3. Set `base: '/'` in `vite.config.js`

