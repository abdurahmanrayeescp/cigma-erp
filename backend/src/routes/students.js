import express from 'express'
import { Student } from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

// GET /api/students
// Only ADMIN, SUPER_ADMIN, and TEACHER can see all students
router.get('/', protect, requireRole(['SUPER_ADMIN', 'ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const students = await Student.find()
      .populate('parentId')
      .populate('userId', 'email name isActive')
      .sort({ name: 1 })
    res.json({ success: true, data: students })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('parentId')
      .populate('userId', 'email name isActive')
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' })
    }
    res.json({ success: true, data: student })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
