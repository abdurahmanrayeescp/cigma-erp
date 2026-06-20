import express from 'express'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { getPayrollRecords, generatePayroll, processPayment, getTeacherPayslips } from '../controllers/payrollController.js'

const router = express.Router()

router.use(protect)

// Admin only operations
router.get('/', requireRole('SUPER_ADMIN', 'ADMIN'), getPayrollRecords)
router.post('/generate', requireRole('SUPER_ADMIN', 'ADMIN'), generatePayroll)
router.post('/:id/pay', requireRole('SUPER_ADMIN', 'ADMIN'), processPayment)

// Teacher access
router.get('/teacher/:employeeId', requireRole('TEACHER'), getTeacherPayslips)

export default router
