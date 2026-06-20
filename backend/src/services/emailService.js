import nodemailer from 'nodemailer'

// Configure Nodemailer transporter (Fallback to console if no env credentials)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass',
  },
})

// Check if we are running in full mock mode
const isMock = !process.env.SMTP_HOST

export const sendEmail = async (to, subject, htmlContent) => {
  if (isMock) {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`)
    // console.log(`Body: ${htmlContent}`)
    return true
  }

  try {
    const info = await transporter.sendMail({
      from: `"CIGMA ERP" <${process.env.SMTP_FROM || 'no-reply@creativecigma.com'}>`,
      to,
      subject,
      html: htmlContent,
    })
    console.log('Message sent: %s', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Convenience method to blast emails to an array of addresses
 */
export const sendBulkEmail = async (bccArray, subject, htmlContent) => {
  if (isMock) {
    console.log(`[MOCK BULK EMAIL] BCC Count: ${bccArray.length} | Subject: ${subject}`)
    return true
  }

  if (!bccArray || bccArray.length === 0) return false

  try {
    const info = await transporter.sendMail({
      from: `"CIGMA ERP" <${process.env.SMTP_FROM || 'no-reply@creativecigma.com'}>`,
      to: process.env.SMTP_FROM || 'no-reply@creativecigma.com', // Send to self
      bcc: bccArray, // Blind carbon copy to everyone else
      subject,
      html: htmlContent,
    })
    console.log('Bulk Message sent: %s', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending bulk email:', error)
    return false
  }
}
