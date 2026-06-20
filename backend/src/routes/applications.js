import express from 'express'
import { Application } from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { adminOnly, staffOrAbove } from '../middleware/authorize.js'

const router = express.Router()

const cap = (n, max = 100) => Math.min(Math.max(Number(n) || 20, 1), max)

const VALID_STATUSES = ['received', 'reviewed', 'shortlisted', 'rejected', 'hired']

// POST /api/applications — public: submit a job application
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, position, qualification, experience, coverLetter, cvUrl } = req.body
    if (!name || !email || !phone || !position) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and position are required' })
    }
    const application = await Application.create({
      name, email, phone, position, qualification, experience, coverLetter, cvUrl,
    })
    res.status(201).json({
      success: true,
      message: 'Application received. We will review it and contact you within 5–7 working days.',
      data: application._id,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/applications — staff/admin: list applications
router.get('/', protect, staffOrAbove, async (req, res) => {
  try {
    const { status, position, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status)   filter.status   = status
    if (position) filter.position = { $regex: position, $options: 'i' }

    const l = cap(limit)
    const p = Math.max(Number(page) || 1, 1)
    const total = await Application.countDocuments(filter)
    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .select('-__v')

    res.json({ success: true, data: applications, total, page: p, pages: Math.ceil(total / l) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/applications/:id — staff/admin: single detail
router.get('/:id', protect, staffOrAbove, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
    res.json({ success: true, data: application })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/applications/:id — staff/admin: update status only (whitelisted)
router.patch('/:id', protect, staffOrAbove, async (req, res) => {
  try {
    const { status } = req.body
    if (!status) {
      return res.status(400).json({ success: false, message: '`status` field is required' })
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` })
    }
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },           // whitelist — only status is patchable
      { new: true, runValidators: true }
    )
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
    res.json({ success: true, data: application })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE /api/applications/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id)
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
    res.json({ success: true, message: 'Application deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
