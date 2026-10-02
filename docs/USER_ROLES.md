# CIGMA School ERP — User Roles & Permissions

The CIGMA School ERP implements a strict Role-Based Access Control (RBAC) system. All endpoints and portal routes are protected by roles.

## Role Hierarchy & Access Matrix

### 1. SUPER_ADMIN / ADMIN
- **Description**: Full system access. Typically assigned to the Principal, School Management, or System Administrators.
- **Frontend Portal**: `/portal/admin`
- **Permissions**:
  - Full CRUD on Students, Teachers, Parents, Subjects, Classes.
  - Approve/Revoke Attendance, Marks, Certificates.
  - Full access to Fees collection, Invoices, Payroll, Transport, Library.
  - Configure AI integrations and manage global Settings.

### 2. TEACHER
- **Description**: Access to assigned classes and subjects.
- **Frontend Portal**: `/portal/teacher`
- **Permissions**:
  - View assigned students and classes.
  - Mark daily attendance for assigned classes.
  - Enter marks for assigned subjects.
  - Create and assign homework.
  - View their own payslips and timetable.

### 3. ACCOUNTANT
- **Description**: Dedicated role for financial operations.
- **Frontend Portal**: `/portal/admin/fees` (or subset of Admin dashboard)
- **Permissions**:
  - View and manage fee structures.
  - Collect fees, record payments, issue receipts.
  - View pending fees and outstanding collections.
  - Export financial reports and CSVs.

### 4. PARENT
- **Description**: Parent dashboard to track child/children progress.
- **Frontend Portal**: `/portal/parent`
- **Permissions**:
  - View their own children's profiles.
  - View attendance records, marks, and homework for their children.
  - View AI Parent Insights for academic performance.
  - View fee invoices, payment history, and receipts.

### 5. STUDENT
- **Description**: Student dashboard for personal academic tracking.
- **Frontend Portal**: `/portal/student`
- **Permissions**:
  - View own profile, attendance, and exam marks.
  - View and submit homework/assignments.
  - Access Library catalogs and borrow history.
  - View AI Study Plans.

---

## Authentication Mechanism
- Roles are embedded into the JWT token payload (`req.user.role`).
- The `requireRole('ROLE_A', 'ROLE_B')` middleware enforces role checks at the Express route level.
- Frontend route guards (`<ProtectedRoute>`) prevent access to unauthorized portal pages based on `AuthContext`.
