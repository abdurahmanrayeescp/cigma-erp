import express from 'express'
import { createTimetable, getClassTimetable, getTeacherTimetable, deleteTimetable } from '../controllers/timetableController.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

router.use(protect)

// Admin operations
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'), createTimetable)
router.delete('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'), deleteTimetable)

// Read operations
router.get('/class/:classId', getClassTimetable)
router.get('/teacher/:teacherId', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), getTeacherTimetable)

export default router
