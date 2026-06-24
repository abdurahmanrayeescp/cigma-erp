import express from 'express'
import { Parent } from '../models/index.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

// GET /api/parents/me — returns the current parent's profile with populated children
router.get('/me', async (req, res) => {
  try {
    if (req.user.role !== 'PARENT') {
      return res.status(403).json({ success: false, message: 'Not a parent account' })
    }
    const parent = await Parent.findOne({ userId: req.user.id })
      .populate('children', '_id name admissionNo class division gender studentId')
    if (!parent) return res.status(404).json({ success: false, message: 'Parent profile not found' })
    res.json({ success: true, data: parent })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
