# CIGMA ERP Version 1.0 Bug Tracking Log

This log is used to document, prioritize, and track software bugs and technical issues discovered during post-launch operations.

## Severity Levels
- **CRITICAL**: System crash, data loss, security vulnerability, or completely blocked core workflow.
- **HIGH**: Major feature broken without simple workaround.
- **MEDIUM**: Non-blocking feature broken with functional workaround.
- **LOW**: Minor UI polish, spelling error, or cosmetic issue.

## Statuses
- `OPEN`: Newly reported issues requiring verification and initial analysis.
- `IN_PROGRESS`: Identified, assigned, and actively being resolved.
- `FIXED`: Code change complete and ready/deployed to staging/prod.
- `CLOSED`: Verified by reporter/QA and officially resolved.

---

## Issue Log

| Date | Module | Severity | Status | Assigned Developer | Description | Resolution Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-06-20 | Teacher Portal | MEDIUM | FIXED | Admin | Teacher Classes page threw a 404/not-found route error when loaded in portal | Added TeacherClassesPage component and associated backend routes for `/my-classes` |

---

## Bug Report Template

To log a new bug, append a entry using the following template:

### BUG-XXX: [Short Description]
- **Date**: YYYY-MM-DD
- **Module**: [e.g., Auth, Finance, Student, Teacher, System]
- **Severity**: [CRITICAL / HIGH / MEDIUM / LOW]
- **Status**: OPEN
- **Assigned Developer**: [Name / Unassigned]
- **Description**: Detailed description of the problem.
- **Steps To Reproduce**:
  1. Go to '...'
  2. Click on '...'
  3. Scroll down to '...'
  4. See error
- **Expected Result**: What should have happened.
- **Actual Result**: What actually happened (include error messages/screenshots if possible).
- **Resolution Notes**: (To be filled in by developer upon fix)
