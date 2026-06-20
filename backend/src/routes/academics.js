import express from 'express'
import { Class, Subject } from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

// GET /api/academics/classes
router.get('/classes', protect, requireRole(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher', 'name employeeId')
      .sort({ className: 1, division: 1 })
    res.json({ success: true, data: classes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/academics/subjects
router.get('/subjects', protect, async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 })
    res.json({ success: true, data: subjects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
