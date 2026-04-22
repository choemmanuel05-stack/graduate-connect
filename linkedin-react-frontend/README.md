# LinkedIn React Frontend - Graduate Connect

A modern, responsive LinkedIn-inspired user interface for the Graduate Connect platform built with React, TypeScript, Tailwind CSS, and Lucide-react icons.

## Features

- ⚡️ Vite for fast development and optimized builds
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS with custom brand colors
- 🎯 Lucide React icons
- 🔄 React Router for navigation
- 📡 Axios for API integration
- 🎭 Glassmorphism effects
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js v24.14.1 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd linkedin-react-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your API URL

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
linkedin-react-frontend/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── services/       # API services
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── pages/          # Page components
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── .env.example        # Environment variables template
└── vite.config.ts      # Vite configuration
```

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:8000/api)
- `VITE_ENV`: Environment (development, production)

## Custom Tailwind Theme

The project uses custom brand colors:

- **Modern Blue** (#0A66C2): Primary brand color
- **Off White** (#F3F2EF): Background color
- **Deep Charcoal** (#1C1C1C): Primary text color
- **Neutral Gray** (#6B7280): Secondary text color

## Technologies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Lucide React**: Icon library

## Deployment

### Build for Production

1. Ensure environment variables are set correctly in `.env.production`:
   ```
   VITE_API_URL=https://your-api-domain.com/api
   VITE_ENV=production
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. The optimized production build will be in the `dist/` directory.

### Deployment Options

#### Option 1: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your deployment.

#### Option 2: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Point to the `dist` directory when prompted.

#### Option 3: AWS S3 + CloudFront

1. Build the application:
   ```bash
   npm run build
   ```

2. Upload the `dist/` directory to an S3 bucket configured for static website hosting.

3. Configure CloudFront distribution to serve from the S3 bucket.

4. Set up proper cache invalidation for `index.html`.

#### Option 4: Serve from Django Backend

1. Build the application:
   ```bash
   npm run build
   ```

2. Copy the contents of `dist/` to Django's static files directory.

3. Configure Django to serve the React app:
   ```python
   # In Django urls.py
   from django.views.generic import TemplateView
   
   urlpatterns = [
       # ... other patterns
       path('', TemplateView.as_view(template_name='index.html')),
   ]
   ```

### Environment Configuration

Ensure the following environment variables are configured in your deployment platform:

- `VITE_API_URL`: Your production API URL
- `VITE_ENV`: Set to `production`

### Performance Optimization

The build process automatically includes:

- Code splitting for routes
- Tree shaking to remove unused code
- Minification and compression
- Asset optimization

### Post-Deployment Checklist

- [ ] Verify API connectivity
- [ ] Test authentication flow
- [ ] Check responsive design on multiple devices
- [ ] Verify all routes work correctly
- [ ] Test error handling
- [ ] Monitor console for errors
- [ ] Set up error tracking (e.g., Sentry)

## License

This project is part of the Graduate Connect platform.
