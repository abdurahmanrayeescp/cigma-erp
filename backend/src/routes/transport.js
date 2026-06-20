import express from 'express'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { getRoutes, createRoute, assignStudentToRoute, removeStudentFromRoute } from '../controllers/transportController.js'

const router = express.Router()

router.use(protect)

router.get('/', getRoutes)

// Admin/Office Staff only operations
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'), createRoute)
router.post('/assign', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'), assignStudentToRoute)
router.post('/remove', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'), removeStudentFromRoute)

export default router
