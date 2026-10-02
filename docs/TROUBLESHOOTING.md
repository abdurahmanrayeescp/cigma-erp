# CIGMA School ERP — Troubleshooting Guide

## Common Issues & Solutions

### 1. `MongooseServerSelectionError` (Database Connection Failed)
- **Symptom**: Backend crashes on startup with MongoDB connection timeout.
- **Cause**: Network restriction, wrong `MONGODB_URI`, or MongoDB Atlas IP whitelist not configured.
- **Solution**: Ensure your current IP is added to the MongoDB Atlas Network Access whitelist. Verify the connection string in `.env`.

### 2. Frontend API Calls Returning 401 Unauthorized
- **Symptom**: Dashboard fails to load data, redirecting back to login.
- **Cause**: JWT token expired, or Refresh Token cookie not sent because of CORS mismatch.
- **Solution**: 
  - Ensure the browser accepts third-party cookies if backend/frontend domains differ.
  - In development, ensure `VITE_API_URL` exactly matches the backend domain/port.
  - In production, ensure `FRONTEND_URL` in backend `.env` matches the exact Vercel frontend URL, and `credentials: true` is configured in CORS.

### 3. "Not allowed by CORS" Error
- **Symptom**: Console shows CORS policy block on `fetch` requests.
- **Cause**: The frontend URL is not in the backend's allowed origins list.
- **Solution**: Update `backend/src/index.js` CORS configuration to include the production frontend domain.

### 4. Image/File Upload Failing
- **Symptom**: Uploading gallery images or profile photos fails with 500 error.
- **Cause**: Missing or invalid Cloudinary credentials.
- **Solution**: Check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `backend/.env`.

### 5. `React-Router` 404 on Vercel Refresh
- **Symptom**: Reloading a page like `/portal/admin` directly gives a 404 on Vercel.
- **Cause**: Vercel does not rewrite paths to `index.html` by default for SPAs.
- **Solution**: Ensure `vercel.json` exists in the frontend root with the following configuration:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### 6. AI Endpoints Return 500 Error
- **Symptom**: AI Study Plan or Insights fail to generate.
- **Cause**: Missing API keys or API quota exceeded.
- **Solution**: Ensure `GEMINI_API_KEY` or `OPENAI_API_KEY` are provided. The system uses Gemini by default.
