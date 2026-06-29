import express from 'express'
import { Inquiry } from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { staffOrAbove } from '../middleware/authorize.js'

const router = express.Router()

const cap = (n, max = 100) => Math.min(Math.max(Number(n) || 20, 1), max)

// POST /api/inquiries — public: submit admission or contact inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, parentName, grade, subject, message, type } = req.body
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' })
    }
    const inquiry = await Inquiry.create({
      name, email, phone, parentName, grade, subject, message,
      type: type || 'general',
    })
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will contact you soon.',
      data: inquiry._id,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/inquiries — staff/admin: list inquiries
router.get('/', protect, staffOrAbove, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (type)   filter.type   = type

    const l = cap(limit)
    const p = Math.max(Number(page) || 1, 1)
    const total = await Inquiry.countDocuments(filter)
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)

    res.json({ success: true, data: inquiries, total, page: p, pages: Math.ceil(total / l) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/inquiries/:id — staff/admin: update status/notes (whitelisted fields)
router.patch('/:id', protect, staffOrAbove, async (req, res) => {
  try {
    const { status, notes } = req.body
    const allowed = ['new', 'contacted', 'resolved']
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' })
    }
    const update = {}
    if (status !== undefined) update.status = status
    if (notes  !== undefined) update.notes  = notes

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' })
    res.json({ success: true, data: inquiry })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE /api/inquiries/:id — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id)
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' })
    res.json({ success: true, message: 'Inquiry deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
