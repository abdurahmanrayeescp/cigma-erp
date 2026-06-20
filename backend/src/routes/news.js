import express from 'express'
import { NewsEvent } from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/authorize.js'

const router = express.Router()

const cap = (n, max = 50) => Math.min(Math.max(Number(n) || 10, 1), max)

// GET /api/news — public, paginated
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query
    const filter = { isPublished: true }
    if (category) filter.category = category

    const l = cap(limit)
    const p = Math.max(Number(page) || 1, 1)
    const total = await NewsEvent.countDocuments(filter)
    const news = await NewsEvent.find(filter)
      .sort({ publishDate: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .select('-__v')

    res.json({ success: true, data: news, total, page: p, pages: Math.ceil(total / l) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/news/:id — single published article
router.get('/:id', async (req, res) => {
  try {
    const article = await NewsEvent.findOne({ _id: req.params.id, isPublished: true })
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' })
    res.json({ success: true, data: article })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/news — admin: create article
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, body, category, imageUrl, pdfUrl, publishDate, isPublished } = req.body
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required' })
    }
    const article = await NewsEvent.create({
      title, body, category, imageUrl, pdfUrl, publishDate, isPublished,
      author: req.user.id,
    })
    res.status(201).json({ success: true, data: article })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/news/:id — admin: update (whitelisted fields only)
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, body, category, imageUrl, pdfUrl, publishDate, isPublished } = req.body
    const update = {}
    if (title       !== undefined) update.title       = title
    if (body        !== undefined) update.body        = body
    if (category    !== undefined) update.category    = category
    if (imageUrl    !== undefined) update.imageUrl    = imageUrl
    if (pdfUrl      !== undefined) update.pdfUrl      = pdfUrl
    if (publishDate !== undefined) update.publishDate = publishDate
    if (isPublished !== undefined) update.isPublished = isPublished

    const article = await NewsEvent.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' })
    res.json({ success: true, data: article })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE /api/news/:id — admin: delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const article = await NewsEvent.findByIdAndDelete(req.params.id)
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' })
    res.json({ success: true, message: 'Article deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
