# CIGMA School ERP — System Architecture & Design Specification

## Overview
The CIGMA School ERP system is a modern, full-stack educational management platform engineered for Creative International Girls Madrassa Academy (CIGMA).

```
 ┌─────────────────────────────────────────────────────────────┐
 │                       React 19 Frontend                     │
 │           (Vite + Tailwind CSS v4 + Framer Motion)          │
 └──────────────────────────────┬──────────────────────────────┘
                                │ HTTPS / REST / JWT
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                    Node.js Express Backend                  │
 │           (Security: Helmet, CORS, MongoSanitize)           │
 └──────┬───────────────────────┬──────────────────────────────┘
        │                       │
        ▼                       ▼
 ┌──────────────┐    ┌─────────────────────────┐
 │ MongoDB Atlas│    │ Third-Party Services    │
 │ (Data Store) │    │ - Cloudinary (Media)    │
 └──────────────┘    │ - Nodemailer (SMTP)     │
                     │ - Firebase Admin (FCM)  │
                     │ - Gemini / OpenAI (AI)  │
                     └─────────────────────────┘
```

## Frontend Architecture
- **Framework**: React 19 with TypeScript and Vite
- **Styling**: Vanilla CSS & Tailwind CSS v4 with custom dark mode theme system
- **Routing**: `react-router-dom` v7 with role-based route guards
- **API Client**: Centralized Axios/fetch client (`src/lib/api.ts`) supporting base URL resolution via `VITE_API_URL`
- **State Management**: React Context (`AuthContext`, `ThemeContext`) + Zustand

## Backend Architecture
- **Runtime**: Node.js ES Modules (`"type": "module"`)
- **Web Framework**: Express 5.x
- **Database Layer**: Mongoose ORM connecting to MongoDB Atlas (or in-memory MongoDB during local dev)
- **Authentication**: JWT access tokens (15m expiration) + HttpOnly refresh cookies (7d expiration) with password hashing via `bcryptjs`
- **Security**: Helmet security headers, CORS origin validation, NoSQL query sanitization, and express-rate-limit

## Core Domain Modules
1. **User Management & Authentication**: Multi-role support (`SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`, `ACCOUNTANT`)
2. **Academic & Timetable Engine**: Class, Division, Subject assignment, Timetable slot tracking
3. **Attendance & Marks Engine**: Daily student attendance logging, exam mark entry, report card generation
4. **Financial Engine**: Fee structure definition, payment collection, receipt generation, outstanding balances
5. **AI Module**: AI Study Plan generator and AI Parent Insights engine with deterministic fallback logic
