import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'TEACHER', 'PARENT', 'STUDENT']

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true }, // Can be Email, Employee ID, or Admission No
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ROLES, default: 'STUDENT' },
  phone: { type: String, trim: true },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, select: false },
  refreshToken: { type: String, select: false },
  lastLogin: { type: Date },
  passwordChangedAt: { type: Date },
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordChangedAt = new Date()
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
