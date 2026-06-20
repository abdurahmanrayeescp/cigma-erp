import { useState } from 'react'
import { FileEdit, Save, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const MOCK_STUDENTS = [
  { id: '1', admissionNo: 'A2025001', name: 'Aarav Patel' },
  { id: '2', admissionNo: 'A2025002', name: 'Diya Sharma' },
  { id: '3', admissionNo: 'A2025003', name: 'Rohan Gupta' },
  { id: '4', admissionNo: 'A2025004', name: 'Sneha Verma' },
]

export default function TeacherMarksPage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState('class_1_a')
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [selectedExam, setSelectedExam] = useState('Mid-Term')
  const [maxMarks, setMaxMarks] = useState(100)

  const [marks, setMarks] = useState<Record<string, string>>({})

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks(prev => ({ ...prev, [studentId]: value }))
  }

  const handleSave = async () => {
    const invalid = Object.values(marks).some(v => Number(v) > maxMarks || Number(v) < 0)
    if (invalid) {
      toast.error(`Marks must be between 0 and ${maxMarks}`)
      return
    }
    // API call goes here
    toast.success('Marks uploaded successfully!')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-maroon-600" />
            Enter Marks
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload and edit student marks and generate grades.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" /> Save Marks
        </button>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
            >
              <option value="class_1_a">Class 1 - A</option>
              <option value="class_1_b">Class 1 - B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam</label>
            <select 
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
            >
              <option value="Mid-Term">Mid-Term</option>
              <option value="Finals">Finals</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Marks</label>
            <input 
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
            />
          </div>
          <div className="flex items-end">
             <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors">
               Fetch Students
             </button>
          </div>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Adm No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Marks Obtained</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auto Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-navy-900 divide-y divide-gray-200 dark:divide-white/10">
              {MOCK_STUDENTS.map((student, idx) => {
                const obtained = Number(marks[student.id] || 0)
                const percentage = marks[student.id] ? (obtained / maxMarks) * 100 : null
                let grade = '-'
                if (percentage !== null) {
                  if (percentage >= 90) grade = 'A+'
                  else if (percentage >= 80) grade = 'A'
                  else if (percentage >= 70) grade = 'B+'
                  else if (percentage >= 60) grade = 'B'
                  else if (percentage >= 50) grade = 'C+'
                  else if (percentage >= 40) grade = 'C'
                  else grade = 'D'
                }

                return (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={student.id}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.admissionNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="number"
                        min="0"
                        max={maxMarks}
                        value={marks[student.id] || ''}
                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                        placeholder="0"
                        className="w-24 rounded-md border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-1.5 focus:ring-maroon-500 focus:border-maroon-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-sm font-bold rounded-md
                        ${grade.includes('A') ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' 
                        : grade.includes('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'
                        : grade.includes('C') ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'
                        : grade === 'D' ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-400'}`}
                      >
                        {grade}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
