import {
  User, Student, Parent, Teacher, Class, Subject, Timetable,
  Attendance, Marks, Homework, Fee, Notification,
} from './models/index.js'

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

export async function autoSeedDatabase() {
  try {
    const userCount = await User.countDocuments()
    if (userCount > 0) {
      console.log('✅ Database already contains users. Skipping auto-seed.')
      return
    }

    console.log('🌱 Database is empty. Auto-seeding database for development...')

    // Clear existing data just in case
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
    await User.create({
      username: 'admin',
      name: 'CIGMA Administrator',
      email: 'admin@cigma.school',
      password: 'password123',
      role: 'SUPER_ADMIN',
      isActive: true,
    })
    console.log('✅ Super Admin created (username: admin / password: password123)')

    // 2. Create Subjects
    const createdSubjects = await Subject.insertMany(SUBJECTS)
    console.log(`✅ ${createdSubjects.length} Subjects created`)

    // 3. Create Teachers (5)
    const teachers = []
    for (let i = 1; i <= 5; i++) {
      const employeeId = `T${1000 + i}`
      const tUser = await User.create({
        username: employeeId,
        name: `Teacher ${i}`,
        email: `teacher${i}@cigma.school`,
        password: 'password123',
        role: 'TEACHER',
        isActive: true,
      })
      
      const tSubjects = createdSubjects.slice(0, 3).map(s => s._id)
      
      const teacher = await Teacher.create({
        employeeId,
        name: `Teacher ${i}`,
        department: 'General',
        subjects: tSubjects,
        salary: 30000,
        phone: `+919876543${String(i).padStart(3, '0')}`,
        email: `teacher${i}@cigma.school`,
        userId: tUser._id,
      })
      teachers.push(teacher)
    }
    console.log(`✅ Teachers created (T1001 - T1005 / password123)`)

    // 4. Create Classes
    const classes = []
    for (const cName of CLASSES.slice(0, 4)) { // Seed fewer classes for fast start
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

    // 5. Create Students & Parents (10)
    const students = []
    for (let i = 1; i <= 10; i++) {
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
        paidAmount: 5000,
        pendingAmount: 10000,
        dueDate: new Date(2025, 8, 1),
        paymentHistory: [{ amount: 5000, date: new Date(), method: 'Cash' }]
      })
    }
    console.log(`✅ Students & Parents created (A2025001 - A2025010 / password123)`)

    // 6. Create Timetables & Homeworks
    for (const c of classes) {
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

      await Homework.create({
        title: `Chapter 1 Exercises - ${randomSubject.name}`,
        description: 'Complete all questions at the end of Chapter 1.',
        class: c._id,
        subject: randomSubject._id,
        teacher: randomTeacher._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
    }

    // 7. Attendance records & Marks
    for (const student of students) {
      const classObj = classes.find(c => c.className === student.class && c.division === student.division)
      if (classObj) {
        await Attendance.create({
          student: student._id,
          class: classObj._id,
          date: new Date(),
          status: 'present',
        })

        for (const subject of createdSubjects.slice(0, 3)) {
          await Marks.create({
            student: student._id,
            class: classObj._id,
            subject: subject.name,
            exam: 'Midterm Exam',
            marksObtained: 85,
            maxMarks: 100,
            grade: 'A',
            academicYear: '2025-2026'
          })
        }
      }
    }

    // 8. Global Notifications
    await Notification.create([
      { title: 'School Reopening', message: 'The new academic year begins on June 1st.', targetAudience: 'ALL' },
      { title: 'PTA Meeting', message: 'Parent-Teacher meeting scheduled for this Friday.', targetAudience: 'PARENTS' },
      { title: 'Exam Timetable Released', message: 'The Midterm Exam timetable has been published.', targetAudience: 'STUDENTS' },
    ])

    console.log('🎉 Database successfully seeded with developer ERP data!')
  } catch (error) {
    console.error('❌ Failed to auto-seed database:', error)
  }
}
