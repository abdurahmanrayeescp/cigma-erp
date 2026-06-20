import { Student, Attendance, Marks, Fee } from '../models/index.js'
import { Parser } from 'json2csv'

export const downloadStudentsReport = async (req, res) => {
  try {
    const students = await Student.find().populate('class')
    
    const data = students.map(s => ({
      'Admission No': s.admissionNo,
      'Name': s.name,
      'Email': s.email,
      'Role': s.role,
      'Class': s.class ? s.class.className : 'N/A',
      'Gender': s.gender || 'N/A',
      'Date of Birth': s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : 'N/A'
    }))

    const parser = new Parser()
    const csv = parser.parse(data)

    res.header('Content-Type', 'text/csv')
    res.attachment('students_report.csv')
    return res.send(csv)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const downloadAttendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('student', 'name admissionNo').populate('class', 'className')
    
    const data = attendance.map(a => ({
      'Date': new Date(a.date).toLocaleDateString(),
      'Admission No': a.student ? a.student.admissionNo : 'N/A',
      'Student Name': a.student ? a.student.name : 'N/A',
      'Class': a.class ? a.class.className : 'N/A',
      'Status': a.status.toUpperCase(),
      'Remarks': a.remarks || ''
    }))

    const parser = new Parser()
    const csv = parser.parse(data)

    res.header('Content-Type', 'text/csv')
    res.attachment('attendance_report.csv')
    return res.send(csv)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const downloadFeesReport = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student', 'name admissionNo').populate('class', 'className')
    
    const data = fees.map(f => ({
      'Receipt No': f._id.toString(),
      'Date': new Date(f.createdAt).toLocaleDateString(),
      'Admission No': f.student ? f.student.admissionNo : 'N/A',
      'Student Name': f.student ? f.student.name : 'N/A',
      'Class': f.class ? f.class.className : 'N/A',
      'Total Amount': f.totalAmount,
      'Paid Amount': f.paidAmount,
      'Status': f.status.toUpperCase()
    }))

    const parser = new Parser()
    const csv = parser.parse(data)

    res.header('Content-Type', 'text/csv')
    res.attachment('fees_report.csv')
    return res.send(csv)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
