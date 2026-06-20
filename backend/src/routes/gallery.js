import express from 'express'
import { GalleryItem } from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/authorize.js'

const router = express.Router()

const cap = (n, max = 100) => Math.min(Math.max(Number(n) || 20, 1), max)

// GET /api/gallery — public, paginated, filterable by category
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query
    const filter = {}
    if (category) filter.category = category

    const l = cap(limit)
    const p = Math.max(Number(page) || 1, 1)
    const total = await GalleryItem.countDocuments(filter)
    const items = await GalleryItem.find(filter)
      .sort({ date: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .select('-__v')

    res.json({ success: true, data: items, total, page: p, pages: Math.ceil(total / l) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/gallery/categories — list distinct categories with counts (must be before /:id)
router.get('/categories', async (req, res) => {
  try {
    const categories = await GalleryItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    res.json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/gallery/:id — single item
router.get('/:id', async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' })
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/gallery — admin: add gallery item
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { url, publicId, caption, category, date } = req.body
    if (!url || !category) {
      return res.status(400).json({ success: false, message: 'URL and category are required' })
    }
    const item = await GalleryItem.create({
      url, publicId, caption, category, date,
      uploadedBy: req.user.id,
    })
    res.status(201).json({ success: true, data: item })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE /api/gallery/:id — admin: remove item
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' })
    res.json({ success: true, message: 'Gallery item deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
