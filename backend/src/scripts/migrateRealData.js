import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import csv from 'csv-parser'

// Adjust models import based on actual paths
import { User, Student, Teacher, Parent, Class, Subject, Book, TransportRoute, Payroll, News } from '../models/index.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const generatePassword = () => Math.random().toString(36).slice(-8)

const readCSV = async (filename) => {
  const results = []
  const filepath = path.join(__dirname, 'migration', filename)
  if (!fs.existsSync(filepath)) {
    console.warn(`[WARN] ${filename} not found. Skipping.`)
    return results
  }
  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err))
  })
}

const migrate = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required in .env')
    }
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB for Migration.')

    // Store credentials to output
    const credentials = []
    
    // Create Super Admin if not exists
    const adminEmail = 'admin@creativecigma.com'
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (!existingAdmin) {
      const password = generatePassword()
      const hashedPassword = await bcrypt.hash(password, 10)
      const admin = await User.create({
        loginId: 'admin',
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true
      })
      credentials.push(`SUPER_ADMIN: loginId=${admin.loginId}, password=${password}`)
      console.log('Super Admin created.')
    }

    // ─── 1. Teachers ───
    const teachersData = await readCSV('teachers.csv')
    for (const t of teachersData) {
      const existing = await Teacher.findOne({ employeeId: t.employeeId })
      if (!existing) {
        const password = generatePassword()
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await User.create({
          loginId: t.employeeId,
          name: t.name,
          email: t.email,
          password: hashedPassword,
          role: 'TEACHER',
          isActive: true
        })

        const teacher = await Teacher.create({
          userId: user._id,
          employeeId: t.employeeId,
          name: t.name,
          email: t.email,
          phone: t.phone,
          department: t.department,
          designation: t.designation,
          salary: Number(t.salary) || 0
        })

        user.referenceId = teacher._id
        await user.save()
        credentials.push(`TEACHER ${t.name}: loginId=${t.employeeId}, password=${password}`)
      }
    }
    console.log(`Migrated ${teachersData.length} Teachers.`)

    // ─── 2. Students ───
    const studentsData = await readCSV('students.csv')
    for (const s of studentsData) {
      const existing = await Student.findOne({ admissionNo: s.admissionNo })
      if (!existing) {
        const password = generatePassword()
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await User.create({
          loginId: s.admissionNo,
          name: s.name,
          email: s.email,
          password: hashedPassword,
          role: 'STUDENT',
          isActive: true
        })

        const student = await Student.create({
          userId: user._id,
          admissionNo: s.admissionNo,
          name: s.name,
          email: s.email,
          phone: s.phone,
          grade: s.grade,
          section: s.section
        })

        user.referenceId = student._id
        await user.save()
        credentials.push(`STUDENT ${s.name}: loginId=${s.admissionNo}, password=${password}`)
      }
    }
    console.log(`Migrated ${studentsData.length} Students.`)

    // ─── 3. Parents ───
    const parentsData = await readCSV('parents.csv')
    for (const p of parentsData) {
      // Find associated student
      const student = await Student.findOne({ admissionNo: p.studentAdmissionNo })
      if (student) {
        const existing = await Parent.findOne({ email: p.email })
        if (!existing) {
          const password = generatePassword()
          const hashedPassword = await bcrypt.hash(password, 10)
          
          const user = await User.create({
            loginId: p.email, // using email as loginId for parent
            name: p.name,
            email: p.email,
            password: hashedPassword,
            role: 'PARENT',
            isActive: true
          })

          const parent = await Parent.create({
            userId: user._id,
            name: p.name,
            email: p.email,
            phone: p.phone,
            students: [student._id]
          })

          user.referenceId = parent._id
          await user.save()

          student.parentId = parent._id
          await student.save()
          
          credentials.push(`PARENT ${p.name}: loginId=${p.email}, password=${password}`)
        }
      }
    }
    console.log(`Migrated ${parentsData.length} Parents.`)

    // Save credentials securely to a local file
    const credsPath = path.join(__dirname, 'migration', 'migration_credentials.txt')
    fs.writeFileSync(credsPath, credentials.join('\n'))
    console.log(`\n✅ Migration completed. Credentials saved to ${credsPath}`)
    console.log('NOTE: Ensure migration_credentials.txt is added to .gitignore!')

    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
