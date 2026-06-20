import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * protect — verifies JWT access token from Authorization header.
 * Attaches req.user = { id, role } on success.
 */
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authenticated. Please log in.' })
    }

    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in.'
      return res.status(401).json({ success: false, message })
    }

    // Confirm user still exists and is active
    const user = await User.findById(decoded.userId).select('role isActive passwordChangedAt')
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User account not found or disabled.' })
    }

    // Reject token issued before last password change
    if (user.passwordChangedAt) {
      const changedAt = Math.floor(user.passwordChangedAt.getTime() / 1000)
      if (decoded.iat < changedAt) {
        return res.status(401).json({ success: false, message: 'Password was recently changed. Please log in again.' })
      }
    }

    req.user = { id: decoded.userId, role: user.role }
    next()
  } catch (err) {
    res.status(500).json({ success: false, message: 'Auth middleware error.', error: err.message })
  }
}

/**
 * requireRole — RBAC middleware factory.
 * Pass one or more roles to restrict the route.
 * Example: requireRole('ADMIN', 'PRINCIPAL')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' })
    }
    next()
  }
}
