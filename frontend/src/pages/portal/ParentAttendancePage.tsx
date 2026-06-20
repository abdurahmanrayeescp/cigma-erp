import { useState } from 'react'
import { CalendarDays, CheckSquare, XCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const mockChildren = [
  { id: 'S10001', name: 'Aarav Patel', admissionNo: 'A2025001', class: 'Class 1 - A' },
  { id: 'S10002', name: 'Rohan Patel', admissionNo: 'A2025102', class: 'Class 3 - B' },
]

const mockRecords = [
  { date: '2025-06-15', status: 'present' },
  { date: '2025-06-16', status: 'present' },
  { date: '2025-06-17', status: 'absent' },
  { date: '2025-06-18', status: 'present' },
]

export default function ParentAttendancePage() {
  const { user } = useAuth()
  const [selectedChild, setSelectedChild] = useState(mockChildren[0].id)
  const [summary] = useState({ total: 20, present: 18, absent: 1, late: 1, percentage: 90 })

  const child = mockChildren.find(c => c.id === selectedChild)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-maroon-600" />
            Child Attendance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your children's attendance records.</p>
        </div>

        {mockChildren.length > 1 && (
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500 shadow-sm"
            >
              {mockChildren.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.class})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <CalendarDays className="w-24 h-24" />
          </div>
          <div className="relative z-10">
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
            <p className="text-sm font-medium text-green-600/80 dark:text-green-500">Present</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-500/10 rounded-xl">
            <XCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{summary.absent}</p>
            <p className="text-sm font-medium text-red-600/80 dark:text-red-500">Absent</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
            <Clock className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{summary.late}</p>
            <p className="text-sm font-medium text-orange-600/80 dark:text-orange-500">Late</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-bold dark:text-white mb-4">Recent Records for {child?.name}</h3>
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
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'}`}
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
    </div>
  )
}
