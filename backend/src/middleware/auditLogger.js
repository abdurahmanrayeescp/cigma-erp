import { Audit } from '../models/index.js'

export const auditLogger = (action, resource) => async (req, res, next) => {
  // We capture the original send method to log response status
  const originalSend = res.send

  res.send = function (body) {
    res.send = originalSend
    const response = res.send(body)

    // Log the action asynchronously after sending the response
    if (req.user) {
      const details = {
        method: req.method,
        url: req.originalUrl,
        body: req.body, // In production, filter out sensitive data like passwords
        statusCode: res.statusCode
      }

      // Filter out passwords
      if (details.body && details.body.password) {
        details.body.password = '[REDACTED]'
      }

      Audit.create({
        userId: req.user._id,
        action,
        resource,
        details,
        ipAddress: req.ip || req.connection.remoteAddress
      }).catch(err => console.error('Audit Log Error:', err))
    }

    return response
  }

  next()
}
