import express from 'express'
import { Download } from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/authorize.js'

const router = express.Router()

const cap = (n, max = 100) => Math.min(Math.max(Number(n) || 50, 1), max)

// GET /api/downloads — public: list active downloads, filterable by category
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 50 } = req.query
    const filter = { isActive: true }
    if (category) filter.category = category

    const l = cap(limit)
    const p = Math.max(Number(page) || 1, 1)
    const total = await Download.countDocuments(filter)
    const downloads = await Download.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .select('-__v -publicId')

    res.json({ success: true, data: downloads, total, page: p, pages: Math.ceil(total / l) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/downloads/:id — single file (increments download count)
router.get('/:id', async (req, res) => {
  try {
    const file = await Download.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { $inc: { downloadCount: 1 } },
      { new: true }
    ).select('-__v -publicId')
    if (!file) return res.status(404).json({ success: false, message: 'File not found' })
    res.json({ success: true, data: file })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/downloads — admin: add a downloadable file
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, category, fileUrl, publicId, fileSize } = req.body
    if (!title || !category || !fileUrl) {
      return res.status(400).json({ success: false, message: 'Title, category, and fileUrl are required' })
    }
    const file = await Download.create({
      title, category, fileUrl, publicId, fileSize,
      uploadedBy: req.user.id,
    })
    res.status(201).json({ success: true, data: file })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/downloads/:id — admin: update metadata or toggle active (whitelisted fields)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, category, fileUrl, fileSize, isActive } = req.body
    const update = {}
    if (title    !== undefined) update.title    = title
    if (category !== undefined) update.category = category
    if (fileUrl  !== undefined) update.fileUrl  = fileUrl
    if (fileSize !== undefined) update.fileSize = fileSize
    if (isActive !== undefined) update.isActive = isActive

    const file = await Download.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!file) return res.status(404).json({ success: false, message: 'File not found' })
    res.json({ success: true, data: file })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE /api/downloads/:id — admin: hard delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const file = await Download.findByIdAndDelete(req.params.id)
    if (!file) return res.status(404).json({ success: false, message: 'File not found' })
    res.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
