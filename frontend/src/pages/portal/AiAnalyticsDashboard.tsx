import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { aiApi } from '@/lib/api'
import { Activity, Download, FileText, LayoutDashboard, Eye, Calendar, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AiAnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const res = await aiApi.getAiAnalytics()
      if (res.success) {
        setData(res.data)
      } else {
        toast.error(res.message || 'Failed to load AI analytics')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-10 h-10 text-maroon-500 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading AI Usage Analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const stats = [
    { label: 'Total Insights Viewed', value: data.stats.reportsGenerated, icon: Eye, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    { label: 'PDFs Downloaded', value: data.stats.pdfsDownloaded, icon: Download, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
    { label: 'Weekly Summaries', value: data.stats.weeklySummaries, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/20' },
    { label: 'Widget Views', value: data.stats.widgetViews, icon: LayoutDashboard, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' },
    { label: 'Total AI Requests', value: data.stats.totalRequests, icon: Activity, color: 'text-maroon-500', bg: 'bg-maroon-100 dark:bg-maroon-500/20' }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-maroon-600" />
            AI Usage Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            System-wide usage statistics for AI Parent Anxiety Reducer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-navy-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value.toLocaleString()}
            </h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Recent AI Activity Logs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-navy-900/50 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Student</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {data.logs.map((log: any) => (
                <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-navy-900/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 dark:bg-navy-900">
                      {log.action}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-maroon-600 dark:text-maroon-400">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {log.userId?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {log.studentId?.name || 'N/A'}
                  </td>
                </tr>
              ))}
              {data.logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No recent activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
