# Deployment Guide for Thinkzo

This guide covers deploying your Thinkzo website to various hosting platforms, with special focus on Spaceship hosting.

## 🚀 Pre-Deployment Checklist

### ✅ Required Setup
- [ ] Supabase project created and configured
- [ ] Environment variables set up
- [ ] Database migrations run
- [ ] OpenAI API key configured (for AI chat)
- [ ] Contact forms tested
- [ ] Admin account created
- [ ] Content populated via CMS

### ✅ Environment Variables Needed
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🌟 Spaceship Hosting (Recommended)

Spaceship is perfect for this React/Vite application.

### Step 1: Prepare Your Repository
```bash
# Ensure your code is in a Git repository
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Spaceship
1. Log into your Spaceship dashboard
2. Click "New Site" or "Add Project"
3. Connect your GitHub/GitLab repository
4. Select the repository containing your Thinkzo code

### Step 3: Configure Build Settings
```bash
# Build Command
npm run build

# Publish Directory
dist

# Node Version (if needed)
18.x
```

### Step 4: Add Environment Variables
In your Spaceship dashboard, add these environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Step 5: Deploy
1. Click "Deploy Site"
2. Wait for build to complete
3. Your site will be live at the provided URL

### Step 6: Custom Domain (Optional)
1. Go to Domain settings in Spaceship
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

## 🌐 Alternative Hosting Platforms

### Netlify

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**
   ```bash
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add your Supabase credentials

4. **Deploy**
   - Click "Deploy site"
   - Site will be live in minutes

### Vercel

1. **Import Project**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your Git repository

2. **Configure**
   ```bash
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Environment Variables**
   - Add in project settings
   - Include all required variables

4. **Deploy**
   - Automatic deployment on git push

### GitHub Pages

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy to gh-pages**
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

3. **Configure Repository**
   - Go to repository Settings
   - Enable GitHub Pages
   - Select gh-pages branch

## 🔧 Build Optimization

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Build Output
The build creates:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized CSS, JS, and images
- `dist/vite.svg` - Favicon

### Performance Optimizations
- Code splitting enabled
- Asset optimization
- Tree shaking
- Minification
- Gzip compression ready

## 🗄️ Database Deployment

### Supabase Production Setup

1. **Create Production Project**
   - New Supabase project for production
   - Different from development project

2. **Run Migrations**
   ```bash
   # Apply all migrations to production
   supabase db push
   ```

3. **Configure Edge Functions**
   ```bash
   # Deploy chat function
   supabase functions deploy chat
   ```

4. **Set Secrets**
   ```bash
   # Set OpenAI API key
   supabase secrets set OPENAI_API_KEY=your_key
   ```

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use different keys for production
- Rotate keys regularly

### Supabase Security
- Enable RLS on all tables
- Review and test policies
- Monitor usage and logs

### Domain Security
- Enable HTTPS (automatic on most platforms)
- Configure proper CORS settings
- Set up security headers

## 📊 Post-Deployment Testing

### Functionality Tests
1. **Contact Forms**
   - Submit test contact form
   - Verify database storage
   - Check email notifications

2. **AI Chat**
   - Test chat functionality
   - Verify OpenAI integration
   - Check response quality

3. **Admin Panel**
   - Login to admin dashboard
   - Test content editing
   - Verify team management

4. **Performance**
   - Check page load speeds
   - Test on mobile devices
   - Verify responsive design

### Monitoring Setup
- Set up error tracking
- Monitor performance metrics
- Track user interactions

## 🚨 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Working**
- Ensure variables start with `VITE_`
- Check spelling and values
- Restart development server

**Supabase Connection Issues**
- Verify URL and key are correct
- Check network connectivity
- Review CORS settings

**AI Chat Not Working**
- Verify OpenAI API key is set
- Check edge function deployment
- Review function logs

### Getting Help
- Check browser console for errors
- Review build logs
- Contact hosting support if needed

## 📈 Performance Optimization

### Lighthouse Scores
Target scores for production:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### Optimization Tips
- Optimize images before upload
- Use WebP format when possible
- Enable compression on hosting
- Implement caching strategies

## 🔄 Continuous Deployment

### Automatic Deployments
Most platforms support automatic deployment:
1. Push to main branch
2. Build triggers automatically
3. Site updates live

### Staging Environment
Consider setting up staging:
1. Create staging branch
2. Deploy to staging URL
3. Test before merging to main

## 📞 Support

If you need help with deployment:
- Email: team@thinkzo.ai
- Phone: +1 (555) 123-4567
- Documentation: Check platform-specific docs

Your Thinkzo website is now ready for the world! 🌟