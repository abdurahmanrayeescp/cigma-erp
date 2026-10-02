# CIGMA School ERP — Testing & Verification Guide

This guide outlines the verification and testing procedures for local development and staging environments.

---

## 1. Type Checking & Compilation
Run the TypeScript compiler check on the frontend codebase:
```bash
cd frontend
npx tsc --noEmit
```

## 2. Production Build Verification
Test production asset bundling for the frontend:
```bash
cd frontend
npm run build
```

Verify backend syntax check:
```bash
cd backend
node --check src/index.js
```

---

## 3. Local Development Verification
Start backend API server:
```bash
cd backend
npm run dev
```
*Expected log output:*
- `✅ In-memory MongoDB running at: mongodb://127.0.0.1:...`
- `🌱 Database auto-seeded with test users`
- `🚀 CIGMA API Server running on port 5000`

Start frontend development server:
```bash
cd frontend
npm run dev
```
*Expected URL:* `http://localhost:5173/`

---

## 4. API Endpoints Testing Checklist
- `GET /api/health` -> Status 200 `{ success: true, message: "CIGMA API is running" }`
- `POST /api/auth/login` -> Auth token & user object response
- `GET /api/auth/me` -> Current user details & linked reference data
- `GET /api/students` -> List of students (requires Admin/Teacher token)
- `GET /api/attendance/analytics` -> Attendance statistics
- `GET /api/ai/study-plan/:studentId` -> AI study plan object
