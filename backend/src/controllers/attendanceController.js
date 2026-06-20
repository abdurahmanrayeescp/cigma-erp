import { Attendance, Student, Class } from '../models/index.js'
import mongoose from 'mongoose'
import { analyzeAttendance } from '../services/aiAnalyzer.js'

// Mark bulk attendance for a class
export const markAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body
    // records = [{ studentId, status, remarks }]
    
    if (!classId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' })
    }

    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    const operations = records.map(record => ({
      updateOne: {
        filter: { student: record.studentId, date: attendanceDate },
        update: {
          $set: {
            student: record.studentId,
            class: classId,
            date: attendanceDate,
            status: record.status.toLowerCase(),
            remarks: record.remarks || '',
            markedBy: req.user._id
          }
        },
        upsert: true
      }
    }))

    await Attendance.bulkWrite(operations)

    res.json({ success: true, message: 'Attendance marked successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params // student ObjectId
    const { month, year } = req.query

    const query = { student: id }
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      query.date = { $gte: startDate, $lte: endDate }
    }

    const records = await Attendance.find(query).sort({ date: -1 })
    
    // Calculate percentage
    const total = records.length
    const present = records.filter(r => r.status === 'present').length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    
    // AI Insight
    let insight = null
    if (req.user.role === 'TEACHER' || req.user.role === 'PARENT' || req.user.role === 'SUPER_ADMIN') {
      const studentName = records[0]?.student?.name || 'The student'
      const recentAbsences = records.slice(0, 5).filter(r => r.status === 'absent').length
      insight = analyzeAttendance(studentName, percentage, recentAbsences)
    }

    res.json({
      success: true,
      data: { records, summary: { total, present, percentage, insight } }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getClassAttendance = async (req, res) => {
  try {
    const { id } = req.params // class ObjectId
    const { date } = req.query

    const attendanceDate = date ? new Date(date) : new Date()
    attendanceDate.setHours(0, 0, 0, 0)
    const nextDate = new Date(attendanceDate)
    nextDate.setDate(nextDate.getDate() + 1)

    const records = await Attendance.find({
      class: id,
      date: { $gte: attendanceDate, $lt: nextDate }
    }).populate('student', 'name admissionNo')

    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params
    const { status, remarks } = req.body

    const record = await Attendance.findByIdAndUpdate(
      id,
      { status: status.toLowerCase(), remarks },
      { new: true }
    )

    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' })
    }

    res.json({ success: true, data: record })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params
    await Attendance.findByIdAndDelete(id)
    res.json({ success: true, message: 'Record deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Admin Analytics & AI Insights
export const getAttendanceAnalytics = async (req, res) => {
  try {
    // 1. Overall today's stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayStats = await Attendance.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    // 2. Class-wise attendance for today
    const classStats = await Attendance.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      {
        $group: {
          _id: '$class',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classDetails'
        }
      },
      { $unwind: '$classDetails' },
      {
        $project: {
          className: '$classDetails.className',
          division: '$classDetails.division',
          percentage: { $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 0] }
        }
      }
    ])

    // 3. AI Insights (Students below 80%)
    // Aggregate overall attendance per student
    const studentOverall = await Attendance.aggregate([
      {
        $group: {
          _id: '$student',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
        }
      },
      {
        $project: {
          studentId: '$_id',
          percentage: { $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 0] }
        }
      },
      { $match: { percentage: { $lt: 80 } } },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      { $unwind: '$studentDetails' }
    ])

    const insights = studentOverall.map(s => 
      `${s.studentDetails.name} (${s.studentDetails.admissionNo}) is at ${s.percentage}% attendance. Warning required.`
    )
    if (insights.length === 0) insights.push("All students are maintaining good attendance above 80%.")

    res.json({
      success: true,
      data: {
        todayStats,
        classStats,
        insights
      }
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
