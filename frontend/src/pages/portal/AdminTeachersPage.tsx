import { useEffect, useState } from 'react'
import { GraduationCap, Search, Mail, Phone, BookOpen, Banknote } from 'lucide-react'
import { motion } from 'framer-motion'
import { teachersApi } from '@/lib/api'

interface Teacher {
  _id: string
  name: string
  employeeId: string
  department: string
  phone: string
  email: string
  salary: number
  isActive: boolean
  subjects: Array<{
    _id: string
    name: string
    code: string
  }>
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    teachersApi.list()
      .then(res => {
        if (res.success && res.data) {
          setTeachers(res.data)
        }
      })
      .catch(err => console.error('Failed to load teachers:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-maroon-600" />
            Teachers Directory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse and manage teacher roles, departments, payroll and subject assignments.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <input 
            type="text" 
            placeholder="Search teacher, department, ID..."
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
      ) : filteredTeachers.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/5">
          <p className="text-gray-500 dark:text-gray-400">No teachers found matching search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher, idx) => (
            <motion.div
              key={teacher._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-maroon-600 transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                    Emp ID: {teacher.employeeId} • {teacher.department} Department
                  </p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  teacher.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                }`}>
                  {teacher.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              {/* Details List */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-3.5 h-3.5 text-maroon-500" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 truncate">
                  <Mail className="w-3.5 h-3.5 text-maroon-500" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Banknote className="w-3.5 h-3.5 text-maroon-500" />
                  <span>Basic Salary: ₹{teacher.salary?.toLocaleString() || 'N/A'}</span>
                </div>

                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="mt-2.5 bg-gray-50 dark:bg-white/5 p-3 rounded-lg">
                    <p className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 mb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-maroon-500" />
                      Assigned Subjects:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((sub) => (
                        <span 
                          key={sub._id}
                          className="bg-maroon-50/50 dark:bg-maroon-900/20 text-maroon-700 dark:text-maroon-400 text-[10px] font-bold px-2 py-0.5 rounded"
                        >
                          {sub.name} ({sub.code})
                        </span>
                      ))}
                    </div>
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
