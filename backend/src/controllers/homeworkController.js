import { Homework } from '../models/index.js'

export const assignHomework = async (req, res) => {
  try {
    const { title, description, classId, subject, dueDate, pdfUrl } = req.body

    if (!title || !classId || !subject || !dueDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const homework = new Homework({
      title,
      description,
      class: classId,
      subject,
      teacher: req.user._id,
      dueDate: new Date(dueDate),
      pdfUrl
    })

    await homework.save()

    res.status(201).json({ success: true, data: homework })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getClassHomework = async (req, res) => {
  try {
    const { id } = req.params // classId
    const { subject } = req.query

    const query = { class: id }
    if (subject) query.subject = subject

    const records = await Homework.find(query).populate('teacher', 'name').sort({ dueDate: -1 })
    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteHomework = async (req, res) => {
  try {
    const { id } = req.params
    const homework = await Homework.findById(id)
    
    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found' })
    }

    // Only allow the teacher who created it or an admin to delete it
    if (req.user.role === 'TEACHER' && homework.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this homework' })
    }

    await Homework.findByIdAndDelete(id)
    res.json({ success: true, message: 'Homework deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
