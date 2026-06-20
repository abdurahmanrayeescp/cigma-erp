import express from 'express'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'
import { getBooks, createBook, issueBook, returnBook, getStudentBooks } from '../controllers/libraryController.js'

const router = express.Router()

router.use(protect)

// View Catalog (Students, Parents, Teachers, Admins)
router.get('/', getBooks)

// Student specific books
router.get('/student/:studentId', getStudentBooks)

// Admin / Librarian only operations
router.post('/', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'), createBook)
router.post('/:id/issue', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'), issueBook)
router.post('/:id/return', requireRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'), returnBook)

export default router
