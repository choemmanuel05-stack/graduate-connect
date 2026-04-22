# Deployment Guide - Graduate Connect Frontend

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Create `.env.production` file with production API URL
- [ ] Verify `VITE_API_URL` points to production backend
- [ ] Set `VITE_ENV=production`

### 2. Code Quality
- [ ] Run TypeScript check: `node node_modules/typescript/bin/tsc --noEmit`
- [ ] Run linter: `npm run lint`
- [ ] Fix any warnings or errors

### 3. Build Verification
- [ ] Run production build: `npm run build`
- [ ] Verify build completes without errors
- [ ] Check `dist/` directory is created
- [ ] Preview build locally: `npm run preview`

### 4. Testing
- [ ] Test authentication flow (login/register/logout)
- [ ] Test post creation and interactions (like/comment)
- [ ] Test navigation between pages
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test error handling (network errors, 401, etc.)

## Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

**Steps:**
1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `VITE_API_URL`: Your production API URL
   - `VITE_ENV`: production
6. Click "Deploy"

**Automatic Deployments:**
- Vercel automatically deploys on every push to main branch
- Preview deployments for pull requests

### Option 2: Netlify

**Steps:**
1. Build the application: `npm run build`
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Login: `netlify login`
4. Deploy: `netlify deploy --prod`
5. Point to `dist` directory when prompted
6. Configure environment variables in Netlify dashboard

**Configuration File (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: AWS S3 + CloudFront

**Steps:**

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket:**
   - Go to AWS S3 Console
   - Create new bucket (e.g., `graduate-connect-frontend`)
   - Enable static website hosting
   - Set index document to `index.html`
   - Set error document to `index.html` (for client-side routing)

3. **Upload files:**
   ```bash
   aws s3 sync dist/ s3://graduate-connect-frontend --delete
   ```

4. **Create CloudFront Distribution:**
   - Origin: Your S3 bucket
   - Default root object: `index.html`
   - Error pages: Configure 404 to return `index.html` with 200 status

5. **Configure DNS:**
   - Point your domain to CloudFront distribution
   - Set up SSL certificate in AWS Certificate Manager

### Option 4: Docker Container

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and run:**
```bash
docker build -t graduate-connect-frontend .
docker run -p 80:80 graduate-connect-frontend
```

### Option 5: Serve from Django Backend

**Steps:**

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Copy build files to Django:**
   ```bash
   # Create directory in Django project
   mkdir -p ../static/frontend
   
   # Copy build files
   cp -r dist/* ../static/frontend/
   ```

3. **Configure Django settings:**
   ```python
   # settings.py
   STATICFILES_DIRS = [
       os.path.join(BASE_DIR, 'static'),
   ]
   
   TEMPLATES = [
       {
           'BACKEND': 'django.template.backends.django.DjangoTemplates',
           'DIRS': [os.path.join(BASE_DIR, 'static/frontend')],
           # ...
       },
   ]
   ```

4. **Configure Django URLs:**
   ```python
   # urls.py
   from django.views.generic import TemplateView
   
   urlpatterns = [
       path('api/', include('api.urls')),
       # ... other API routes
       
       # Serve React app for all other routes
       re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
   ]
   ```

## Post-Deployment

### 1. Verification
- [ ] Visit production URL
- [ ] Test login/register
- [ ] Create a test post
- [ ] Test all navigation links
- [ ] Check browser console for errors
- [ ] Test on mobile device

### 2. Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics, Mixpanel, etc.)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)

### 3. Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify asset caching
- [ ] Test load times from different locations

### 4. Security
- [ ] Verify HTTPS is enabled
- [ ] Check Content Security Policy headers
- [ ] Verify CORS configuration
- [ ] Test authentication flow security

## Rollback Procedure

If issues are discovered after deployment:

1. **Vercel/Netlify:**
   - Go to deployments dashboard
   - Click "Rollback" on previous working deployment

2. **AWS S3:**
   - Restore previous version from S3 versioning
   - Invalidate CloudFront cache

3. **Docker:**
   - Deploy previous Docker image tag
   - `docker run -p 80:80 graduate-connect-frontend:previous-tag`

## Environment Variables Reference

| Variable | Development | Production |
|----------|-------------|------------|
| VITE_API_URL | http://localhost:8000/api | https://api.graduateconnect.com/api |
| VITE_ENV | development | production |

## Troubleshooting

### Build Fails
- Check Node.js version (requires v18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `node node_modules/typescript/bin/tsc --noEmit`

### Blank Page After Deployment
- Check browser console for errors
- Verify API URL is correct in environment variables
- Check that server is configured for client-side routing (returns index.html for all routes)

### API Requests Failing
- Verify CORS is configured on backend
- Check API URL in environment variables
- Verify authentication token is being sent
- Check network tab in browser dev tools

### Routing Not Working
- Ensure server is configured to return index.html for all routes
- For Nginx: Use `try_files $uri $uri/ /index.html;`
- For Apache: Use `.htaccess` with RewriteRule

## Support

For issues or questions:
- Check the main README.md
- Review the design.md and requirements.md in `.kiro/specs/linkedin-react-frontend/`
- Contact the development team
