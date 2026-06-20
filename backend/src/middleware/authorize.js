/**
 * requireRole — role-based authorization guard.
 * Must be used AFTER protect().
 *
 * Usage:
 *   router.post('/', protect, requireRole('ADMIN', 'PRINCIPAL'), handler)
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' })
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`,
      })
    }
    next()
  }
}

// Convenience shorthands
export const adminOnly    = requireRole('SUPER_ADMIN', 'ADMIN')
export const staffOrAbove = requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF')
export const teacherOrAbove = requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'TEACHER')
