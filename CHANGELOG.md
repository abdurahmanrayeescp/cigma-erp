# Changelog

All notable changes to the CIGMA ERP project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-06-20

### Fixed
- **Render Production Deployment Connection**: Prevented `mongodb-memory-server` from loading or being resolved on Render by using ESM dynamic `import()` for `devMemoryDb.js` and dynamically loading `mongodb-memory-server` only in development mode.
- **Production Server Startup Logs**: Added environment logging and connection status notifications to streamline Render deployment diagnostics.
- **Prevented Production Auto-Seeding**: Bypassed database auto-seeding logic in production to protect MongoDB Atlas integrity.

---

## [1.0.0] - 2026-06-20

CIGMA ERP Version 1.0.0 is officially released. This version is stabilized, frozen, and optimized for post-launch monitoring, logging, diagnostics, and maintenance support.

### Added
- **Centralized Logger**: Created file-size based automatic log rotation for error/combined traces. Logs are stored dynamically inside `logs/error.log` and `logs/combined.log`.
- **System Health Monitoring**: Implemented secure `/api/system/health` diagnostics API endpoint (accessible only to `SUPER_ADMIN` and `ADMIN` roles).
- **Diagnostics Dashboard Integration**: Exposes status reports for MongoDB, Cloudinary connectivity, Node runtime parameters, SMTP server configuration, and Firebase Cloud Messaging initialization.
- **Global Error Handling**: Wired global listeners for `uncaughtException`, `unhandledRejection`, MongoDB connection errors, and Express routing exceptions to ensure error recording.
- **Operational Logs**: Created `BUG_REPORTS.md` template log tracking post-launch regressions and issue resolutions.

### Fixed
- **Teacher Classes 404 Route**: Resolved issue where teacher class access points would return 404s by adding missing backend `/my-classes` and frontend views.
- **Express 5.x MongoDB Sanitizer Crash**: Patched `express-mongo-sanitize` middleware parameter write collision due to read-only `req.query` in Express 5.x.
- **Data Migration Schema Alignment**: Mapped MongoDB credentials correctly, converting legacy `loginId` fields to `username` to prevent schema validation failures during database seeding.

---

## [0.3.0] - Phase 3 & Production Readiness

### Added
- **Production Seeding**: Added fully functional data migration and import scripts (`migrateRealData.js`) to migrate school profiles, students, classes, and credentials.
- **Production Server Readiness**: Configured startup watchers, and build pipelines with fallback developer configurations.
- **Security Hardening**:
  - Implemented NoSQL injection prevention with query sanitization.
  - Set custom Content Security Policies (CSP) and security headers using `helmet`.
  - Added route-specific rate limits to prevent brute-force attacks on sensitive endpoints (e.g. login).
  - Wired CORS configuration restricting domains to production hosts.

---

## [0.2.0] - Phase 2 (Academics & Core Operations)

### Added
- **Academics Modules**: Homework management, Marks and grading books, Student attendance registers, and Class scheduler (Timetables).
- **Administrative Utilities**: Fee collection details, payroll registers, library inventory cataloging, and transport route tracker.
- **System Audit Trails**: Structured audit tracker records log operations, logins, changes, and operational reports.

---

## [0.1.0] - Phase 1 (Base Core & Auth)

### Added
- **Base Architecture**: Configured multi-tenant and multi-role schema models for `User`, `Student`, `Teacher`, and administrative staff.
- **Role-Based Access Control (RBAC)**: Custom routing guards verifying authorization categories (`SUPER_ADMIN`, `ADMIN`, `PRINCIPAL`, `TEACHER`, `STUDENT`, `PARENT`).
- **Portal Interfaces**: Created basic dashboards for Academics, admissions inquiries, public school news updates, downloadable resources, and standard applications.
