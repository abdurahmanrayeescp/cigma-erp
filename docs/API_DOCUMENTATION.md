# CIGMA ERP: API Documentation

The CIGMA API acts as a secure, centralized conduit connecting the frontend interfaces and backend data layers. 

## Base URL
Production: `https://api.creativecigma.com/api`

## Authentication
All API endpoints (except public `/inquiries` and `/auth/login`) are protected via HTTP Bearer Authentication. 
Tokens have a 15-minute expiry. Silent refresh is handled via HTTP-Only cookies targeting the `/auth/refresh` endpoint.

## Key Modules

### 1. Attendance (`/api/attendance`)
- `POST /` - Teacher marks daily attendance.
- `GET /student/:id` - Fetches historical tracking and AI-generated insights.

### 2. Marks & Analytics (`/api/marks`)
- `POST /` - Teacher records examination marks.
- `GET /student/:id` - Triggers AI diagnostics assessing strength and weaknesses across subjects.

### 3. Certificates (`/api/certificates`)
- `POST /generate` - Generates a secure, dynamically templated PDF for TC or Bonafide records.

### 4. Library & Transport (`/api/library`, `/api/transport`)
- Expose resource management for buses and books, enforcing availability invariants.

## Role-Based Access Control (RBAC)
Endpoints validate permissions dynamically. A `PARENT` token cannot hit `/api/payroll`, resulting in an automatic `403 Forbidden` response and an Audit Log violation entry.
