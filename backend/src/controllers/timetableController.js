import { Timetable, Class, Teacher } from '../models/index.js'

export const createTimetable = async (req, res) => {
  try {
    const { classId, day, period, subject, teacherId, startTime, endTime } = req.body

    if (!classId || !day || !period || !subject) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const timetable = new Timetable({
      class: classId,
      day,
      period,
      subject,
      teacher: teacherId || null,
      startTime,
      endTime
    })

    await timetable.save()
    res.status(201).json({ success: true, data: timetable })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params

    const records = await Timetable.find({ class: classId })
      .populate('teacher', 'name')
      .sort({ day: 1, period: 1 })

    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params // Or req.user._id depending on how it's called

    // Let's assume teacher schema might be referenced, or if user is teacher, we lookup their teacher profile
    let targetTeacherId = teacherId
    
    // If 'me' is passed, we resolve the teacher record for the current user
    if (teacherId === 'me' && req.user.role === 'TEACHER') {
      const teacher = await Teacher.findOne({ userId: req.user._id })
      if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' })
      targetTeacherId = teacher._id
    }

    const records = await Timetable.find({ teacher: targetTeacherId })
      .populate('class', 'className division')
      .sort({ day: 1, period: 1 })

    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params
    await Timetable.findByIdAndDelete(id)
    res.json({ success: true, message: 'Timetable entry deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
