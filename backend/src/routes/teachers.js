import express from 'express'
import { Teacher, Class, Student } from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

// GET /api/teachers
router.get('/', protect, requireRole(['SUPER_ADMIN', 'ADMIN']), async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('subjects')
      .populate('userId', 'email name isActive')
      .sort({ name: 1 })
    res.json({ success: true, data: teachers })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/teachers/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('subjects')
      .populate('userId', 'email name isActive')
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' })
    }
    res.json({ success: true, data: teacher })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/teachers/my-classes
router.get('/my-classes', protect, requireRole(['TEACHER']), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id })
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' })
    }

    // Find classes where teacher is the class teacher
    const myClasses = await Class.find({ classTeacher: teacher._id })
      .populate('classTeacher', 'name')
      .sort({ className: 1, division: 1 })

    // Find all other classes in case they teach there
    const allClasses = await Class.find()
      .populate('classTeacher', 'name')
      .sort({ className: 1, division: 1 })

    res.json({ 
      success: true, 
      data: {
        myClasses,
        allClasses
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/teachers/class-students/:classId
router.get('/class-students/:classId', protect, requireRole(['TEACHER']), async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.classId)
      .populate({
        path: 'students',
        populate: {
          path: 'parentId'
        }
      })
    
    if (!classObj) {
      return res.status(404).json({ success: false, message: 'Class not found' })
    }

    res.json({ success: true, data: classObj.students })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})


export default router
