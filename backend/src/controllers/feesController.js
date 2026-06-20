import { Fee, Student } from '../models/index.js'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export const getStudentFees = async (req, res) => {
  try {
    const { studentId } = req.params

    const fees = await Fee.find({ student: studentId }).sort({ dueDate: 1 })
    res.json({ success: true, data: fees })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student', 'name admissionNo class').sort({ dueDate: 1 })
    res.json({ success: true, data: fees })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const generateReceiptPDF = async (req, res) => {
  try {
    const { feeId, paymentId } = req.params

    const fee = await Fee.findById(feeId).populate('student')
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' })

    const payment = fee.paymentHistory.find(p => p._id.toString() === paymentId)
    if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' })

    const student = fee.student

    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 400])
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const { height } = page.getSize()

    page.drawText('CIGMA INTERNATIONAL SCHOOL', {
      x: 150, y: height - 50, size: 18, font: boldFont, color: rgb(0.55, 0.23, 0.23)
    })
    page.drawText('FEE RECEIPT', {
      x: 250, y: height - 80, size: 14, font: boldFont
    })

    page.drawText(`Receipt No: ${payment._id.toString().slice(-6).toUpperCase()}`, { x: 50, y: height - 120, size: 12, font })
    page.drawText(`Date: ${new Date(payment.date).toLocaleDateString()}`, { x: 400, y: height - 120, size: 12, font })

    page.drawText(`Student Name: ${student.name}`, { x: 50, y: height - 150, size: 12, font })
    page.drawText(`Admission No: ${student.admissionNo}`, { x: 400, y: height - 150, size: 12, font })
    page.drawText(`Academic Year: ${fee.academicYear}`, { x: 50, y: height - 180, size: 12, font })

    page.drawLine({ start: { x: 50, y: height - 200 }, end: { x: 550, y: height - 200 }, thickness: 1 })

    page.drawText('Description', { x: 60, y: height - 220, size: 12, font: boldFont })
    page.drawText('Amount (INR)', { x: 450, y: height - 220, size: 12, font: boldFont })

    page.drawLine({ start: { x: 50, y: height - 235 }, end: { x: 550, y: height - 235 }, thickness: 1 })

    page.drawText('Tuition Fee Installment', { x: 60, y: height - 260, size: 12, font })
    page.drawText(`Rs. ${payment.amount.toLocaleString()}`, { x: 450, y: height - 260, size: 12, font })

    page.drawLine({ start: { x: 50, y: height - 280 }, end: { x: 550, y: height - 280 }, thickness: 1 })

    page.drawText(`Payment Method: ${payment.method || 'Online'}`, { x: 50, y: height - 320, size: 10, font })
    page.drawText('Authorized Signature', { x: 420, y: height - 340, size: 10, font: boldFont })

    const pdfBytes = await pdfDoc.save()
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${payment._id}.pdf`)
    res.send(Buffer.from(pdfBytes))

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
