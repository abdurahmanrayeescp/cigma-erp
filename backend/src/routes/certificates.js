import express from 'express'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { generateTransferCertificate, generateBonafideCertificate } from '../controllers/certificateController.js'

const router = express.Router()

// Admin routes to generate certificates
router.post('/tc', protect, requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'), generateTransferCertificate)
router.post('/bonafide', protect, requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'), generateBonafideCertificate)

export default router
