import { useEffect, useState } from 'react'
import { Sparkles, Download, AlertTriangle, BookOpen, Clock, Activity, Award, CheckCircle2, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { aiApi, teachersApi } from '@/lib/api'
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import toast from 'react-hot-toast'

interface Child {
  _id: string
  name: string
  class: string
  division: string
}

interface ClassRecord {
  _id: string
  className: string
  division: string
}

interface StudentRecord {
  _id: string
  name: string
  admissionNo: string
}

interface WeeklyEntry {
  day: string
  subject: string
  duration: string
}

interface StudyPlanData {
  studentName: string
  attendance: number
  homeworkCompletion: number
  strengths: string[]
  weaknesses: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
  recommendedStudyHours: number
  weeklyPlan: WeeklyEntry[]
  recommendations: string[]
}

export default function StudentStudyPlanPage() {
  const { user } = useAuth()
  const role = user?.role || 'STUDENT'

  // Parent profile properties
  const childrenList: Child[] = user?.referenceData?.children || []

  // Teacher properties
  const [myClasses, setMyClasses] = useState<ClassRecord[]>([])
  const [allClasses, setAllClasses] = useState<ClassRecord[]>([])
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [selectedClass, setSelectedClass] = useState('')

  // Selected student targets
  const [selectedStudent, setSelectedStudent] = useState('')
  const [planData, setPlanData] = useState<StudyPlanData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize dropdown options based on role
  useEffect(() => {
    if (role === 'STUDENT') {
      const sId = user?.referenceId
      if (sId) setSelectedStudent(sId)
    } else if (role === 'PARENT' && childrenList.length > 0) {
      setSelectedStudent(childrenList[0]._id)
    } else if (role === 'TEACHER') {
      setLoading(true)
      teachersApi.getMyClasses()
        .then(res => {
          if (res.success && res.data) {
            setMyClasses(res.data.myClasses || [])
            setAllClasses(res.data.allClasses || [])
            const initialClass = res.data.myClasses?.[0]?._id || res.data.allClasses?.[0]?._id
            if (initialClass) setSelectedClass(initialClass)
          }
        })
        .catch(() => setError('Failed to load classes.'))
        .finally(() => setLoading(false))
    }
  }, [user])

  // Fetch class students if role is teacher
  useEffect(() => {
    if (role !== 'TEACHER' || !selectedClass) return

    setLoading(true)
    teachersApi.getClassStudents(selectedClass)
      .then(res => {
        if (res.success && res.data) {
          setStudents(res.data)
          if (res.data.length > 0) setSelectedStudent(res.data[0]._id)
          else {
            setSelectedStudent('')
            setPlanData(null)
          }
        }
      })
      .catch(() => setError('Failed to load students.'))
      .finally(() => setLoading(false))
  }, [selectedClass])

  // Fetch study plan metrics when selected student target updates
  useEffect(() => {
    if (!selectedStudent) return

    setLoading(true)
    setError(null)
    aiApi.getStudyPlan(selectedStudent)
      .then(res => {
        if (res.success && res.data) {
          setPlanData(res.data)
        } else {
          setError(res.message || 'Could not fetch study plan.')
        }
      })
      .catch(() => setError('Failed to generate study plan details.'))
      .finally(() => setLoading(false))
  }, [selectedStudent])

  const handleDownloadPDF = () => {
    if (!selectedStudent) return
    const apiBase = import.meta.env.VITE_API_URL || '/api'
    window.open(`${apiBase}/ai/study-plan/${selectedStudent}/pdf`, '_blank')
    toast.success('Downloading Study Plan PDF...')
  }

  // Prepping recharts bar data
  const chartData = planData ? [
    { name: 'Attendance', percentage: planData.attendance, fill: '#8884d8' },
    { name: 'Homework', percentage: planData.homeworkCompletion, fill: '#83a6ed' }
  ] : []

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-maroon-600 animate-pulse" />
            AI Personalized Study Plan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Dynamic study scheduler and metrics optimization using local algorithms.
          </p>
        </div>

        {/* Dropdowns based on User Role */}
        <div className="flex flex-wrap gap-4 items-end">
          {role === 'PARENT' && childrenList.length > 1 && (
            <div className="min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Select Child</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500 shadow-sm"
              >
                {childrenList.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.class})</option>
                ))}
              </select>
            </div>
          )}

          {role === 'TEACHER' && (
            <>
              <div className="min-w-[160px]">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500 shadow-sm"
                >
                  <optgroup label="My Classes">
                    {myClasses.map(c => <option key={c._id} value={c._id}>{c.className} - {c.division}</option>)}
                  </optgroup>
                  <optgroup label="Other Classes">
                    {allClasses.filter(c => !myClasses.some(mc => mc._id === c._id)).map(c => (
                      <option key={c._id} value={c._id}>{c.className} - {c.division}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="min-w-[180px]">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  disabled={students.length === 0}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500 shadow-sm disabled:opacity-50"
                >
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.admissionNo})</option>
                  ))}
                  {students.length === 0 && <option value="">No students found</option>}
                </select>
              </div>
            </>
          )}

          {planData && (
            <button
              onClick={handleDownloadPDF}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors border border-gray-200 dark:border-white/10 text-sm shadow-sm h-10"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600" /></div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : !planData ? (
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/5 shadow-sm">
          <Sparkles className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Please select a student to load their study plan recommendations.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Attendance Score Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Attendance Rate</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{planData.attendance}%</h3>
              </div>
              <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                <div 
                  className={`h-2 rounded-full ${planData.attendance >= 85 ? 'bg-green-500' : planData.attendance >= 75 ? 'bg-orange-500' : 'bg-red-500'}`}
                  style={{ width: `${planData.attendance}%` }}
                />
              </div>
            </motion.div>

            {/* Homework Completion */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Homework Rate</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{planData.homeworkCompletion}%</h3>
              </div>
              <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 mt-4 overflow-hidden">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${planData.homeworkCompletion}%` }}
                />
              </div>
            </motion.div>

            {/* Daily Recommended Hours */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Recommended study</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{planData.recommendedStudyHours} Hrs/Day</h3>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Calculated daily targets.
              </p>
            </motion.div>

            {/* Risk Indicator Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between
                ${planData.riskLevel === 'High' ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-950 dark:text-red-400'
                : planData.riskLevel === 'Medium' ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-950 dark:text-orange-400'
                : 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20 text-green-950 dark:text-green-400'}`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-85">Academic Risk Level</p>
                <h3 className="text-2xl font-bold mt-1 flex items-center gap-2">
                  <Activity className="w-6 h-6 animate-pulse" />
                  {planData.riskLevel} Risk
                </h3>
              </div>
              <p className="text-xs opacity-75 mt-3 font-medium">
                {planData.riskLevel === 'High' ? 'Requires immediate action plans.'
                : planData.riskLevel === 'Medium' ? 'Precautionary review advised.'
                : 'Maintains excellent standing.'}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Recharts Analytics Bar */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 md:col-span-1"
            >
              <h3 className="text-base font-bold dark:text-white mb-4">Core Statistics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#888888" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0a0e30', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="percentage" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Strengths & Weaknesses Cards */}
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 md:col-span-2 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-green-500" />
                    Key Strengths (Score &ge; 75%)
                  </h4>
                  {planData.strengths.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500">No core strength subjects recorded yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {planData.strengths.map(s => (
                        <span key={s} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Weak Areas (Score &lt; 60%)
                  </h4>
                  {planData.weaknesses.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500">Doing well in all recorded subjects!</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {planData.weaknesses.map(w => (
                        <span key={w} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20">
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Study Recommendations */}
              <div className="border-t border-gray-50 dark:border-white/5 pt-6">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-maroon-600" />
                  AI Study Recommendations
                </h4>
                <div className="space-y-3">
                  {planData.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 items-start text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Weekly Scheduler Timetable */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5"
          >
            <h3 className="text-base font-bold dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-maroon-600" />
              Weekly AI Recommended Study Planner
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {planData.weeklyPlan.map((dayPlan, idx) => (
                <div key={dayPlan.day} className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-navy-950 flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{dayPlan.day}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base mt-1.5">{dayPlan.subject}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-4 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {dayPlan.duration}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      )}
    </div>
  )
}
