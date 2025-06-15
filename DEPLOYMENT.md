# Deploying to Vercel

This guide will help you deploy the Ethereum Wallet Validator application to Vercel.

## Prerequisites

- A [GitHub](https://github.com/) account (recommended for easy deployment)
- A [Vercel](https://vercel.com/) account (you can sign up using your GitHub account)

## Deployment Options

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**

   Create a new GitHub repository and push your code:

   ```bash
   # Initialize git if not already done
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit"
   
   # Add remote repository (replace with your GitHub repository URL)
   git remote add origin https://github.com/your-username/ethereum-wallet-validator.git
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select the GitHub repository you just created
   - Click "Import"

3. **Configure Project**

   - In the configuration screen, keep the default settings:
     - Framework Preset: Leave as "Other"
     - Root Directory: `./` (default)
     - Build Command: Leave empty (not needed for static sites)
     - Output Directory: Leave empty (default to `.`)
   - Click "Deploy"

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy your Project**

   Navigate to your project directory and run:

   ```bash
   # Navigate to project directory
   cd /Users/praiseleye/Documents/Blockheader-Assessment/question-a/
   
   # Login to Vercel (if not already logged in)
   vercel login
   
   # Deploy
   vercel
   ```

   - Follow the CLI prompts:
     - Set up and deploy: `y`
     - Link to existing project: `n`
     - Project name: accept default or type a name
     - Directory: `.`

3. **View your Deployment**

   Once deployment is complete, Vercel will provide a URL where you can view your application.

## After Deployment

### Custom Domain (Optional)

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the verification steps

### Continuous Deployment

If you used the GitHub method:
- Any new commits pushed to your main branch will automatically trigger a new deployment
- You can configure branch deployments and preview builds in your project settings

### Troubleshooting

If your deployment fails or doesn't look correct:

1. Check that all assets are referenced with relative paths
2. Ensure all files are correctly pushed to GitHub
3. Make sure your HTML file is named `index.html` (for it to be served as the main page)
4. Review deployment logs in the Vercel dashboard

### Vercel Analytics (Optional)

To add analytics to your project:
1. Go to your project in the Vercel dashboard
2. Navigate to "Analytics" tab
3. Follow the instructions to enable analytics

## Benefits of Using Vercel

- Global CDN for fast loading
- Automatic HTTPS
- Custom domains
- Continuous deployment
- Edge functions (if you expand your app later)
- Analytics and monitoring

Your Ethereum Wallet Validator will be available globally with high performance and reliability.
