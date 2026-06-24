import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { Student, Teacher, Parent, Class } from '../models/index.js'
import { protect } from '../middleware/auth.js'


const router = express.Router()

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { loginId, password } = req.body
    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Login ID and password are required' })
    }

    // loginId could be email, admissionNo, employeeId, studentId (stored in 'username' or 'email')
    const user = await User.findOne({
      $or: [{ email: loginId.toLowerCase() }, { username: loginId }]
    }).select('+password +refreshToken')
    
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role)
    user.refreshToken = refreshToken
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' })
    }

    const user = await User.findById(decoded.userId).select('+refreshToken')
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role)
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ success: true, accessToken })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
})

// POST /api/auth/logout — fixed: properly awaits token revocation
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        await User.findByIdAndUpdate(decoded.userId, { refreshToken: null })
      } catch {
        // Token invalid / expired — still clear the cookie
      }
    }
    res.clearCookie('refreshToken')
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    res.clearCookie('refreshToken')
    res.json({ success: true, message: 'Logged out' })
  }
})

// POST /api/auth/change-password
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const user = await User.findById(req.user.id).select('+password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
})
// GET /api/auth/me — returns current user + referenceId (linked profile _id)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    let referenceId = null
    let referenceData = null

    if (user.role === 'STUDENT') {
      const profile = await Student.findOne({ userId: user._id }).select('_id admissionNo class division studentId')
      if (profile) {
        const classDoc = await Class.findOne({ className: profile.class, division: profile.division })
        referenceData = {
          ...profile.toObject(),
          classId: classDoc ? classDoc._id : null
        }
        referenceId = profile._id
      }
    } else if (user.role === 'PARENT') {
      const profile = await Parent.findOne({ userId: user._id })
        .select('_id fatherName motherName phone')
        .populate('children', '_id name admissionNo class division')
      if (profile) {
        const enrichedChildren = []
        for (const child of profile.children) {
          const classDoc = await Class.findOne({ className: child.class, division: child.division })
          enrichedChildren.push({
            ...child.toObject(),
            classId: classDoc ? classDoc._id : null
          })
        }
        referenceData = {
          _id: profile._id,
          fatherName: profile.fatherName,
          motherName: profile.motherName,
          phone: profile.phone,
          children: enrichedChildren
        }
        referenceId = profile._id
      }
    } else if (user.role === 'TEACHER') {
      const profile = await Teacher.findOne({ userId: user._id }).select('_id employeeId name department')
      referenceId = profile?._id ?? null
      referenceData = profile
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        referenceId,
        referenceData,
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
})


export default router
