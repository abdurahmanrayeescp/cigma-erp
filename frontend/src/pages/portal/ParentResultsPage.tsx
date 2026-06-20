import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const mockChildren = [
  { id: 'S10001', name: 'Aarav Patel', admissionNo: 'A2025001', class: 'Class 1 - A' },
  { id: 'S10002', name: 'Rohan Patel', admissionNo: 'A2025102', class: 'Class 3 - B' },
]

const MOCK_RESULTS = [
  { subject: 'Mathematics', maxMarks: 100, obtained: 92, grade: 'A+' },
  { subject: 'Science', maxMarks: 100, obtained: 88, grade: 'A' },
  { subject: 'English', maxMarks: 100, obtained: 75, grade: 'B+' },
  { subject: 'History', maxMarks: 100, obtained: 82, grade: 'A' },
]

export default function ParentResultsPage() {
  const { user } = useAuth()
  const [selectedChild, setSelectedChild] = useState(mockChildren[0].id)
  const [selectedExam, setSelectedExam] = useState('Mid-Term')
  const [academicYear, setAcademicYear] = useState('2025-2026')

  const child = mockChildren.find(c => c.id === selectedChild)

  const totalMax = MOCK_RESULTS.reduce((acc, curr) => acc + curr.maxMarks, 0)
  const totalObtained = MOCK_RESULTS.reduce((acc, curr) => acc + curr.obtained, 0)
  const overallPercentage = ((totalObtained / totalMax) * 100).toFixed(2)

  const handleDownload = () => {
    alert(`Downloading PDF marksheet for ${child?.name}...`)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-maroon-600" />
            Child Results
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your children's academic performance.</p>
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
          <div className="flex items-end ml-auto">
            <button 
              onClick={handleDownload}
              className="bg-maroon-50 hover:bg-maroon-100 dark:bg-maroon-500/10 dark:hover:bg-maroon-500/20 text-maroon-700 dark:text-maroon-400 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors border border-maroon-200 dark:border-maroon-500/30"
            >
              <Download className="w-4 h-4" /> Download PDF Marksheet
            </button>
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
      </div>
    </div>
  )
}
