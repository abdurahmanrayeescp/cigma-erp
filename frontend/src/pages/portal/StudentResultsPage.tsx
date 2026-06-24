import { useEffect, useState } from 'react'
import { FileText, Download, Sparkles, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { marksApi } from '@/lib/api'

interface MarkRecord {
  _id: string
  subject: string
  exam: string
  marksObtained: number
  maxMarks: number
  grade?: string
  academicYear?: string
}

export default function StudentResultsPage() {
  const { user } = useAuth()
  const [allMarks, setAllMarks]       = useState<MarkRecord[]>([])
  const [exams, setExams]             = useState<string[]>([])
  const [years, setYears]             = useState<string[]>([])
  const [selectedExam, setSelectedExam]   = useState('')
  const [academicYear, setAcademicYear]   = useState('')
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    const studentId = user?.referenceId
    if (!studentId) {
      setLoading(false)
      setError('Student profile not linked. Please contact admin.')
      return
    }
    marksApi.getStudentMarks(studentId)
      .then(res => {
        if (res.success && res.data) {
          const marks: MarkRecord[] = res.data
          setAllMarks(marks)
          const uniqueExams = [...new Set(marks.map(m => m.exam))].filter(Boolean)
          const uniqueYears = [...new Set(marks.map(m => m.academicYear))].filter(Boolean) as string[]
          setExams(uniqueExams)
          setYears(uniqueYears)
          if (uniqueExams.length > 0) setSelectedExam(uniqueExams[0])
          if (uniqueYears.length > 0) setAcademicYear(uniqueYears[0])
        }
      })
      .catch(() => setError('Failed to load marks.'))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = allMarks.filter(m =>
    (!selectedExam || m.exam === selectedExam) &&
    (!academicYear || m.academicYear === academicYear)
  )

  const totalMax      = filtered.reduce((a, m) => a + m.maxMarks, 0)
  const totalObtained = filtered.reduce((a, m) => a + m.marksObtained, 0)
  const percentage    = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0'
  const overallGrade  = parseFloat(percentage) >= 90 ? 'A+' : parseFloat(percentage) >= 80 ? 'A' : parseFloat(percentage) >= 70 ? 'B+' : parseFloat(percentage) >= 60 ? 'B' : 'C'

  const gradeBadge = (grade?: string) => {
    if (!grade) return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
    if (grade.includes('A')) return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400'
    if (grade.includes('B')) return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'
    return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
  }

  const insightText = parseFloat(percentage) >= 85
    ? `Excellent performance with ${percentage}% overall! Keep up the outstanding academic work.`
    : parseFloat(percentage) >= 70
    ? `Good performance at ${percentage}%. Focus on weaker subjects to push towards excellence.`
    : `Your overall score is ${percentage}%. Consider seeking extra help and increasing study time.`

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-maroon-600" />
            My Results
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your academic performance and download marksheets.</p>
        </div>
        {filtered.length > 0 && (
          <button
            onClick={() => window.open(`${import.meta.env.VITE_API_URL}/marks/pdf?studentId=${user?.referenceId}&exam=${selectedExam}`, '_blank')}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors border border-gray-200 dark:border-white/10 text-sm"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600" /></div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-white/5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Academic Year</label>
              <select value={academicYear} onChange={e => setAcademicYear(e.target.value)}
                className="rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Exam</label>
              <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}
                className="rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500">
                {exams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>
          </div>

          {/* Summary Stats */}
          {filtered.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-maroon-50 dark:bg-maroon-500/10 rounded-xl border border-maroon-100 dark:border-maroon-500/20">
                <p className="text-sm font-medium text-maroon-800/80 dark:text-maroon-400">Total Marks</p>
                <p className="text-2xl font-bold text-maroon-900 dark:text-maroon-300">{totalObtained} / {totalMax}</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <p className="text-sm font-medium text-blue-800/80 dark:text-blue-400">Overall Percentage</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{percentage}%</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
                <p className="text-sm font-medium text-green-800/80 dark:text-green-400">Overall Grade</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{overallGrade}</p>
              </div>
            </div>
          )}

          {/* Marks Table */}
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400 dark:text-gray-500">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No marks found for the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Subject</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Max Marks</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Obtained</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filtered.map((res, idx) => (
                    <motion.tr key={res._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.06 }}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{res.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">{res.maxMarks}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white text-center">{res.marksObtained}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-sm font-bold rounded-md ${gradeBadge(res.grade)}`}>{res.grade || '—'}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* AI Insight */}
          {filtered.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">AI Academic Insight</h3>
                <span className={`ml-auto px-3 py-1 text-xs font-bold rounded-full ${
                  parseFloat(percentage) >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' :
                  parseFloat(percentage) >= 70 ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400' :
                  'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                }`}>
                  {parseFloat(percentage) >= 85 ? 'Excellent' : parseFloat(percentage) >= 70 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insightText}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
