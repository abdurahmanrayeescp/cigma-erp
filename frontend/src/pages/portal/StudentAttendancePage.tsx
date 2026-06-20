import { useState, useEffect } from 'react'
import { CalendarDays, CheckSquare, XCircle, Clock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const mockRecords = [
  { date: '2025-06-15', status: 'present' },
  { date: '2025-06-16', status: 'present' },
  { date: '2025-06-17', status: 'absent' },
  { date: '2025-06-18', status: 'present' },
  { date: '2025-06-19', status: 'late' },
]

export default function StudentAttendancePage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState({ total: 20, present: 18, absent: 1, late: 1, percentage: 90 })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-maroon-600" />
          My Attendance
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your attendance history and statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * summary.percentage) / 100} className="text-maroon-600" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-bold dark:text-white">{summary.percentage}%</span>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Overall Attendance</p>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 md:col-span-3 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-500/10 rounded-xl">
            <CheckSquare className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">{summary.present}</p>
            <p className="text-sm font-medium text-green-600/80 dark:text-green-500">Present Days</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-500/10 rounded-xl">
            <XCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{summary.absent}</p>
            <p className="text-sm font-medium text-red-600/80 dark:text-red-500">Absent Days</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
            <Clock className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{summary.late}</p>
            <p className="text-sm font-medium text-orange-600/80 dark:text-orange-500">Late Days</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-bold dark:text-white mb-4">Recent Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {mockRecords.map((record, idx) => (
                <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full
                      ${record.status === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' 
                      : record.status === 'absent' ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                      : record.status === 'late' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300'}`}
                    >
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insight Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl p-6 border border-indigo-100 dark:border-indigo-500/20 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">AI Attendance Insight</h3>
          <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400 text-xs font-bold rounded-full">
            Good Standing
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          The student's attendance is currently at 90%. While this is acceptable, minimizing occasional absences will help them stay fully engaged with the curriculum.
        </p>
      </motion.div>
    </div>
  )
}
