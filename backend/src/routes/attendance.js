import express from 'express'
import {
  markAttendance,
  getStudentAttendance,
  getClassAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceAnalytics
} from '../controllers/attendanceController.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

router.use(protect)

// Analytics (Admin/Principal only)
router.get('/analytics', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'), getAttendanceAnalytics)

// Mark attendance (Teacher/Admin)
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), markAttendance)

// Class attendance (Teacher/Admin)
router.get('/class/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), getClassAttendance)

// Student attendance (Student/Parent/Teacher/Admin)
router.get('/student/:id', getStudentAttendance)

// Update/Delete (Teacher/Admin)
router.route('/:id')
  .put(requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), updateAttendance)
  .delete(requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'), deleteAttendance)

export default router
