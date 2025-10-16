# Backend Integration Setup Guide

## Local Development Setup

1. **Update the `.env` file** with your actual Django backend URL:
   ```
   VITE_API_BASE_URL=https://your-actual-backend.vercel.app
   ```

2. **Restart your development server** to load the new environment variables:
   ```bash
   npm run dev
   ```

## Vercel Deployment Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-actual-backend.vercel.app` (your Django backend URL)
   - **Environment**: Production, Preview, and Development
4. Redeploy your application

## API Endpoints

The frontend will call these endpoints on your Django backend:

- **Register**: `POST /register/`
  - Body: `{ username, email, password, confirm_password }`
  
- **Login**: `POST /login/`
  - Body: `{ email, password }`
  - Expected response: `{ token, ... }` (if using token authentication)

## Features Implemented

✅ Async API calls with fetch
✅ Loading states during submission
✅ Error handling with user feedback
✅ Token storage in localStorage (for login)
✅ Automatic redirection after success
✅ CORS-ready (as configured on backend)
✅ Environment-based configuration

## Testing

1. Try registering a new user
2. Check the Network tab in browser DevTools to see the API calls
3. Try logging in with the registered credentials
4. Check localStorage for the auth token

## Troubleshooting

- **CORS errors**: Ensure your Django backend has the frontend URL in `CORS_ALLOWED_ORIGINS`
- **404 errors**: Verify the API endpoint URLs match your Django routes
- **Network errors**: Check if the backend URL is correct in `.env`
