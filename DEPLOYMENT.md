# Deployment Guide for PixelShift

## Deploying to Render

This project is configured to deploy to Render as a static site. The build process creates a `dist` directory with all the static files needed to serve the application.

### Prerequisites

1. A Render account
2. Your code pushed to a Git repository (GitHub, GitLab, etc.)

### Deployment Steps

1. **Connect your repository to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Static Site"
   - Connect your Git repository

2. **Configure the deployment:**
   - **Name:** `pixelshift` (or your preferred name)
   - **Build Command:** `bun run build`
   - **Publish Directory:** `dist`
   - **Environment:** Static Site

3. **Environment Variables (Optional):**
   - `NODE_ENV`: `production`

4. **Deploy:**
   - Click "Create Static Site"
   - Render will automatically build and deploy your application

### Build Process

The build process:
1. Installs dependencies using Bun
2. Runs `bun run build` which executes `vite build`
3. Creates a `dist` directory with optimized static files
4. Serves the files from the `dist` directory

### Troubleshooting

If you encounter build issues:

1. **URI Malformed Error:** This was caused by `%PUBLIC_URL%` placeholders in `index.html` - now fixed
2. **Build Fails:** Ensure all dependencies are in `package.json`
3. **Missing Files:** Check that all assets are in the `public` directory

### Local Testing

To test the build locally:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build
npm run preview
```

### Performance Notes

The build includes some large chunks (>500KB). Consider:
- Code splitting with dynamic imports
- Optimizing bundle size
- Using CDN for large dependencies

### Custom Domain

After deployment, you can add a custom domain in the Render dashboard under your static site settings. 