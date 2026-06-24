import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Award, AlertTriangle, Activity, CheckCircle, BookOpen, Users } from 'lucide-react'
import { aiApi, teachersApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface AiInsightsWidgetProps {
  role: 'STUDENT' | 'PARENT' | 'TEACHER';
  referenceId?: string; // Student ID for student
  childrenList?: any[]; // Children list for parent
}

export default function AiInsightsWidget({ role, referenceId, childrenList = [] }: AiInsightsWidgetProps) {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [loading, setLoading] = useState(false)
  const [insightData, setInsightData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Teacher-specific state
  const [myClasses, setMyClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [classStudents, setClassStudents] = useState<any[]>([])

  useEffect(() => {
    if (role === 'STUDENT' && referenceId) {
      setSelectedStudent(referenceId)
    } else if (role === 'PARENT' && childrenList.length > 0) {
      setSelectedStudent(childrenList[0]._id)
    } else if (role === 'TEACHER') {
      setLoading(true)
      teachersApi.getMyClasses()
        .then(res => {
          if (res.success && res.data) {
            const classes = res.data.myClasses || res.data.allClasses || []
            setMyClasses(classes)
            if (classes.length > 0) {
              setSelectedClass(classes[0]._id)
            }
          }
        })
        .catch(() => setError('Failed to load class metrics.'))
        .finally(() => setLoading(false))
    }
  }, [role, referenceId, childrenList])

  // Fetch class students if teacher selects a class
  useEffect(() => {
    if (role !== 'TEACHER' || !selectedClass) return

    setLoading(true)
    teachersApi.getClassStudents(selectedClass)
      .then(res => {
        if (res.success && res.data) {
          // Let's attach academic details dynamically for the class overview
          const studentPromises = res.data.map(async (student: any) => {
            try {
              const planRes = await aiApi.getStudyPlan(student._id)
              return {
                ...student,
                attendance: planRes.success ? planRes.data.attendance : 95,
                homeworkCompletion: planRes.success ? planRes.data.homeworkCompletion : 85,
                riskLevel: planRes.success ? planRes.data.riskLevel : 'Low'
              }
            } catch {
              return { ...student, attendance: 95, homeworkCompletion: 85, riskLevel: 'Low' }
            }
          })
          Promise.all(studentPromises).then(results => {
            setClassStudents(results)
          })
        }
      })
      .catch(() => setError('Failed to fetch class student list.'))
      .finally(() => setLoading(false))
  }, [role, selectedClass])

  // Fetch student study plan insight metrics
  useEffect(() => {
    if ((role !== 'STUDENT' && role !== 'PARENT') || !selectedStudent) return

    setLoading(true)
    setError(null)
    aiApi.getStudyPlan(selectedStudent)
      .then(res => {
        if (res.success && res.data) {
          setInsightData(res.data)
        } else {
          setError(res.message || 'Could not compile insights.')
        }
      })
      .catch(() => setError('Failed to load real-time AI Insights.'))
      .finally(() => setLoading(false))
  }, [role, selectedStudent])

  if (loading && !insightData && classStudents.length === 0) {
    return (
      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600" />
      </div>
    )
  }

  // Render for Student / Parent
  if (role === 'STUDENT' || role === 'PARENT') {
    return (
      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6 relative overflow-hidden">
        {/* Glow Background effect */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-maroon-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-maroon-600 to-amber-500 p-2.5 rounded-xl text-white shadow-md shadow-maroon-600/15">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-1.5">
                AI Academic Insights
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time recommendations for {insightData?.studentName || 'Student'}
              </p>
            </div>
          </div>

          {role === 'PARENT' && childrenList.length > 1 && (
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
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        {insightData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Core Scores */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Metrics Overview</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1
                  ${insightData.riskLevel === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                  : insightData.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'}`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  {insightData.riskLevel} Risk
                </span>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-navy-950/40 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Attendance Rate</span>
                    <span>{insightData.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${insightData.attendance >= 85 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${insightData.attendance}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    <span>Homework Submissions</span>
                    <span>{insightData.homeworkCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-1.5 rounded-full bg-blue-500"
                      style={{ width: `${insightData.homeworkCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Areas & focus</span>
              <div className="space-y-3 bg-gray-50 dark:bg-navy-950/40 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                <div>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1.5">
                    <Award className="w-3.5 h-3.5 text-green-500" /> Key Strengths
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {insightData.strengths.slice(0, 2).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 text-[10px] font-bold rounded bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-500/20">{s}</span>
                    ))}
                    {insightData.strengths.length === 0 && <span className="text-[10px] text-gray-400">None recorded</span>}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> Weak Areas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {insightData.weaknesses.slice(0, 2).map((w: string) => (
                      <span key={w} className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20">{w}</span>
                    ))}
                    {insightData.weaknesses.length === 0 && <span className="text-[10px] text-gray-400">None recorded</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Top Recommendations */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Top Suggestions</span>
                <div className="space-y-2">
                  {insightData.recommendations.slice(0, 2).map((rec: string, i: number) => (
                    <div key={i} className="flex gap-2 items-start text-xs text-gray-655 dark:text-gray-350 leading-relaxed font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={`/portal/${role.toLowerCase()}/study-plan`}
                className="inline-flex items-center gap-1 text-xs font-bold text-maroon-600 hover:text-maroon-700 dark:text-maroon-400 dark:hover:text-maroon-300 transition-colors mt-4 sm:mt-0"
              >
                View Full Study Plan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render for Teacher
  return (
    <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-maroon-600 to-amber-500 p-2.5 rounded-xl text-white shadow-md shadow-maroon-600/15">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">AI Classroom Risk Insights</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Identify students requiring study plan adjustments</p>
          </div>
        </div>

        {myClasses.length > 1 && (
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-1.5 text-xs font-semibold focus:ring-maroon-500"
          >
            {myClasses.map((c: any) => (
              <option key={c._id} value={c._id}>{c.className} - {c.division}</option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {classStudents.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">No student records linked to selected class.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="py-2.5">Student</th>
                <th className="py-2.5">Attendance</th>
                <th className="py-2.5">Homework</th>
                <th className="py-2.5">Risk Level</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.slice(0, 5).map((student) => (
                <tr key={student._id} className="border-b border-gray-55 dark:border-white/5 text-gray-800 dark:text-gray-200">
                  <td className="py-3 font-bold">{student.name}</td>
                  <td className="py-3 font-semibold">{student.attendance}%</td>
                  <td className="py-3 font-semibold">{student.homeworkCompletion}%</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 font-bold rounded-full text-[10px]
                      ${student.riskLevel === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                      : student.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'}`}
                    >
                      {student.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to="/portal/teacher/study-plan"
                      className="text-maroon-600 dark:text-maroon-400 hover:underline font-bold"
                    >
                      Manage Plan
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-white/5">
        <Link
          to="/portal/teacher/study-plan"
          className="inline-flex items-center gap-1 text-xs font-bold text-maroon-600 hover:text-maroon-700 dark:text-maroon-400 dark:hover:text-maroon-300 transition-colors"
        >
          Generate Student Study Plans <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
