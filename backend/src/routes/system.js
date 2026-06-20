import express from 'express'
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import nodemailer from 'nodemailer'
import admin from 'firebase-admin'
import { protect } from '../middleware/auth.js'
import { requireRole } from '../middleware/authorize.js'

const router = express.Router()

// Cloudinary config
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

router.get('/health', protect, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res, next) => {
  try {
    // Optional debug flag to test global error handling integration
    if (req.query.triggerError === 'true') {
      throw new Error('Test diagnostics exception: global error handling verification')
    }

    // 1. Database Status
    const readyState = mongoose.connection.readyState
    const readyStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
    const databaseStatus = readyStateMap[readyState] || 'unknown'

    // 2. Cloudinary Status Ping
    let cloudinaryStatus = 'disconnected'
    let cloudinaryPing = null
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const pingResult = await cloudinary.api.ping()
        cloudinaryPing = pingResult
        if (pingResult && pingResult.status === 'ok') {
          cloudinaryStatus = 'connected'
        }
      } catch (err) {
        cloudinaryStatus = 'disconnected'
        cloudinaryPing = err.message
      }
    } else {
      cloudinaryStatus = 'mocked'
      cloudinaryPing = 'Missing environment credentials'
    }

    // 3. SMTP Transporter Verification
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER || 'mock_user',
        pass: process.env.SMTP_PASS || 'mock_pass',
      },
    })

    let smtpStatus = 'disconnected'
    let smtpVerified = false
    if (process.env.SMTP_HOST) {
      try {
        await transporter.verify()
        smtpStatus = 'connected'
        smtpVerified = true
      } catch (err) {
        smtpStatus = 'disconnected'
        smtpVerified = false
      }
    } else {
      smtpStatus = 'mocked'
      smtpVerified = true
    }

    // 4. Firebase Initialization Status
    let firebaseStatus = 'disconnected'
    let firebaseInitialized = false
    if (admin.apps && admin.apps.length > 0) {
      firebaseStatus = 'connected'
      firebaseInitialized = true
    } else {
      firebaseStatus = 'mocked'
      firebaseInitialized = false
    }

    const diagnostics = {
      success: true,
      databaseStatus,
      mongooseReadyState: readyState,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      cloudinaryStatus,
      cloudinaryPing,
      smtpStatus,
      smtpVerified,
      firebaseStatus,
      firebaseInitialized,
      timestamp: new Date().toISOString()
    }

    res.json(diagnostics)
  } catch (error) {
    if (req.query.triggerError === 'true') {
      return next(error)
    }
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system health diagnostics',
      error: error.message
    })
  }
})

export default router
