# CIGMA School ERP — Production Deployment Guide

This document outlines the exact, step-by-step procedures for deploying the CIGMA full-stack application. The architecture runs the **React/Vite Frontend on Vercel** and the **Express/Node.js Backend on Render**.

---

## 1. GitHub Setup
1. Initialize a Git repository if not already done.
2. Ensure both `frontend` and `backend` directories are pushed to the main branch.
3. Verify that your `.gitignore` prevents `.env` files from being committed.

---

## 2. Render Setup (Backend)
Render will host the Node.js API. 

1. Log in to [Render](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the following settings for the web service:
   - **Name**: `cigma-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Health Check Path**: `/api/health`

### Render Environment Variables
Add the following under "Environment Variables":

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations. |
| `PORT` | `5000` | Port for the Render service. |
| `MONGODB_URI` | `<YOUR_MONGODB_URI>` | Full connection string to MongoDB Atlas. |
| `JWT_SECRET` | `<YOUR_JWT_SECRET>` | Secret string for access tokens (e.g., 32-char string). |
| `JWT_REFRESH_SECRET`| `<YOUR_JWT_REFRESH_SECRET>` | Secret string for refresh tokens. |
| `FRONTEND_URL` | `<YOUR_VERCEL_URL>` | The actual Vercel URL (add this *after* Vercel deployment) for CORS. |
| `CLOUDINARY_CLOUD_NAME`| `<YOUR_CLOUD_NAME>` | Cloudinary name for image uploads. |
| `CLOUDINARY_API_KEY` | `<YOUR_API_KEY>` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET`| `<YOUR_API_SECRET>` | Cloudinary API secret. |
| `GEMINI_API_KEY` | `<YOUR_GEMINI_KEY>` | Google Gemini API key for AI features. |

*Wait for the Render service to deploy and copy the deployed URL (e.g., `https://cigma-backend.onrender.com`).*

---

## 3. Vercel Setup (Frontend)
Vercel will host the React/Vite SPA.

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** and select **Project**.
3. Import your connected GitHub repository.
4. Click **Edit** next to "Root Directory" and select `frontend`.
5. The framework preset should automatically detect **Vite**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Vercel Environment Variables
Add the following in the Environment Variables section:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://<YOUR-RENDER-BACKEND>.onrender.com/api` | The API URL you got from Render in the previous step. |

Deploy the project. Once it finishes, copy the Vercel URL (e.g., `https://cigma-frontend.vercel.app`).

---

## 4. Final CORS Configuration (Render Update)
Now that you have your actual Vercel frontend domain:

1. Return to your Render Dashboard for `cigma-backend`.
2. Edit the `FRONTEND_URL` environment variable.
3. Set it precisely to your Vercel URL (e.g., `https://cigma-frontend.vercel.app`).
4. Restart the Render web service to apply the CORS origin policy.

---

## 5. Database Setup (MongoDB Atlas)
The project natively uses Mongoose without Prisma. 
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and click **Add IP Address**.
3. Allow Access from Anywhere (`0.0.0.0/0`) since Render IPs are dynamic.
4. Obtain your connection string and insert it into `MONGODB_URI` on Render.
5. The application will auto-seed itself if necessary, otherwise it connects seamlessly.

---

## 6. Troubleshooting
- **401 Unauthorized loops**: Verify that `FRONTEND_URL` is EXACTLY matching your Vercel URL (no trailing slash). This is necessary because cookies require matching CORS headers.
- **500 Server Error on Uploads**: Cloudinary keys in Render are missing or incorrect.
- **Database Connection Failed**: Double-check the Network Access whitelist in MongoDB Atlas. Render's dynamic IPs require `0.0.0.0/0` access.
- **404 on Page Refresh in Vercel**: `vercel.json` already contains rewrites. If it continues happening, ensure `vercel.json` exists in the `frontend` root directory with `source: "/(.*)", destination: "/index.html"`.
