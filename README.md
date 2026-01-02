# Swiggy Campus Wrapped

An interactive year-end summary experience for campus food ordering data, built with React and GSAP.

## Features

- 🎵 Background music with mute/unmute controls
- 📊 Multiple stat screens with animations
- 🎨 Beautiful UI with smooth transitions
- 📱 Mobile-responsive design
- 🎉 Confetti effects for special moments

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. Push your code to the `main` or `master` branch
2. The GitHub Actions workflow will automatically:
   - Build the project
   - Deploy to GitHub Pages
3. Your site will be available at: `https://[your-username].github.io/[repository-name]/`

### Manual Deployment

If you prefer to deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to your repository Settings → Pages
3. Select "GitHub Actions" as the source
4. Or use the `gh-pages` branch method:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

### Setting Base Path

If your repository name is different, update the base path in `vite.config.js`:

```js
base: '/your-repo-name/'
```

Or set it via environment variable in the GitHub Actions workflow.

## Project Structure

```
├── public/
│   ├── assets/        # Images, logos, vectors
│   └── music/          # Background music files
├── src/
│   ├── components/     # React components
│   ├── screens/        # Screen components
│   ├── styles/         # CSS modules
│   ├── utils/          # Utility functions
│   └── data/           # Campus data JSON
└── dist/               # Build output (generated)
```

## License

MIT
