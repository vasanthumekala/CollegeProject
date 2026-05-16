# Render Deployment Guide

## Prerequisites
- MongoDB Atlas account (free tier available)
- Render account
- Cloudinary account (optional, for image uploads)

---

## Backend Deployment (Render Web Service)

### 1. Create Web Service
- Connect your GitHub repo
- Select `backend` as root directory
- Build Command: `npm install`
- Start Command: `npm start`

### 2. Set Environment Variables
Add these in Render Dashboard → Environment:

```
PORT=3000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
MONGODB_DB_NAME=Auto_Care_Service
CORS_ORIGIN=https://your-frontend-domain.onrender.com
ACCESS_TOKEN_SECRET=your-secret-key-here-change-this
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Get Backend URL
After deployment, note your backend URL: `https://your-backend.onrender.com`

---

## Frontend Deployment (Render Static Site)

### 1. Create Static Site
- Connect your GitHub repo
- Root Directory: `Frontend`
- Build Command: `npm run build`
- Publish Directory: `dist`

### 2. Set Environment Variables
Add in Render Dashboard → Environment:

```
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

### 3. Deploy Trigger
- Save and trigger new deploy
- Frontend will automatically build and use your backend URL

---

## Key Configuration Changes Made

✅ **Backend CORS** - Now supports comma-separated origins
- Handles both development and production URLs
- Fallback: `localhost:3000` and `localhost:5173` for local testing

✅ **Frontend API URL** - Uses environment variable
- Set `VITE_API_BASE_URL` on Render for production URL
- Falls back to localhost for local development

---

## Testing Before Deployment

### Local Test
```bash
# Terminal 1: Backend (port 6000)
cd backend
npm install
npm run dev

# Terminal 2: Frontend (port 5173)
cd Frontend
npm install
npm run dev
```

### Production Test on Render
1. Deploy backend first, get its URL
2. Set `VITE_API_BASE_URL` in frontend env vars
3. Deploy frontend
4. Test all API endpoints work from deployed frontend

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check `CORS_ORIGIN` matches frontend domain |
| MongoDB connection fails | Verify `MONGODB_URL` in MongoDB Atlas |
| Frontend 404 on routes | Check `vite.config.js` has `base: '/'` |
| Images not uploading | Verify Cloudinary credentials are set |
| Auth not working | Ensure `ACCESS_TOKEN_SECRET` is set |

---

## Environment Variables Summary

### Backend Required
- `MONGODB_URL` - MongoDB connection string
- `CORS_ORIGIN` - Frontend URL (https://your-frontend.onrender.com)
- `ACCESS_TOKEN_SECRET` - Secret key for JWT tokens

### Backend Optional
- `CLOUDINARY_CLOUD_NAME` - For image uploads
- `CLOUDINARY_API_KEY` - For image uploads
- `CLOUDINARY_API_SECRET` - For image uploads

### Frontend Required
- `VITE_API_BASE_URL` - Backend API URL (https://your-backend.onrender.com/api/v1)
