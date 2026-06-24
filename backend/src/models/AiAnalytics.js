import mongoose from 'mongoose'

const aiAnalyticsSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['REPORT_GENERATED', 'PDF_DOWNLOADED', 'WEEKLY_SUMMARY_GENERATED', 'INSIGHT_WIDGET_VIEWED']
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

export default mongoose.model('AiAnalytics', aiAnalyticsSchema)
