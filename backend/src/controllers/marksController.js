import { Marks, Student, Class } from '../models/index.js'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { analyzeMarks } from '../services/aiAnalyzer.js'

// Helper to calculate grade
const calculateGrade = (obtained, max) => {
  const percentage = (obtained / max) * 100
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B+'
  if (percentage >= 60) return 'B'
  if (percentage >= 50) return 'C+'
  if (percentage >= 40) return 'C'
  return 'D'
}

export const uploadMarks = async (req, res) => {
  try {
    const { classId, subject, exam, academicYear, records } = req.body
    // records = [{ studentId, marksObtained, maxMarks }]
    
    if (!classId || !subject || !exam || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' })
    }

    const operations = records.map(record => {
      const grade = calculateGrade(record.marksObtained, record.maxMarks)
      return {
        updateOne: {
          filter: { student: record.studentId, class: classId, subject, exam, academicYear },
          update: {
            $set: {
              student: record.studentId,
              class: classId,
              subject,
              exam,
              marksObtained: record.marksObtained,
              maxMarks: record.maxMarks,
              grade,
              academicYear,
              enteredBy: req.user._id
            }
          },
          upsert: true
        }
      }
    })

    await Marks.bulkWrite(operations)

    res.json({ success: true, message: 'Marks uploaded successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const editMark = async (req, res) => {
  try {
    const { id } = req.params
    const { marksObtained, maxMarks } = req.body

    const grade = calculateGrade(marksObtained, maxMarks)

    const record = await Marks.findByIdAndUpdate(
      id,
      { marksObtained, maxMarks, grade },
      { new: true }
    )

    if (!record) {
      return res.status(404).json({ success: false, message: 'Mark record not found' })
    }

    res.json({ success: true, data: record })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getStudentMarks = async (req, res) => {
  try {
    const { id } = req.params
    const { exam, academicYear } = req.query

    const query = { student: id }
    if (exam) query.exam = exam
    if (academicYear) query.academicYear = academicYear

    const records = await Marks.find(query).sort({ subject: 1 }).populate('student', 'name')
    
    // AI Insight
    let insight = null
    if (records.length > 0 && (req.user.role === 'TEACHER' || req.user.role === 'PARENT' || req.user.role === 'SUPER_ADMIN')) {
      const studentName = records[0]?.student?.name || 'The student'
      insight = analyzeMarks(studentName, records)
    }

    res.json({ success: true, data: records, insight })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getClassMarks = async (req, res) => {
  try {
    const { id } = req.params // classId
    const { subject, exam, academicYear } = req.query

    const query = { class: id }
    if (subject) query.subject = subject
    if (exam) query.exam = exam
    if (academicYear) query.academicYear = academicYear

    const records = await Marks.find(query).populate('student', 'name admissionNo')
    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getMarksAnalytics = async (req, res) => {
  try {
    // Basic analytics: Average marks by subject
    const subjectAverages = await Marks.aggregate([
      {
        $group: {
          _id: '$subject',
          avgMarks: { $avg: '$marksObtained' },
          maxMarks: { $first: '$maxMarks' }
        }
      },
      {
        $project: {
          subject: '$_id',
          averagePercentage: { $round: [{ $multiply: [{ $divide: ['$avgMarks', '$maxMarks'] }, 100] }, 2] }
        }
      }
    ])

    res.json({ success: true, data: { subjectAverages } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const generateMarksheetPDF = async (req, res) => {
  try {
    const { studentId, exam, academicYear } = req.query
    
    if (!studentId || !exam) {
      return res.status(400).json({ success: false, message: 'Student ID and Exam are required' })
    }

    const student = await Student.findById(studentId).populate('class')
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' })

    const marks = await Marks.find({ student: studentId, exam, academicYear: academicYear || '2025-2026' })
    
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    const { width, height } = page.getSize()

    // Header
    page.drawText('CIGMA INTERNATIONAL SCHOOL', {
      x: 140, y: height - 60, size: 20, font: helveticaBold, color: rgb(0.55, 0.23, 0.23) // Maroon
    })
    page.drawText(`MARKSHEET - ${exam.toUpperCase()}`, {
      x: 210, y: height - 90, size: 14, font: helveticaBold
    })

    // Student Details
    page.drawText(`Name: ${student.name}`, { x: 50, y: height - 140, size: 12, font: helveticaFont })
    page.drawText(`Admission No: ${student.admissionNo}`, { x: 50, y: height - 160, size: 12, font: helveticaFont })
    page.drawText(`Class: ${student.class}`, { x: 350, y: height - 140, size: 12, font: helveticaFont })
    page.drawText(`Academic Year: ${academicYear || '2025-2026'}`, { x: 350, y: height - 160, size: 12, font: helveticaFont })

    // Marks Table Header
    let yOffset = height - 210
    page.drawLine({ start: { x: 50, y: yOffset + 15 }, end: { x: 550, y: yOffset + 15 }, thickness: 1 })
    page.drawText('Subject', { x: 60, y: yOffset, size: 12, font: helveticaBold })
    page.drawText('Max Marks', { x: 250, y: yOffset, size: 12, font: helveticaBold })
    page.drawText('Obtained', { x: 350, y: yOffset, size: 12, font: helveticaBold })
    page.drawText('Grade', { x: 450, y: yOffset, size: 12, font: helveticaBold })
    page.drawLine({ start: { x: 50, y: yOffset - 10 }, end: { x: 550, y: yOffset - 10 }, thickness: 1 })

    // Marks Rows
    yOffset -= 35
    let totalObtained = 0
    let totalMax = 0

    marks.forEach(mark => {
      page.drawText(mark.subject, { x: 60, y: yOffset, size: 11, font: helveticaFont })
      page.drawText(mark.maxMarks.toString(), { x: 265, y: yOffset, size: 11, font: helveticaFont })
      page.drawText(mark.marksObtained.toString(), { x: 365, y: yOffset, size: 11, font: helveticaFont })
      page.drawText(mark.grade, { x: 460, y: yOffset, size: 11, font: helveticaBold })
      
      totalObtained += mark.marksObtained
      totalMax += mark.maxMarks
      yOffset -= 25
    })

    // Totals
    page.drawLine({ start: { x: 50, y: yOffset + 10 }, end: { x: 550, y: yOffset + 10 }, thickness: 1 })
    page.drawText('TOTAL', { x: 60, y: yOffset - 10, size: 12, font: helveticaBold })
    page.drawText(totalMax.toString(), { x: 265, y: yOffset - 10, size: 12, font: helveticaBold })
    page.drawText(totalObtained.toString(), { x: 365, y: yOffset - 10, size: 12, font: helveticaBold })
    page.drawText(calculateGrade(totalObtained, totalMax), { x: 460, y: yOffset - 10, size: 12, font: helveticaBold })

    // Signatures
    page.drawText('Class Teacher', { x: 80, y: 100, size: 12, font: helveticaBold })
    page.drawText('Principal', { x: 430, y: 100, size: 12, font: helveticaBold })

    const pdfBytes = await pdfDoc.save()
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=marksheet_${student.admissionNo}.pdf`)
    res.send(Buffer.from(pdfBytes))

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
