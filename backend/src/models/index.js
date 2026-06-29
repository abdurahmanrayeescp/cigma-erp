import mongoose from 'mongoose'

// ─── Student ──────────────────────────────────────────────────────────
const studentSchema = new mongoose.Schema({
  admissionNo: { type: String, required: true, unique: true },
  studentId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female'] },
  class: { type: String, required: true },
  division: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  admissionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'alumni'], default: 'active' },
  photo: String,
}, { timestamps: true })

// ─── Parent ───────────────────────────────────────────────────────────
const parentSchema = new mongoose.Schema({
  fatherName: String,
  motherName: String,
  phone: { type: String, required: true },
  email: String,
  occupation: String,
  address: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// ─── Teacher ──────────────────────────────────────────────────────────
const teacherSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: String,
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  qualification: String,
  experience: Number,
  salary: Number,
  phone: String,
  email: String,
  photo: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// ─── Class ────────────────────────────────────────────────────────────
const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  division: String,
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  subjects: [String],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  academicYear: String,
}, { timestamps: true })

// ─── Timetable ────────────────────────────────────────────────────────
const timetableSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  period: { type: Number, required: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  startTime: String,
  endTime: String,
}, { timestamps: true })

// ─── Attendance ───────────────────────────────────────────────────────
const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'leave', 'late'], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: String,
}, { timestamps: true })

attendanceSchema.index({ student: 1, date: 1 }, { unique: true })

// ─── Marks ────────────────────────────────────────────────────────────
const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  subject: { type: String, required: true },
  exam: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  grade: String,
  academicYear: String,
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// ─── Notification ─────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetAudience: { type: String, enum: ['ALL', 'PARENTS', 'TEACHERS', 'STUDENTS', 'STAFF'], default: 'ALL' },
  isRead: { type: Boolean, default: false },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sentAt: { type: Date, default: Date.now },
}, { timestamps: true })

// ─── Inquiry ──────────────────────────────────────────────────────────
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  parentName: String,
  grade: String,
  subject: String,
  message: { type: String },
  type: { type: String, enum: ['admission', 'general', 'contact'], default: 'general' },
  status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' },
  notes: String,
}, { timestamps: true })

// ─── NewsEvent ────────────────────────────────────────────────────────
const newsEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, enum: ['Admissions', 'Academic', 'Events', 'Islamic', 'Sports', 'General'], default: 'General' },
  imageUrl: String,
  pdfUrl: String,
  publishDate: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// ─── GalleryItem ──────────────────────────────────────────────────────
const galleryItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: String,
  caption: String,
  category: {
    type: String,
    enum: ['Annual Day', 'Graduation Ceremony', 'Sports Day', 'Classroom Activities', 'Islamic Programs', 'Eid Celebrations', 'Quran Competitions', 'Seminars & Workshops', 'Study Tours', 'Cultural Programs'],
    required: true,
  },
  date: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

// ─── Download ─────────────────────────────────────────────────────────
const downloadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Admissions', 'Academic Calendar', 'Holiday List', 'Circulars & Notices', 'Timetable', 'Syllabus', 'General'], required: true },
  fileUrl: { type: String, required: true },
  publicId: String,
  fileSize: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloadCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// ─── Application (Career) ─────────────────────────────────────────────
const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  qualification: String,
  experience: String,
  coverLetter: String,
  cvUrl: String,
  status: { type: String, enum: ['received', 'reviewed', 'shortlisted', 'rejected', 'hired'], default: 'received' },
}, { timestamps: true })

// ─── Subject ────────────────────────────────────────────────────────────
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., English, Mathematics, Science
  code: { type: String, required: true, unique: true },
  description: String,
}, { timestamps: true })

// ─── Homework ─────────────────────────────────────────────────────────
const homeworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pdfUrl: String,
  dueDate: { type: Date, required: true },
}, { timestamps: true })

// ─── Fee ──────────────────────────────────────────────────────────────
const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYear: { type: String, required: true },
  totalFee: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paymentHistory: [{
    amount: Number,
    date: Date,
    receiptUrl: String,
    method: String,
  }],
}, { timestamps: true })

// ─── Book (Library) ───────────────────────────────────────────────────
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true },
  category: String,
  status: { type: String, enum: ['available', 'issued', 'lost'], default: 'available' },
  issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  issueDate: Date,
  dueDate: Date,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

// ─── Transport ─────────────────────────────────────────────────────────
const transportRouteSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: String,
  driverPhone: String,
  stops: [{ stopName: String, time: String, fee: Number }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true })

// ─── Payroll ───────────────────────────────────────────────────────────
const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  month: { type: String, required: true }, // e.g. "June 2025"
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  paymentDate: Date
}, { timestamps: true })

export { default as User } from './User.js'

export const Student = mongoose.model('Student', studentSchema)
export const Parent = mongoose.model('Parent', parentSchema)
export const Teacher = mongoose.model('Teacher', teacherSchema)
export const Class = mongoose.model('Class', classSchema)
export const Subject = mongoose.model('Subject', subjectSchema)
export const Timetable = mongoose.model('Timetable', timetableSchema)
export const Attendance = mongoose.model('Attendance', attendanceSchema)
export const Marks = mongoose.model('Marks', marksSchema)
export const Homework = mongoose.model('Homework', homeworkSchema)
export const Fee = mongoose.model('Fee', feeSchema)
export const Notification = mongoose.model('Notification', notificationSchema)
export const Inquiry = mongoose.model('Inquiry', inquirySchema)
export const NewsEvent = mongoose.model('NewsEvent', newsEventSchema)
export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema)
export const Download = mongoose.model('Download', downloadSchema)
export const Application = mongoose.model('Application', applicationSchema)
export const Book = mongoose.model('Book', bookSchema)
export const TransportRoute = mongoose.model('TransportRoute', transportRouteSchema)
export const Payroll = mongoose.model('Payroll', payrollSchema)

// ─── Audit Logs ────────────────────────────────────────────────────────
const auditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: { type: String, required: true }, // e.g. "marks", "fees", "attendance"
  details: { type: Object },
  ipAddress: String,
}, { timestamps: true })

export const Audit = mongoose.model('Audit', auditSchema)

// ─── AI Analytics ──────────────────────────────────────────────────────
const aiAnalyticsSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['REPORT_GENERATED', 'PDF_DOWNLOADED', 'WEEKLY_SUMMARY_GENERATED', 'INSIGHT_WIDGET_VIEWED', 'INSIGHTS_VIEWED']
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  userRole: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

export const AiAnalytics = mongoose.model('AiAnalytics', aiAnalyticsSchema)
