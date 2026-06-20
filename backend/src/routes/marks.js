import express from 'express'
import {
  uploadMarks,
  editMark,
  getStudentMarks,
  getClassMarks,
  getMarksAnalytics,
  generateMarksheetPDF
} from '../controllers/marksController.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

router.use(protect)

// Analytics (Admin/Principal only)
router.get('/analytics', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'), getMarksAnalytics)

// Generate PDF Marksheet (Admin/Principal/Teacher)
router.get('/pdf', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), generateMarksheetPDF)

// Bulk upload marks (Teacher/Admin)
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), uploadMarks)

// Class marks (Teacher/Admin)
router.get('/class/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), getClassMarks)

// Student marks (Student/Parent/Teacher/Admin)
router.get('/student/:id', getStudentMarks)

// Edit individual mark (Teacher/Admin)
router.put('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), editMark)

export default router
