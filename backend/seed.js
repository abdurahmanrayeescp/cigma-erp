import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import {
  User, Student, Parent, Teacher, Class, Subject, Timetable,
  Attendance, Marks, Homework, Fee, Notification,
} from './src/models/index.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

const SUBJECTS = [
  { name: 'English', code: 'ENG' },
  { name: 'Mathematics', code: 'MATH' },
  { name: 'Science', code: 'SCI' },
  { name: 'Social Science', code: 'SOC' },
  { name: 'Malayalam', code: 'MAL' },
  { name: 'Arabic', code: 'ARB' },
  { name: 'Islamic Studies', code: 'ISL' },
  { name: "Qur'an", code: 'QUR' },
  { name: 'Hadith', code: 'HAD' },
  { name: 'Fiqh', code: 'FIQ' },
]

const CLASSES = ['Prep-1', 'Prep-2', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Plus One', 'Plus Two']
const DIVISIONS = ['A', 'B']

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

async function seed() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env')
    process.exit(1)
  }

  console.log('🔗 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected.')

  // Clear existing ERP data (Warning: this wipes the DB for a fresh start)
  console.log('🗑️  Clearing existing collections...')
  await User.deleteMany({})
  await Student.deleteMany({})
  await Parent.deleteMany({})
  await Teacher.deleteMany({})
  await Class.deleteMany({})
  await Subject.deleteMany({})
  await Timetable.deleteMany({})
  await Attendance.deleteMany({})
  await Marks.deleteMany({})
  await Homework.deleteMany({})
  await Fee.deleteMany({})
  await Notification.deleteMany({})

  // 1. Create Super Admin
  const admin = await User.create({
    username: 'admin',
    name: 'CIGMA Administrator',
    email: 'admin@cigma.school',
    password: 'password123',
    role: 'SUPER_ADMIN',
    isActive: true,
  })
  console.log('✅ Super Admin created (admin / password123)')

  // 2. Create Subjects
  const createdSubjects = await Subject.insertMany(SUBJECTS)
  console.log(`✅ ${createdSubjects.length} Subjects created`)

  // 3. Create Teachers (15)
  const teachers = []
  for (let i = 1; i <= 15; i++) {
    const employeeId = `T${1000 + i}`
    const tUser = await User.create({
      username: employeeId,
      name: `Teacher ${i}`,
      email: `teacher${i}@cigma.school`,
      password: 'password123',
      role: 'TEACHER',
      isActive: true,
    })
    
    // Assign 2-3 random subjects to each teacher
    const tSubjects = createdSubjects.sort(() => 0.5 - Math.random()).slice(0, 3).map(s => s._id)
    
    const teacher = await Teacher.create({
      employeeId,
      name: `Teacher ${i}`,
      department: 'General',
      subjects: tSubjects,
      salary: 25000 + (Math.random() * 10000),
      phone: `+919876543${String(i).padStart(3, '0')}`,
      email: `teacher${i}@cigma.school`,
      userId: tUser._id,
    })
    teachers.push(teacher)
  }
  console.log(`✅ ${teachers.length} Teachers created (T1001 - T1015 / password123)`)

  // 4. Create Classes
  const classes = []
  for (const cName of CLASSES) {
    for (const div of DIVISIONS) {
      const classTeacher = teachers[Math.floor(Math.random() * teachers.length)]
      const classObj = await Class.create({
        className: cName,
        division: div,
        classTeacher: classTeacher._id,
        subjects: createdSubjects.map(s => s.name),
        academicYear: '2025-2026',
        students: []
      })
      classes.push(classObj)
    }
  }
  console.log(`✅ ${classes.length} Classes created`)

  // 5. Create Students & Parents (100)
  const students = []
  for (let i = 1; i <= 100; i++) {
    const admissionNo = `A${2025000 + i}`
    const sUser = await User.create({
      username: admissionNo,
      name: `Student ${i}`,
      password: 'password123',
      role: 'STUDENT',
      isActive: true,
    })

    const pUser = await User.create({
      username: `P${admissionNo}`,
      name: `Parent of Student ${i}`,
      password: 'password123',
      role: 'PARENT',
      isActive: true,
    })

    const parent = await Parent.create({
      fatherName: `Father ${i}`,
      motherName: `Mother ${i}`,
      phone: `+919876500${String(i).padStart(3, '0')}`,
      email: `parent${i}@example.com`,
      address: `Kannur, Kerala`,
      userId: pUser._id,
      children: [],
    })

    const randomClass = classes[Math.floor(Math.random() * classes.length)]

    const student = await Student.create({
      admissionNo,
      studentId: `S${10000 + i}`,
      name: `Student ${i}`,
      dateOfBirth: randomDate(new Date(2005, 0, 1), new Date(2018, 0, 1)),
      gender: i % 2 === 0 ? 'male' : 'female',
      class: randomClass.className,
      division: randomClass.division,
      parentId: parent._id,
      userId: sUser._id,
    })
    
    // Link back
    parent.children.push(student._id)
    await parent.save()

    randomClass.students.push(student._id)
    await randomClass.save()

    students.push(student)

    // Generate Fees
    await Fee.create({
      student: student._id,
      academicYear: '2025-2026',
      totalFee: 15000,
      paidAmount: Math.random() > 0.5 ? 15000 : 5000,
      pendingAmount: Math.random() > 0.5 ? 0 : 10000,
      dueDate: new Date(2025, 8, 1),
      paymentHistory: Math.random() > 0.5 ? [{ amount: 15000, date: new Date(), method: 'Bank Transfer' }] : [{ amount: 5000, date: new Date(), method: 'Cash' }]
    })
  }
  console.log(`✅ ${students.length} Students & Parents created (A2025001 - A2025100 / password123)`)

  // 6. Create Timetables & Homeworks
  for (const c of classes) {
    // Timetable for Monday, Period 1
    const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)]
    const randomSubject = createdSubjects[Math.floor(Math.random() * createdSubjects.length)]
    
    await Timetable.create({
      class: c._id,
      day: 'Monday',
      period: 1,
      subject: randomSubject.name,
      teacher: randomTeacher._id,
      startTime: '09:00 AM',
      endTime: '09:45 AM'
    })

    // Homework
    await Homework.create({
      title: `Chapter 1 Exercises - ${randomSubject.name}`,
      description: 'Complete all questions at the end of Chapter 1.',
      class: c._id,
      subject: randomSubject._id,
      teacher: randomTeacher._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 days
    })
  }
  console.log(`✅ Timetables, Homeworks, and Fees generated`)

  // 7. Create Attendance (Last 5 days) & Marks for Midterm
  const exams = ['Midterm Exam']
  let attendanceCount = 0
  let marksCount = 0

  for (const student of students) {
    // Attendance
    for (let d = 0; d < 5; d++) {
      const date = new Date()
      date.setDate(date.getDate() - d)
      if (date.getDay() === 0 || date.getDay() === 6) continue // skip weekends
      
      const isAbsent = Math.random() < 0.1
      await Attendance.create({
        student: student._id,
        class: classes.find(c => c.className === student.class && c.division === student.division)._id,
        date: date,
        status: isAbsent ? 'absent' : 'present',
      })
      attendanceCount++
    }

    // Marks
    for (const subject of createdSubjects.slice(0, 5)) { // First 5 subjects
      const maxMarks = 100
      const marksObtained = Math.floor(Math.random() * 60) + 40 // 40-100
      await Marks.create({
        student: student._id,
        class: classes.find(c => c.className === student.class && c.division === student.division)._id,
        subject: subject.name,
        exam: exams[0],
        marksObtained,
        maxMarks,
        grade: marksObtained >= 90 ? 'A+' : marksObtained >= 80 ? 'A' : marksObtained >= 70 ? 'B+' : marksObtained >= 60 ? 'B' : 'C',
        academicYear: '2025-2026'
      })
      marksCount++
    }
  }
  console.log(`✅ ${attendanceCount} Attendance records & ${marksCount} Marks generated`)

  // 8. Global Notifications
  await Notification.create([
    { title: 'School Reopening', message: 'The new academic year begins on June 1st.', targetAudience: 'ALL' },
    { title: 'PTA Meeting', message: 'Parent-Teacher meeting scheduled for this Friday.', targetAudience: 'PARENTS' },
    { title: 'Exam Timetable Released', message: 'The Midterm Exam timetable has been published.', targetAudience: 'STUDENTS' },
  ])
  console.log(`✅ Notifications created`)

  console.log('\n🎉 Database successfully seeded with full ERP data!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
