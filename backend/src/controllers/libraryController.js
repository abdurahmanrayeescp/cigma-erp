import { Book, Student } from '../models/index.js'

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('issuedTo', 'name admissionNo')
    res.json({ success: true, data: books })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category } = req.body
    const book = new Book({
      title, author, isbn, category, addedBy: req.user._id
    })
    await book.save()
    res.status(201).json({ success: true, data: book })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const issueBook = async (req, res) => {
  try {
    const { id } = req.params // Book ID
    const { studentId, dueDate } = req.body

    const book = await Book.findById(id)
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' })
    if (book.status !== 'available') return res.status(400).json({ success: false, message: 'Book is not available' })

    const student = await Student.findById(studentId)
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' })

    book.status = 'issued'
    book.issuedTo = studentId
    book.issueDate = new Date()
    book.dueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Default 14 days

    await book.save()
    res.json({ success: true, data: book })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const returnBook = async (req, res) => {
  try {
    const { id } = req.params // Book ID

    const book = await Book.findById(id)
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' })
    if (book.status !== 'issued') return res.status(400).json({ success: false, message: 'Book is not currently issued' })

    book.status = 'available'
    book.issuedTo = null
    book.issueDate = null
    book.dueDate = null

    await book.save()
    res.json({ success: true, data: book })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getStudentBooks = async (req, res) => {
  try {
    const studentId = req.params.studentId
    const books = await Book.find({ issuedTo: studentId })
    res.json({ success: true, data: books })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
