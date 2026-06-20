import express from 'express'
import { assignHomework, getClassHomework, deleteHomework } from '../controllers/homeworkController.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

router.use(protect)

// Assign homework (Teacher/Admin)
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), assignHomework)

// Get class homework (All roles)
router.get('/class/:id', getClassHomework)

// Delete homework (Teacher/Admin)
router.delete('/:id', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'TEACHER'), deleteHomework)

export default router
