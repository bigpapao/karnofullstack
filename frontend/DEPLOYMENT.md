# Deployment Guide for Karno E-commerce Website

This guide will help you deploy your Karno e-commerce car parts website to various platforms.

## Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Git

## Deployment Options

### 1. Netlify Deployment (Recommended)

Netlify is a platform that offers hosting and serverless backend services for web applications.

#### Steps:
1. Create an account on [Netlify](https://www.netlify.com/) if you don't have one
2. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
3. Login to Netlify:
   ```
   netlify login
   ```
4. Navigate to your project directory:
   ```
   cd path/to/karno/frontend
   ```
5. Deploy your site:
   ```
   netlify deploy --prod
   ```

### 2. GitHub Pages Deployment

#### Steps:
1. Create a GitHub repository (e.g., Karno_test)
2. Initialize Git in your project (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect to your GitHub repository:
   ```
   git remote add origin https://github.com/vahid_h_e/Karno_test.git
   ```
4. Push your code:
   ```
   git push -u origin main
   ```
5. Install GitHub Pages package:
   ```
   npm install --save-dev gh-pages
   ```
6. Add these scripts to your package.json:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
7. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

### 3. Vercel Deployment

#### Steps:
1. Create an account on [Vercel](https://vercel.com/) if you don't have one
2. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Login to Vercel:
   ```
   vercel login
   ```
4. Deploy your site:
   ```
   vercel --prod
   ```

## Important Notes for Your Phone Authentication System

Since you're using phone-number only authentication with SMS verification:

1. Make sure your backend API for SMS verification is properly configured
2. Test the authentication flow thoroughly after deployment
3. Ensure your API keys for SMS services are properly set in environment variables
4. Consider using environment-specific configuration for development vs. production

## Files Required for Deployment

The essential files for deployment are already included in your project:
- package.json: Dependencies and scripts
- netlify.toml: Netlify configuration
- vercel.json: Vercel configuration
- public/: Static assets
- src/: Source code

## Post-Deployment Checklist

After deploying your site, make sure to:
1. Test the phone authentication system
2. Verify that adding to cart prompts for authentication when not logged in
3. Check that all redirects work properly after successful login
4. Test the overall user experience for simplicity and speed
