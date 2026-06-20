import { Notification } from '../models/index.js'
import { sendTopicNotification } from '../services/firebaseService.js'
import { sendBulkEmail } from '../services/emailService.js'
import { sendBulkWhatsApp } from '../services/whatsappService.js'

export const createNotification = async (req, res) => {
  try {
    const { title, message, targetAudience, channels } = req.body

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' })
    }

    const notification = new Notification({
      title,
      message,
      targetAudience: targetAudience || 'ALL',
      sentBy: req.user._id
    })

    await notification.save()

    // Dispatch via requested channels
    if (channels) {
      if (channels.push) {
        await sendTopicNotification(targetAudience || 'ALL', title, message)
      }
      if (channels.email) {
        // In a real app we'd fetch the user emails based on targetAudience
        const mockEmails = ['parent1@example.com', 'parent2@example.com']
        await sendBulkEmail(mockEmails, title, message)
      }
      if (channels.whatsapp) {
        // In a real app we'd fetch the user phone numbers based on targetAudience
        const mockPhones = ['+919876543210', '+919876543211']
        await sendBulkWhatsApp(mockPhones, 'announcement_template', { title, message })
      }
    }
    
    res.status(201).json({ success: true, data: notification })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getNotifications = async (req, res) => {
  try {
    const userRole = req.user.role // e.g., 'STUDENT', 'PARENT', 'TEACHER', 'ADMIN'
    
    // Determine which audiences this user should see
    let audiences = ['ALL']
    if (userRole === 'STUDENT') audiences.push('STUDENTS')
    if (userRole === 'PARENT') audiences.push('PARENTS')
    if (userRole === 'TEACHER') audiences.push('TEACHERS', 'STAFF')
    if (['ADMIN', 'SUPER_ADMIN', 'PRINCIPAL', 'OFFICE_STAFF'].includes(userRole)) {
      audiences.push('STAFF', 'TEACHERS', 'PARENTS', 'STUDENTS') // See everything
    }

    const notifications = await Notification.find({ targetAudience: { $in: audiences } })
      .sort({ sentAt: -1 })
      .limit(50)

    res.json({ success: true, data: notifications })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    // Note: In a real system we'd track read status per user. 
    // For simplicity of this schema, we just toggle isRead.
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true })
    res.json({ success: true, data: notification })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
