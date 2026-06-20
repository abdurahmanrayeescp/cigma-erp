import { Student } from '../models/index.js'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

// Generate Transfer Certificate
export const generateTransferCertificate = async (req, res) => {
  try {
    const { studentId, reason, dateOfLeaving } = req.body
    
    const student = await Student.findById(studentId).populate('class')
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' })

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const { height } = page.getSize()

    page.drawText('CIGMA INTERNATIONAL SCHOOL', {
      x: 140, y: height - 80, size: 22, font: helveticaBold, color: rgb(0.55, 0.23, 0.23)
    })
    page.drawText('TRANSFER CERTIFICATE', {
      x: 200, y: height - 120, size: 16, font: helveticaBold
    })

    page.drawText(`This is to certify that ${student.name}`, { x: 50, y: height - 200, size: 12, font: helveticaFont })
    page.drawText(`Admission No: ${student.admissionNo}`, { x: 50, y: height - 230, size: 12, font: helveticaFont })
    page.drawText(`Was a student of this school in Class: ${student.class.className}`, { x: 50, y: height - 260, size: 12, font: helveticaFont })
    page.drawText(`Date of Leaving: ${dateOfLeaving}`, { x: 50, y: height - 290, size: 12, font: helveticaFont })
    page.drawText(`Reason for leaving: ${reason}`, { x: 50, y: height - 320, size: 12, font: helveticaFont })
    
    page.drawText('Principal Signature', { x: 400, y: height - 450, size: 12, font: helveticaBold })

    const pdfBytes = await pdfDoc.save()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=TC_${student.admissionNo}.pdf`)
    res.send(Buffer.from(pdfBytes))

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Generate Bonafide Certificate
export const generateBonafideCertificate = async (req, res) => {
  try {
    const { studentId, purpose } = req.body
    
    const student = await Student.findById(studentId).populate('class')
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' })

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const { height } = page.getSize()

    page.drawText('CIGMA INTERNATIONAL SCHOOL', {
      x: 140, y: height - 80, size: 22, font: helveticaBold, color: rgb(0.55, 0.23, 0.23)
    })
    page.drawText('BONAFIDE CERTIFICATE', {
      x: 200, y: height - 120, size: 16, font: helveticaBold
    })

    const text = `This is to certify that ${student.name}, Admission No ${student.admissionNo}, is a bonafide student of our institution currently studying in Class ${student.class.className}.`
    
    page.drawText(text, { x: 50, y: height - 220, size: 12, font: helveticaFont, maxWidth: 500, lineHeight: 20 })
    page.drawText(`Purpose: ${purpose}`, { x: 50, y: height - 280, size: 12, font: helveticaFont })
    
    page.drawText('Principal Signature', { x: 400, y: height - 450, size: 12, font: helveticaBold })

    const pdfBytes = await pdfDoc.save()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=Bonafide_${student.admissionNo}.pdf`)
    res.send(Buffer.from(pdfBytes))

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
