import { useEffect, useState } from 'react'
import { Users, Search, BookOpen, AlertCircle, Phone, ShieldAlert, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { teachersApi } from '@/lib/api'

interface ClassObj {
  _id: string
  className: string
  division: string
  classTeacher?: {
    name: string
  }
}

interface Student {
  _id: string
  name: string
  admissionNo: string
  gender: string
  parentId?: {
    fatherName?: string
    motherName?: string
    phone: string
  }
}

export default function TeacherClassesPage() {
  const [myClasses, setMyClasses] = useState<ClassObj[]>([])
  const [allClasses, setAllClasses] = useState<ClassObj[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassObj | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)

  useEffect(() => {
    teachersApi.getMyClasses()
      .then(res => {
        if (res.success && res.data) {
          setMyClasses(res.data.myClasses || [])
          setAllClasses(res.data.allClasses || [])
          
          // Auto select first class from myClasses or allClasses
          const initialClass = res.data.myClasses?.[0] || res.data.allClasses?.[0] || null
          setSelectedClass(initialClass)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingClasses(false))
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    setLoadingStudents(true)
    teachersApi.getClassStudents(selectedClass._id)
      .then(res => {
        if (res.success && res.data) {
          setStudents(res.data)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingStudents(false))
  }, [selectedClass])

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-maroon-600" />
          My Classes & Student Rosters
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review class lists, division assignments, and access parent contact cards for students.
        </p>
      </div>

      {loadingClasses ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Class Sidebar Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
              
              {/* My Classes */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Class (Teacher)</h3>
                {myClasses.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">No assigned home class.</p>
                ) : (
                  <div className="space-y-1">
                    {myClasses.map((cls) => (
                      <button
                        key={cls._id}
                        onClick={() => setSelectedClass(cls)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          selectedClass?._id === cls._id
                            ? 'bg-maroon-600 text-white shadow-sm'
                            : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{cls.className} - {cls.division || 'A'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* All Classes Browse */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">School Classes</h3>
                {allClasses.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">No other classes available.</p>
                ) : (
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {allClasses.map((cls) => (
                      <button
                        key={cls._id}
                        onClick={() => setSelectedClass(cls)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          selectedClass?._id === cls._id
                            ? 'bg-maroon-600 text-white shadow-sm'
                            : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{cls.className} - {cls.division || 'A'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Student list section */}
          <div className="lg:col-span-3">
            {selectedClass ? (
              <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-white/5">
                  <div>
                    <h3 className="text-base font-bold dark:text-white">
                      Class Roster: {selectedClass.className} - {selectedClass.division || 'A'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Class Teacher: {selectedClass.classTeacher?.name || 'Unassigned'}
                    </p>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search class students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white text-xs focus:ring-maroon-500 focus:border-maroon-500"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {loadingStudents ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span>No students found in this class.</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                      <thead className="bg-gray-50 dark:bg-white/5">
                        <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          <th className="px-6 py-3">Student Info</th>
                          <th className="px-6 py-3">Gender</th>
                          <th className="px-6 py-3">Guardian details</th>
                          <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                        {filteredStudents.map((student) => (
                          <tr key={student._id} className="text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{student.name}</p>
                              <p className="text-gray-500 dark:text-gray-400 mt-0.5">Adm No: {student.admissionNo}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 capitalize">
                              {student.gender}
                            </td>
                            <td className="px-6 py-4">
                              {student.parentId ? (
                                <div>
                                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    F: {student.parentId.fatherName || 'N/A'} | M: {student.parentId.motherName || 'N/A'}
                                  </p>
                                  <p className="text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-maroon-500" />
                                    {student.parentId.phone}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">No parent card</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {student.parentId?.phone ? (
                                <a 
                                  href={`tel:${student.parentId.phone}`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-maroon-50 dark:bg-maroon-900/10 text-maroon-700 dark:text-maroon-400 hover:bg-maroon-100 font-bold transition-colors"
                                >
                                  Call Parent
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-navy-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-white/5">
                <ShieldAlert className="w-12 h-12 text-maroon-500/80 mx-auto mb-4" />
                <h3 className="text-lg font-bold dark:text-white">No Classes Found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You are not assigned as a class teacher or subject teacher to any classes.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
