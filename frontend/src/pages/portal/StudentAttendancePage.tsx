import { useEffect, useState } from 'react'
import { CalendarDays, CheckSquare, XCircle, Clock, Sparkles, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { attendanceApi } from '@/lib/api'

interface AttendanceRecord {
  _id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'leave'
  remarks?: string
}

interface Summary {
  total: number
  present: number
  percentage: number
  insight?: string | null
}

export default function StudentAttendancePage() {
  const { user } = useAuth()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState<Summary>({ total: 0, present: 0, percentage: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    const studentId = user?.referenceId
    if (!studentId) {
      setLoading(false)
      setError('Student profile not linked. Please contact admin.')
      return
    }
    attendanceApi.getStudentAttendance(studentId)
      .then(res => {
        if (res.success && res.data) {
          setRecords(res.data.records || [])
          setSummary(res.data.summary || { total: 0, present: 0, percentage: 0 })
        }
      })
      .catch(() => setError('Failed to load attendance records.'))
      .finally(() => setLoading(false))
  }, [user])

  const absent = records.filter(r => r.status === 'absent').length
  const late   = records.filter(r => r.status === 'late').length

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      present: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400',
      absent:  'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400',
      late:    'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400',
      leave:   'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400',
    }
    return map[status] || 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300'
  }

  const insightColor = summary.percentage >= 85 ? 'green' : summary.percentage >= 70 ? 'orange' : 'red'
  const insightLabel = summary.percentage >= 85 ? 'Good Standing' : summary.percentage >= 70 ? 'Needs Improvement' : 'At Risk'

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-maroon-600" />
          My Attendance
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your attendance history and statistics.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center">
              <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * summary.percentage) / 100}
                    className={`${summary.percentage >= 85 ? 'text-green-500' : summary.percentage >= 70 ? 'text-orange-500' : 'text-red-500'} transition-all duration-700`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-bold dark:text-white">{summary.percentage}%</span>
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-center">Overall Attendance</p>
            </div>

            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 md:col-span-3 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-500/10 rounded-xl">
                <CheckSquare className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{summary.present}</p>
                <p className="text-sm font-medium text-green-600/80 dark:text-green-500">Present</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-500/10 rounded-xl">
                <XCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{absent}</p>
                <p className="text-sm font-medium text-red-600/80 dark:text-red-500">Absent</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
                <Clock className="w-8 h-8 text-orange-500 mb-2" />
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{late}</p>
                <p className="text-sm font-medium text-orange-600/80 dark:text-orange-500">Late</p>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold dark:text-white mb-4">
              Attendance Records <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({records.length} entries)</span>
            </h3>
            {records.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No attendance records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                  <thead className="bg-gray-50 dark:bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {records.map((record, idx) => (
                      <motion.tr key={record._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusBadge(record.status)}`}>
                            {record.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{record.remarks || '—'}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* AI Insight Panel */}
          {summary.insight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-6 border shadow-sm ${
                insightColor === 'green'  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border-green-100 dark:border-green-500/20' :
                insightColor === 'orange' ? 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border-orange-100 dark:border-orange-500/20' :
                'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 border-red-100 dark:border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${insightColor === 'green' ? 'bg-green-100 dark:bg-green-500/20' : insightColor === 'orange' ? 'bg-orange-100 dark:bg-orange-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                  <Sparkles className={`w-5 h-5 ${insightColor === 'green' ? 'text-green-600 dark:text-green-400' : insightColor === 'orange' ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Attendance Insight</h3>
                <span className={`ml-auto px-3 py-1 text-xs font-bold rounded-full ${
                  insightColor === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                  insightColor === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400' :
                  'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                }`}>{insightLabel}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.insight}</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
