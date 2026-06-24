import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { aiApi } from '@/lib/api'
import { ShieldCheck, ShieldAlert, HeartPulse, Sparkles, Download, ArrowLeft, Lightbulb, BookOpen, Clock, Activity, CheckCircle2, TrendingUp, Award, Zap } from 'lucide-react'
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import toast from 'react-hot-toast'

export default function ParentInsightsPage() {
  const { studentId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (studentId) {
      loadInsights()
    }
  }, [studentId])

  const loadInsights = async () => {
    try {
      setLoading(true)
      const res = await aiApi.getParentInsights(studentId!)
      if (res.success) {
        setData(res.data)
      } else {
        toast.error(res.message || 'Failed to load insights')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      toast.loading('Generating Insight Report...', { id: 'pdf-toast' })
      const BASE = import.meta.env.VITE_API_URL ?? '/api'
      
      const token = localStorage.getItem('token') || ''
      
      const res = await fetch(`${BASE}/ai/parent-insights/${studentId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Failed to download PDF')
        
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Parent_Insight_${data?.studentName || 'Report'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Report downloaded successfully!', { id: 'pdf-toast' })
    } catch (err: any) {
      toast.error(err.message || 'Error downloading PDF', { id: 'pdf-toast' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="w-10 h-10 text-maroon-500 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Generating AI Child Insights...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const getRiskColor = (risk: string) => {
    if (risk === 'HIGH') return 'text-red-600 bg-red-100 dark:bg-red-500/20'
    if (risk === 'MEDIUM') return 'text-amber-600 bg-amber-100 dark:bg-amber-500/20'
    return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20'
  }

  // Dummy chart data for trend (in real app, this might come from API historical data)
  const trendData = [
    { name: 'Term 1', marks: Math.max(0, data.overallAvgMarks - 5) },
    { name: 'Term 2', marks: data.overallAvgMarks },
    { name: 'Term 3', marks: Math.min(100, data.overallAvgMarks + 2) }
  ]

  const healthData = [{ name: 'Health', value: data.academicHealthScore, fill: data.academicHealthScore > 80 ? '#10b981' : data.academicHealthScore > 60 ? '#f59e0b' : '#ef4444' }]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/50 dark:bg-navy-800/50 hover:bg-white dark:hover:bg-navy-800 rounded-xl border border-gray-100 dark:border-white/5 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              AI Parent Insights <Sparkles className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personalized wellbeing and progress report for {data.studentName}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleDownloadPdf}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-maroon-600 hover:bg-maroon-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-maroon-500/20"
        >
          <Download className="w-4 h-4" />
          Download PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Overall Wellbeing */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border border-white/20 dark:border-navy-700 rounded-3xl p-6 shadow-xl"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-maroon-500" /> Overall Wellbeing
            </h3>

            <div className="flex flex-col items-center mb-6">
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" 
                    barSize={15} data={healthData} startAngle={180} endAngle={0}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                    <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 dark:fill-white text-3xl font-bold">
                      {data.academicHealthScore}
                    </text>
                    <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 dark:fill-gray-400 text-xs font-medium">
                      Health Score
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-navy-950/50 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Risk Level</p>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getRiskColor(data.riskLevel)}`}>
                  {data.riskLevel === 'HIGH' ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  {data.riskLevel}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-navy-950/50 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Trend</p>
                <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> {data.academicTrend}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-indigo-200" />
              <h3 className="font-bold text-lg">Future Readiness Index</h3>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-extrabold tracking-tight">{data.futureReadinessIndex}</span>
              <span className="text-indigo-200 font-medium">/ 100</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-indigo-100 mb-1">
                  <span>Discipline</span>
                  <span>{data.disciplineScore}</span>
                </div>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${data.disciplineScore}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-indigo-100 mb-1">
                  <span>Consistency</span>
                  <span>{data.consistencyScore}</span>
                </div>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${data.consistencyScore}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-indigo-100 mb-1">
                  <span>Learning Growth</span>
                  <span>{data.learningGrowthScore}</span>
                </div>
                <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${data.learningGrowthScore}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Explanations & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border border-white/20 dark:border-navy-700 rounded-3xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-maroon-500/5 dark:bg-maroon-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-amber-500" /> What You Should Know
            </h3>

            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              <p>{data.aiExplanation}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border border-emerald-100 dark:border-emerald-500/20 rounded-3xl p-6 shadow-xl"
            >
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" /> Strengths
              </h3>
              <ul className="space-y-3">
                {data.strengths.map((s: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Excels in {s}
                  </li>
                ))}
                {data.attendanceHealth.score >= 90 && (
                  <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Excellent Attendance ({data.attendanceHealth.score}%)
                  </li>
                )}
                {data.homeworkHealth.score >= 90 && (
                  <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Consistent Homework Completion
                  </li>
                )}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border border-amber-100 dark:border-amber-500/20 rounded-3xl p-6 shadow-xl"
            >
              <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" /> Focus Areas
              </h3>
              <ul className="space-y-3">
                {data.weaknesses.map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    Opportunity for improvement in {w}
                  </li>
                ))}
                {data.attendanceHealth.score < 80 && (
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    Attendance rate ({data.attendanceHealth.score}%) needs attention
                  </li>
                )}
                {data.missingHomeworkCount > 0 && (
                  <li className="flex items-start gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    {data.missingHomeworkCount} pending homework assignments
                  </li>
                )}
                {data.weaknesses.length === 0 && data.attendanceHealth.score >= 80 && data.missingHomeworkCount === 0 && (
                  <li className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
                    No major focus areas identified at this time.
                  </li>
                )}
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-maroon-50/50 dark:bg-maroon-900/10 backdrop-blur-xl border border-maroon-100 dark:border-maroon-500/20 rounded-3xl p-6 shadow-xl"
          >
            <h3 className="font-bold text-maroon-800 dark:text-maroon-300 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Recommended Parent Actions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.recommendations.map((rec: string, i: number) => (
                <div key={i} className="bg-white/60 dark:bg-navy-800/60 p-4 rounded-2xl flex items-start gap-3 border border-white/40 dark:border-white/5">
                  <div className="bg-maroon-100 dark:bg-maroon-500/20 p-2 rounded-lg shrink-0">
                    {i === 0 ? <Clock className="w-4 h-4 text-maroon-600 dark:text-maroon-400" /> : <BookOpen className="w-4 h-4 text-maroon-600 dark:text-maroon-400" />}
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
