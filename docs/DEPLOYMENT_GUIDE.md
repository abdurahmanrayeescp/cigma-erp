# CIGMA ERP: Deployment Guide

This guide provides instructions for deploying CIGMA ERP Version 1.0 to Vercel (Frontend) and Railway or Render (Backend).

## 1. Database (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Database Cluster.
3. Under Database Access, create a user with read/write access.
4. Under Network Access, whitelist `0.0.0.0/0` (Allow access from anywhere) so Railway or Render can connect.
5. Copy the Connection String (URI).

## 2. Backend Options

### Option A: Backend (Railway)
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

### Option B: Backend (Render)
Render is a cloud platform that supports blueprints (`render.yaml`) for one-click setup.

#### Manual Deploy on Render
1. Create an account on [Render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following options:
   - **Name**: `cigma-backend`
   - **Language**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Advanced** and add the environment variables from `.env.example`:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI`
   - `JWT_SECRET`, `JWT_REFRESH_SECRET`
   - Cloudinary, Firebase, and Nodemailer credentials.
6. Deploy. The generated `.onrender.com` URL (e.g. `https://cigma-backend.onrender.com`) will be your `VITE_API_URL` for the frontend.

#### Blueprint Deploy on Render
If you have pushed the project's root `render.yaml` to your GitHub repo:
1. Log in to Render.
2. Go to **Blueprints** -> **New Blueprint Instance**.
3. Connect the repository.
4. Render will automatically parse the `render.yaml` and prompt you for the required environment variables.
5. Once configured, Render will automatically deploy your backend and keep it in sync with your GitHub repository.


## 3. Frontend (Vercel)

### Option A: One-Click Deploy to Vercel
You can deploy the frontend to Vercel with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abdurahmanrayeescp/cigma-erp&root-directory=frontend)

### Option B: Manual Deploy on Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New Project** -> Import from GitHub.
3. Choose the repository `cigma-erp`.
4. Set the **Root Directory** to `frontend`.
5. Framework Preset: `Vite` (automatically detected).
6. Under Environment Variables, add:
   - `VITE_API_URL` (Point to your Render backend API URL, e.g. `https://cigma-backend.onrender.com/api` or Railway URL `https://cigma-backend.up.railway.app/api`)
   - `VITE_CLOUD_NAME` (Your Cloudinary cloud name)
7. Click **Deploy**.


## 4. Initialization
1. SSH into the Railway backend container, or run locally pointing to the Atlas DB:
   ```bash
   node src/scripts/initCloudinary.js
   node src/scripts/migrateRealData.js
   ```
2. Save the `migration_credentials.txt` securely.

## 5. Custom Domain Configuration (creativecigma.com)
For the production go-live, the domain structure must be configured as follows:

| Subdomain | Target Service | Hosting Platform | DNS Record Type |
| :--- | :--- | :--- | :--- |
| `creativecigma.com` | Public Website | Vercel (Frontend) | `A` record (to Vercel IP) or `CNAME` |
| `portal.creativecigma.com` | User Portal | Vercel (Frontend) | `CNAME` (pointing to `cname.vercel-dns.com`) |
| `admin.creativecigma.com` | Admin Portal | Vercel (Frontend) | `CNAME` (pointing to `cname.vercel-dns.com`) |
| `api.creativecigma.com` | Express Backend API | Railway (Backend) | `CNAME` (pointing to Railway domain host) |

### SSL & HTTPS Redirection
1. **SSL Certificates:** Automatically provisioned by Vercel and Railway via Let's Encrypt once DNS records propagate.
2. **HTTPS Redirection:** Enforced at the platform level (both Vercel's Edge routing and Railway's ingress proxy will automatically upgrade all HTTP requests to HTTPS).
3. **Subdomain Routing:** The frontend Single Page Application (SPA) uses path and host detection or a single compiled build mapped to multiple domains in Vercel to route traffic seamlessly.

