import { useEffect, useState } from 'react'
import { Users, Search, Mail, Phone, Calendar, UserCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { studentsApi } from '@/lib/api'

interface Student {
  _id: string
  name: string
  admissionNo: string
  studentId: string
  class: string
  division: string
  gender: string
  dateOfBirth?: string
  status: string
  parentId?: {
    fatherName?: string
    motherName?: string
    phone: string
    email?: string
  }
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    studentsApi.list()
      .then(res => {
        if (res.success && res.data) {
          setStudents(res.data)
        }
      })
      .catch(err => console.error('Failed to load students:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-maroon-600" />
            Students Directory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse and manage all registered students and their parent profiles.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <input 
            type="text" 
            placeholder="Search name, class, admission no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white text-sm focus:ring-maroon-500 focus:border-maroon-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/5">
          <p className="text-gray-500 dark:text-gray-400">No students found matching search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, idx) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-maroon-600 transition-colors">
                    {student.name}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                    ID: {student.admissionNo} • Class {student.class}-{student.division || 'A'}
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  student.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                }`}>
                  {student.status.toUpperCase()}
                </span>
              </div>

              {/* Details List */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-2 text-xs">
                {student.dateOfBirth && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-3.5 h-3.5 text-maroon-500" />
                    <span>DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {student.parentId && (
                  <div className="space-y-1 bg-gray-50 dark:bg-white/5 p-3 rounded-lg mt-2">
                    <p className="font-semibold text-gray-700 dark:text-gray-200">Parent Info:</p>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <UserCheck className="w-3 h-3 text-maroon-500" />
                      <span>F: {student.parentId.fatherName || 'N/A'} | M: {student.parentId.motherName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone className="w-3 h-3 text-maroon-500" />
                      <span>{student.parentId.phone}</span>
                    </div>
                    {student.parentId.email && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 truncate">
                        <Mail className="w-3 h-3 text-maroon-500" />
                        <span className="truncate">{student.parentId.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
