# CIGMA ERP: Deployment Guide

This guide provides instructions for deploying CIGMA ERP Version 1.0 to Vercel (Frontend) and Railway (Backend).

## 1. Database (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Database Cluster.
3. Under Database Access, create a user with read/write access.
4. Under Network Access, whitelist `0.0.0.0/0` (Allow access from anywhere) so Railway can connect.
5. Copy the Connection String (URI).

## 2. Backend (Railway)
1. Create an account on [Railway.app](https://railway.app/).
2. Click **New Project** -> Deploy from GitHub repo.
3. Select the `backend` folder as the Root Directory.
4. Go to **Variables** and populate all keys found in `.env.example`:
   - `MONGODB_URI`
   - `JWT_SECRET`, `JWT_REFRESH_SECRET`
   - Cloudinary Keys
   - Firebase Keys
   - Nodemailer Keys
5. Deploy. The generated `railway.app` URL will be your `VITE_API_URL` for the frontend.

## 3. Frontend (Vercel)
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New Project** -> Import from GitHub.
3. Set the Root Directory to `frontend`.
4. Framework Preset: `Vite`.
5. Under Environment Variables, add:
   - `VITE_API_URL` (Point to your Railway backend URL, e.g. `https://cigma-backend.up.railway.app/api`)
6. Deploy.

## 4. Initialization
1. SSH into the Railway backend container, or run locally pointing to the Atlas DB:
   ```bash
   node src/scripts/initCloudinary.js
   node src/scripts/migrateRealData.js
   ```
2. Save the `migration_credentials.txt` securely.
