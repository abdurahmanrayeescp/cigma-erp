import { useState } from 'react'
import { CheckSquare, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

// Mock Data
const MOCK_STUDENTS = [
  { id: '1', admissionNo: 'A2025001', name: 'Aarav Patel' },
  { id: '2', admissionNo: 'A2025002', name: 'Diya Sharma' },
  { id: '3', admissionNo: 'A2025003', name: 'Rohan Gupta' },
  { id: '4', admissionNo: 'A2025004', name: 'Sneha Verma' },
]

export default function TeacherAttendancePage() {
  const { user } = useAuth()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('class_1_a')
  
  // State for attendance tracking
  const [attendance, setAttendance] = useState<Record<string, string>>(
    MOCK_STUDENTS.reduce((acc, student) => ({ ...acc, [student.id]: 'present' }), {})
  )

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    // In reality: await attendanceApi.markAttendance(selectedClass, date, records)
    toast.success('Attendance saved successfully!')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-maroon-600" />
            Class Attendance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mark daily attendance for your classes.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" /> Save Attendance
        </button>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
            />
          </div>
          <div className="flex items-end">
             <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors">
               Fetch Roster
             </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Adm No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-navy-900 divide-y divide-gray-200 dark:divide-white/10">
              {MOCK_STUDENTS.map((student, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={student.id}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.admissionNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {['present', 'absent', 'leave', 'late'].map((status) => (
                        <label key={status} className={`
                          px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors border
                          ${attendance[student.id] === status 
                            ? status === 'present' ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                            : status === 'absent' ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                            : status === 'leave' ? 'bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                            : 'bg-orange-100 border-orange-500 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                            : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                          }
                        `}>
                          <input 
                            type="radio" 
                            name={`status-${student.id}`} 
                            className="sr-only"
                            checked={attendance[student.id] === status}
                            onChange={() => handleStatusChange(student.id, status)}
                          />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </label>
                      ))}
                    </div>
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
