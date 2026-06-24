import express from 'express'
import { getStudentFees, getAllFees, generateReceiptPDF } from '../controllers/feesController.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { Fee, Student, Parent } from '../models/index.js'

const router = express.Router()

router.use(protect)

// Admin views all fees
router.get('/all', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'), getAllFees)

// Student: get own fees by resolving their Student profile from userId
router.get('/my', async (req, res) => {
  try {
    let studentId = null
    if (req.user.role === 'STUDENT') {
      const student = await Student.findOne({ userId: req.user.id }).select('_id')
      studentId = student?._id
    } else if (req.user.role === 'PARENT') {
      // Parents see fees for their first child; frontend can call /fees/student/:id for specific child
      const parent = await Parent.findOne({ userId: req.user.id }).populate('children', '_id')
      studentId = parent?.children?.[0]?._id
    }
    if (!studentId) return res.json({ success: true, data: [] })
    const fees = await Fee.find({ student: studentId }).sort({ dueDate: 1 })
    res.json({ success: true, data: fees })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get specific student fees (Parent/Student/Admin)
router.get('/student/:studentId', getStudentFees)

// Download receipt
router.get('/receipt/:feeId/:paymentId', generateReceiptPDF)

export default router
