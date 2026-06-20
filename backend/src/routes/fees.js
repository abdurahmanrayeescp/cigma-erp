import express from 'express'
import { getStudentFees, getAllFees, generateReceiptPDF } from '../controllers/feesController.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

router.use(protect)

// Admin views all fees
router.get('/all', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'), getAllFees)

// Get specific student fees (Parent/Student/Admin)
router.get('/student/:studentId', getStudentFees)

// Download receipt
router.get('/receipt/:feeId/:paymentId', generateReceiptPDF)

export default router
