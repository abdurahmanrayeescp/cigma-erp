import { useEffect, useState } from 'react'
import { BookOpen, Users, FolderOpen, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { academicsApi } from '@/lib/api'

interface ClassObj {
  _id: string
  className: string
  division: string
  classTeacher?: {
    name: string
    employeeId: string
  }
  subjects: string[]
  students: string[]
  academicYear: string
}

interface Subject {
  _id: string
  name: string
  code: string
}

export default function AdminAcademicsPage() {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes')
  const [classes, setClasses] = useState<ClassObj[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, subjectsRes] = await Promise.all([
          academicsApi.getClasses(),
          academicsApi.getSubjects()
        ])
        if (classesRes.success && classesRes.data) {
          setClasses(classesRes.data)
        }
        if (subjectsRes.success && subjectsRes.data) {
          setSubjects(subjectsRes.data)
        }
      } catch (err) {
        console.error('Failed to load academic data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-maroon-600" />
          Academics Administration
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review class lists, division assignments, class teachers, and subject curriculum.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-white/5 gap-4">
        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'classes'
              ? 'border-maroon-600 text-maroon-600 dark:text-maroon-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FolderOpen className="w-4 h-4" /> Classes ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'subjects'
              ? 'border-maroon-600 text-maroon-600 dark:text-maroon-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" /> Subjects ({subjects.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
        </div>
      ) : activeTab === 'classes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, idx) => (
            <motion.div
              key={cls._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-maroon-600 transition-colors">
                    {cls.className} - {cls.division || 'A'}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Academic Year: {cls.academicYear || '2025-2026'}
                  </p>
                </div>
                <div className="bg-maroon-500/10 text-maroon-600 dark:text-maroon-400 p-2 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-3 text-xs">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Class Teacher:</span>
                  <span className="text-gray-900 dark:text-white font-bold">{cls.classTeacher?.name || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Total Students:</span>
                  <span className="bg-maroon-100 dark:bg-maroon-900/20 text-maroon-800 dark:text-maroon-400 font-bold px-2 py-0.5 rounded-full">
                    {cls.students?.length || 0} enrolled
                  </span>
                </div>
                
                {cls.subjects && cls.subjects.length > 0 && (
                  <div className="pt-2">
                    <span className="font-semibold block text-gray-600 dark:text-gray-300 mb-1.5">Curriculum Subjects:</span>
                    <div className="flex flex-wrap gap-1">
                      {cls.subjects.map((sub, sIdx) => (
                        <span key={sIdx} className="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-[10px]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((subject, idx) => (
            <motion.div
              key={subject._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col justify-between"
            >
              <div>
                <span className="bg-maroon-500/10 text-maroon-700 dark:text-maroon-400 text-[10px] font-bold px-2 py-0.5 rounded">
                  {subject.code}
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-2">
                  {subject.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
