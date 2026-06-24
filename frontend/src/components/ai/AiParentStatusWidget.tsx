import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react'
import { aiApi } from '@/lib/api'

interface AiParentStatusWidgetProps {
  childrenList?: any[];
}

export default function AiParentStatusWidget({ childrenList = [] }: AiParentStatusWidgetProps) {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusData, setStatusData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (childrenList.length > 0) {
      setSelectedStudent(childrenList[0]._id)
    }
  }, [childrenList])

  useEffect(() => {
    if (!selectedStudent) return

    setLoading(true)
    setError(null)
    aiApi.getParentInsightsWidget(selectedStudent)
      .then(res => {
        if (res.success && res.data) {
          setStatusData(res.data)
        } else {
          setError(res.message || 'Could not load AI status.')
        }
      })
      .catch(() => setError('Failed to load real-time AI Insights.'))
      .finally(() => setLoading(false))
  }, [selectedStudent])

  if (loading && !statusData) {
    return (
      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-center min-h-[100px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon-600" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-maroon-600 to-amber-500 p-2.5 rounded-xl text-white shadow-md shadow-maroon-600/15">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              AI Child Status
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Quick AI-powered well-being check
            </p>
          </div>
        </div>

        {childrenList.length > 1 && (
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-1.5 text-xs font-semibold focus:ring-maroon-500"
          >
            {childrenList.map((c: any) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {statusData && (
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-4 border ${
              statusData.colorCode === 'red' ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' :
              statusData.colorCode === 'yellow' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' :
              'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              {statusData.colorCode === 'red' || statusData.colorCode === 'yellow' ? (
                <ShieldAlert className={`w-6 h-6 ${statusData.colorCode === 'red' ? 'text-red-600' : 'text-amber-600'}`} />
              ) : (
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              )}
              <p className={`font-bold ${
                statusData.colorCode === 'red' ? 'text-red-700 dark:text-red-400' :
                statusData.colorCode === 'yellow' ? 'text-amber-700 dark:text-amber-400' :
                'text-emerald-700 dark:text-emerald-400'
              }`}>
                {statusData.statusMsg}
              </p>
            </div>
          </motion.div>

          <Link
            to={`/portal/parent/insights/${selectedStudent}`}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-navy-950/50 hover:bg-gray-100 dark:hover:bg-navy-900 border border-gray-100 dark:border-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-maroon-600 dark:text-maroon-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">View Detailed AI Progress Report</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-colors" />
          </Link>
        </div>
      )}
    </div>
  )
}
