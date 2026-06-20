import express from 'express'
import { createNotification, getNotifications, markAsRead } from '../controllers/notificationController.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

router.use(protect)

// Admin operations
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL'), createNotification)

// User operations
router.get('/', getNotifications)
router.put('/:id/read', markAsRead)

export default router
