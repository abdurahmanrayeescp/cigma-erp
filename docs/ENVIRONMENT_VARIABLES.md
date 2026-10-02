# CIGMA School ERP — Environment Variables Reference

This document lists all environment variables required by the frontend and backend applications.

---

## 1. Backend Environment Variables (`backend/.env`)

| Variable Name | Required | Default / Example | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `development` / `production` | Execution environment |
| `PORT` | Yes | `5000` | Port for the Express backend server |
| `MONGODB_URI` | Yes | `mongodb+srv://...` | MongoDB Atlas database connection string |
| `JWT_SECRET` | Yes | `32+ char secret` | Secret used for signing JWT access tokens |
| `JWT_REFRESH_SECRET` | Yes | `32+ char secret` | Secret used for signing JWT refresh tokens |
| `FRONTEND_URL` | Yes | `https://your-app.vercel.app` | Allowed frontend origin for CORS |
| `CLOUDINARY_CLOUD_NAME` | Optional | `cigma_cloud` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Optional | `123456789` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Optional | `secret_key` | Cloudinary API Secret |
| `SMTP_HOST` | Optional | `smtp.gmail.com` | SMTP host for sending emails |
| `SMTP_PORT` | Optional | `587` | SMTP port |
| `SMTP_USER` | Optional | `creativekidskannur@gmail.com` | SMTP login username |
| `SMTP_PASS` | Optional | `app_password` | SMTP login password |
| `FIREBASE_PROJECT_ID` | Optional | `cigma-firebase` | Firebase Admin project ID |
| `FIREBASE_CLIENT_EMAIL` | Optional | `client@project.iam...` | Firebase Admin client email |
| `FIREBASE_PRIVATE_KEY` | Optional | `"-----BEGIN..."` | Firebase Admin private key |
| `GEMINI_API_KEY` | Optional | `AIzaSy...` | Google Gemini API key for AI features |
| `OPENAI_API_KEY` | Optional | `sk-...` | OpenAI API key fallback for AI features |

---

## 2. Frontend Environment Variables (`frontend/.env`)

| Variable Name | Required | Default / Example | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Yes | `http://localhost:5000/api` (dev)<br>`https://your-backend.onrender.com/api` (prod) | Base URL for REST API endpoints |
| `VITE_CLOUD_NAME` | Optional | `cigma_cloud` | Cloudinary cloud name for direct uploads |
