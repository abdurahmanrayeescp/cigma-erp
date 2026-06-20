import { Audit } from '../models/index.js'

export const getAuditLogs = async (req, res) => {
  try {
    const { resource, action, limit = 50, page = 1 } = req.query
    
    const query = {}
    if (resource) query.resource = resource
    if (action) query.action = action

    const logs = await Audit.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'name role email')

    const total = await Audit.countDocuments(query)

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
