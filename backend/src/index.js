import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import dotenv from 'dotenv'
import { autoSeedDatabase } from './autoSeed.js'
import { logger } from './utils/logger.js'

// Routes
import authRoutes from './routes/auth.js'
import inquiryRoutes from './routes/inquiries.js'
import newsRoutes from './routes/news.js'
import galleryRoutes from './routes/gallery.js'
import downloadRoutes from './routes/downloads.js'
import applicationRoutes from './routes/applications.js'
import dashboardRoutes from './routes/dashboard.js'
import attendanceRoutes from './routes/attendance.js'
import marksRoutes from './routes/marks.js'
import homeworkRoutes from './routes/homework.js'
import timetableRoutes from './routes/timetable.js'
import feesRoutes from './routes/fees.js'
import notificationsRoutes from './routes/notifications.js'
import certificateRoutes from './routes/certificates.js'
import reportRoutes from './routes/reports.js'
import libraryRoutes from './routes/library.js'
import transportRoutes from './routes/transport.js'
import payrollRoutes from './routes/payroll.js'
import auditRoutes from './routes/audit.js'
import studentRoutes from './routes/students.js'
import teacherRoutes from './routes/teachers.js'
import academicsRoutes from './routes/academics.js'
import systemRoutes from './routes/system.js'
import parentRoutes from './routes/parents.js'
import aiStudyPlanRoutes from './routes/aiStudyPlan.js'
import aiParentInsightsRoutes from './routes/aiParentInsights.js'
import aiRoutes from './routes/aiStudyPlan.js'

dotenv.config()

// Global process error handlers to capture uncaughtException and unhandledRejection
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception occurred', err)
})

process.on('unhandledRejection', (reason, promise) => {
  const err = reason instanceof Error ? reason : new Error(String(reason))
  logger.error('Unhandled Rejection occurred', err)
})

// Listen to Mongoose connection errors
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB Connection Error', err)
})

const app = express()
const PORT = process.env.PORT || 5000

// ─── Security Middleware ───────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'res.cloudinary.com'],
    },
  },
}))

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://creativecigma.com',
      'https://portal.creativecigma.com',
      'https://admin.creativecigma.com',
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    // Allow if origin is in the list, or it's a vercel preview domain, or no origin (e.g. server-to-server)
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}))

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts.' },
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: Object.assign({}, req.query),
      writable: true,
      configurable: true,
      enumerable: true
    })
  }
  next()
})
app.use(mongoSanitize()) // Prevent NoSQL injection

// ─── Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/downloads', downloadRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/marks', marksRoutes)
app.use('/api/homework', homeworkRoutes)
app.use('/api/timetable', timetableRoutes)
app.use('/api/fees', feesRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/library', libraryRoutes)
app.use('/api/transport', transportRoutes)
app.use('/api/payroll', payrollRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/academics', academicsRoutes)
app.use('/api/system', systemRoutes)
app.use('/api/parents', parentRoutes)
app.use('/api/ai', aiStudyPlanRoutes)
app.use('/api/ai/parent-insights', aiParentInsightsRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'CIGMA API is running', timestamp: new Date().toISOString() })
})

// ─── Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  const isProduction = process.env.NODE_ENV === 'production'
  const status = err.statusCode || err.status || 500
  const message = err.message || 'Internal server error'
  
  // Pipe all Express API / controller errors (Authentication, API, Database, PDF, Cloudinary, etc.) to logger.error
  logger.error(`API Error: ${message} (Status: ${status})`, err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user.id : null,
  })
  
  res.status(status).json({ 
    success: false, 
    message: isProduction && status === 500 ? 'Internal Server Error' : message 
  })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── Database Connection ────────────────────────────────────────────────
async function startServer() {
  try {
    console.log("Environment:", process.env.NODE_ENV || "development");

    const { default: startDevMemoryDb } = await import("./devMemoryDb.js");
    await startDevMemoryDb();

    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) throw new Error('MONGODB_URI is not defined in environment variables')

    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected")
    console.log('✅ Connected to MongoDB')

    // Auto-seed database if empty (useful for dev/in-memory DBs)
    if (process.env.NODE_ENV !== "production" || process.env.IS_MEMORY_DB === 'true') {
      await autoSeedDatabase()
    }

    app.listen(PORT, () => {
      console.log(`🚀 CIGMA API Server running on port ${PORT}`)
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    logger.error('❌ Failed to start server:', error)
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
