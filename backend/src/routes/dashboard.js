import express from 'express'
import {
  Student, Teacher, Parent, Inquiry, Attendance, Fee, Marks,
} from '../models/index.js'
import { protect } from '../middleware/auth.js'
import { adminOnly } from '../middleware/authorize.js'

const router = express.Router()

// GET /api/dashboard/admin/stats
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ status: 'active' })
    const totalTeachers = await Teacher.countDocuments({ isActive: true })
    const totalParents = await Parent.countDocuments()
    
    // Total Fees Collected vs Pending
    const fees = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$paidAmount' },
          totalPending: { $sum: '$pendingAmount' }
        }
      }
    ])
    const feeStats = fees[0] || { totalCollected: 0, totalPending: 0 }

    // Today's Attendance Stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAttendance = await Attendance.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const attendanceStats = {
      present: todayAttendance.find(a => a._id === 'present')?.count || 0,
      absent: todayAttendance.find(a => a._id === 'absent')?.count || 0,
    }

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalParents,
        fees: feeStats,
        attendanceToday: attendanceStats
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
