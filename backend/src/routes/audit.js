import express from 'express'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { getAuditLogs } from '../controllers/auditController.js'

const router = express.Router()

router.use(protect, requireRole('SUPER_ADMIN', 'ADMIN'))

router.get('/', getAuditLogs)

export default router
