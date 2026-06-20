import express from 'express'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { downloadStudentsReport, downloadAttendanceReport, downloadFeesReport } from '../controllers/reportController.js'

const router = express.Router()

// All reports are restricted to Administrative staff
router.use(protect, requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'))

router.get('/students', downloadStudentsReport)
router.get('/attendance', downloadAttendanceReport)
router.get('/fees', downloadFeesReport)

export default router
