# Quick Start Guide - Graduate Connect Frontend

## Get Up and Running in 5 Minutes

### Prerequisites
- Node.js v18+ installed
- Backend API running (or use production API)

### Step 1: Install Dependencies
```bash
cd linkedin-react-frontend
npm install
```

### Step 2: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set your API URL
# For local development with Django backend:
VITE_API_URL=http://localhost:8000/api
```

### Step 3: Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 4: Create an Account
1. Click "Sign up" on the login page
2. Fill in your details:
   - Full Name
   - Email
   - Password
   - Role (Graduate/Employer/Administrator)
   - Role-specific fields
3. Click "Create Account"

### Step 5: Explore the App
- **Home Feed**: View and create posts
- **Profile**: Click your avatar to view profile
- **Settings**: Update your profile information
- **Search**: Search for users and content (desktop only)

## Project Structure Overview

```
src/
├── components/
│   ├── common/          # Reusable UI components (Button, Input, Avatar, etc.)
│   ├── feed/            # Feed-related components (PostCard, CreatePostBox, etc.)
│   ├── layout/          # Layout components (Navbar, Layout, MobileNav)
│   └── widgets/         # Sidebar widgets (ProfileWidget, TrendingWidget)
├── contexts/            # React contexts (AuthContext)
├── hooks/               # Custom hooks (useAuth, useFeed, useDebounce, etc.)
├── pages/               # Page components (Home, Login, Register, Profile, Settings)
├── services/            # API service layer (authService, postService, etc.)
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (errorHandler, dateFormatter, etc.)
├── App.tsx              # Root component with routing
└── main.tsx             # Entry point
```

## Key Features Implemented

### ✅ Authentication
- Login/Register with role-based accounts
- JWT token management
- Protected routes
- Automatic redirect on 401

### ✅ Feed
- Infinite scroll pagination
- Create posts
- Like/unlike posts
- Comment on posts
- Real-time updates

### ✅ Layout
- Responsive 3-column layout
- Sticky navigation bar
- Glassmorphism effects
- Mobile-optimized navigation

### ✅ User Profile
- View user profiles
- Update profile settings
- Role-specific information display

### ✅ Search
- Debounced search input
- Search users, posts, and topics
- Keyboard navigation

### ✅ Responsive Design
- Mobile: Single column (feed only)
- Tablet: Two columns (feed + trending)
- Desktop: Three columns (profile + feed + trending)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
node node_modules/typescript/bin/tsc --noEmit
```

## Common Tasks

### Adding a New Component
1. Create component file in appropriate directory
2. Use TypeScript for type safety
3. Follow existing component patterns
4. Export component for use elsewhere

Example:
```typescript
// src/components/common/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-xl font-bold text-[#1C1C1C]">{title}</h2>
      {onClick && (
        <button onClick={onClick} className="mt-2 text-[#0A66C2]">
          Click me
        </button>
      )}
    </div>
  );
};
```

### Adding a New API Endpoint
1. Add function to appropriate service file
2. Use the `api` instance from `services/api.ts`
3. Define TypeScript types for request/response

Example:
```typescript
// src/services/postService.ts
export const postService = {
  // ... existing functions
  
  deletePost: (postId: string): Promise<void> => {
    return api.delete(`/posts/${postId}`);
  },
};
```

### Adding a New Page
1. Create page component in `src/pages/`
2. Add route in `App.tsx`
3. Wrap with `ProtectedRoute` if authentication required

Example:
```typescript
// src/pages/MyPage.tsx
import React from 'react';
import { Layout } from '../components/layout/Layout';

export const MyPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold">My Page</h1>
      </div>
    </Layout>
  );
};

// In App.tsx
<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

## Styling Guidelines

### Color Palette
- **Primary Blue**: `#0A66C2` or `text-[#0A66C2]`
- **Background**: `#F3F2EF` or `bg-[#F3F2EF]`
- **Text Primary**: `#1C1C1C` or `text-[#1C1C1C]`
- **Text Secondary**: `#6B7280` or `text-[#6B7280]`

### Common Patterns
```typescript
// Card with glassmorphism
<div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm p-6">

// Button with hover effect
<button className="bg-[#0A66C2] text-white px-6 py-2 rounded-lg hover:bg-[#004182] transition-all duration-200">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### API Connection Issues
1. Verify backend is running
2. Check `.env` file has correct API URL
3. Check browser console for CORS errors
4. Verify backend CORS settings allow frontend origin

### Build Errors
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check TypeScript errors: `node node_modules/typescript/bin/tsc --noEmit`

## Next Steps

- Review the full [README.md](./README.md) for detailed documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Review design specifications in `.kiro/specs/linkedin-react-frontend/design.md`
- Review requirements in `.kiro/specs/linkedin-react-frontend/requirements.md`

## Need Help?

- Check the browser console for errors
- Review the component source code for examples
- Check the design document for component specifications
- Contact the development team
