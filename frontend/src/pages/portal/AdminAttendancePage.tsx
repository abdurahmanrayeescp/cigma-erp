import { useEffect, useState } from 'react'
import { CheckSquare, Calendar, Users, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { attendanceApi, academicsApi } from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ClassObj {
  _id: string
  className: string
  division: string
}

export default function AdminAttendancePage() {
  const [classes, setClasses] = useState<ClassObj[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    academicsApi.getClasses()
      .then(res => {
        if (res.success && res.data) {
          setClasses(res.data)
          if (res.data.length > 0) {
            setSelectedClass(res.data[0]._id)
          }
        }
      })
      .catch(err => console.error(err))

    attendanceApi.getAnalytics()
      .then(res => {
        if (res.success && res.data) {
          setAnalytics(res.data)
        }
      })
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    setLoading(true)
    const todayStr = new Date().toISOString().split('T')[0]
    attendanceApi.getClassAttendance(selectedClass, todayStr)
      .then(res => {
        if (res.success && res.data) {
          setAttendanceRecords(res.data)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [selectedClass])

  const chartData = analytics ? Object.keys(analytics).map(key => ({
    name: key,
    percentage: analytics[key]?.percentage || 100
  })) : [
    { name: 'Class 1', percentage: 95 },
    { name: 'Class 2', percentage: 92 },
    { name: 'Class 3', percentage: 88 }
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-maroon-600" />
          Attendance Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor real-time class attendance percentages, absentees, and weekly logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Class Selector and Today's Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-maroon-500" />
                Today's Class Roll
              </h3>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500 focus:border-maroon-500"
              >
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.className} - {c.division || 'A'}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No attendance marked for this class today.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                  <thead>
                    <tr className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-left bg-gray-50 dark:bg-white/5">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                    {attendanceRecords.map((record) => (
                      <tr key={record._id} className="text-sm">
                        <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white">
                          {record.student?.name || 'Unknown'}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                          }`}>
                            {record.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 italic">
                          {record.remarks || 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Analytics Graphs */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-maroon-500" />
              Class Averages
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="percentage" fill="#8B2500" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
