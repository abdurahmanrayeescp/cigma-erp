import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import csv from 'csv-parser'

// Adjust models import based on actual paths
import { User, Student, Teacher, Parent, Class, Subject, Book, TransportRoute, Payroll, NewsEvent } from '../models/index.js'

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
    let existingAdmin = await User.findOne({ email: adminEmail })
    if (!existingAdmin) {
      const password = generatePassword()
      const hashedPassword = await bcrypt.hash(password, 10)
      existingAdmin = await User.create({
        username: 'admin',
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true
      })
      credentials.push(`SUPER_ADMIN: username=${existingAdmin.username}, password=${password}`)
      console.log('Super Admin created.')
    }

    // ─── 1. Teachers ───
    const teachersData = await readCSV('teachers.csv')
    for (const t of teachersData) {
      const existing = await Teacher.findOne({ employeeId: t.employeeId })
      if (!existing) {
        let user = await User.findOne({ username: t.employeeId })
        let password = 'PasswordExists'
        
        if (!user) {
          password = generatePassword()
          const hashedPassword = await bcrypt.hash(password, 10)
          user = await User.create({
            username: t.employeeId,
            name: t.name,
            email: t.email,
            password: hashedPassword,
            role: 'TEACHER',
            isActive: true
          })
          credentials.push(`TEACHER ${t.name}: username=${t.employeeId}, password=${password}`)
        }

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
      }
    }
    console.log(`Migrated ${teachersData.length} Teachers.`)

    // ─── 2. Students ───
    const studentsData = await readCSV('students.csv')
    for (const s of studentsData) {
      const existing = await Student.findOne({ admissionNo: s.admissionNo })
      if (!existing) {
        let user = await User.findOne({ username: s.admissionNo })
        let password = 'PasswordExists'
        
        if (!user) {
          password = generatePassword()
          const hashedPassword = await bcrypt.hash(password, 10)
          user = await User.create({
            username: s.admissionNo,
            name: s.name,
            email: s.email,
            password: hashedPassword,
            role: 'STUDENT',
            isActive: true
          })
          credentials.push(`STUDENT ${s.name}: username=${s.admissionNo}, password=${password}`)
        }

        const student = await Student.create({
          userId: user._id,
          admissionNo: s.admissionNo,
          name: s.name,
          email: s.email,
          phone: s.phone,
          class: s.grade,
          division: s.section
        })

        user.referenceId = student._id
        await user.save()
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
          let user = await User.findOne({ username: p.email })
          let password = 'PasswordExists'
          
          if (!user) {
            password = generatePassword()
            const hashedPassword = await bcrypt.hash(password, 10)
            user = await User.create({
              username: p.email,
              name: p.name,
              email: p.email,
              password: hashedPassword,
              role: 'PARENT',
              isActive: true
            })
            credentials.push(`PARENT ${p.name}: username=${p.email}, password=${password}`)
          }

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
