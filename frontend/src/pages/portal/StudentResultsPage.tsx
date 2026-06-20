import { useState } from 'react'
import { FileText, Download, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const MOCK_RESULTS = [
  { subject: 'Mathematics', maxMarks: 100, obtained: 92, grade: 'A+' },
  { subject: 'Science', maxMarks: 100, obtained: 88, grade: 'A' },
  { subject: 'English', maxMarks: 100, obtained: 75, grade: 'B+' },
  { subject: 'History', maxMarks: 100, obtained: 82, grade: 'A' },
]

export default function StudentResultsPage() {
  const { user } = useAuth()
  const [selectedExam, setSelectedExam] = useState('Mid-Term')
  const [academicYear, setAcademicYear] = useState('2025-2026')

  const totalMax = MOCK_RESULTS.reduce((acc, curr) => acc + curr.maxMarks, 0)
  const totalObtained = MOCK_RESULTS.reduce((acc, curr) => acc + curr.obtained, 0)
  const overallPercentage = ((totalObtained / totalMax) * 100).toFixed(2)

  const handleDownload = () => {
    // Usually point to window.open(`/api/marks/pdf?studentId=123&exam=Mid-Term`)
    alert('Downloading PDF marksheet...')
  }

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
        <button 
          onClick={handleDownload}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-200 dark:border-white/10"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex gap-4 mb-6 border-b border-gray-100 dark:border-white/5 pb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Academic Year</label>
            <select 
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam</label>
            <select 
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
            >
              <option value="Mid-Term">Mid-Term</option>
              <option value="Finals">Finals</option>
            </select>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-maroon-50 dark:bg-maroon-500/10 rounded-xl border border-maroon-100 dark:border-maroon-500/20">
            <p className="text-sm font-medium text-maroon-800/80 dark:text-maroon-400">Total Marks</p>
            <p className="text-2xl font-bold text-maroon-900 dark:text-maroon-300">{totalObtained} / {totalMax}</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
            <p className="text-sm font-medium text-blue-800/80 dark:text-blue-400">Overall Percentage</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{overallPercentage}%</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
            <p className="text-sm font-medium text-green-800/80 dark:text-green-400">Overall Grade</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">A</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Subject</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Max Marks</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Obtained</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {MOCK_RESULTS.map((res, idx) => (
                <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{res.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{res.maxMarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold text-center">{res.obtained}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2.5 py-1 text-sm font-bold rounded-md
                      ${res.grade.includes('A') ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' 
                      : res.grade.includes('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400'}`}
                    >
                      {res.grade}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Insight Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-500/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">AI Academic Insight</h3>
            <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400 text-xs font-bold rounded-full">
              Exceptional
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            The student is performing exceptionally well with an overall average of 84.25%. They show remarkable aptitude, particularly in Mathematics and Science. Continued focus will push them toward excellence.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
