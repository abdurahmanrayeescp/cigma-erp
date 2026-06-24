import { useEffect, useState } from 'react'
import { BookOpen, Download, Clock, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { homeworkApi } from '@/lib/api'

interface HomeworkRecord {
  _id: string
  title: string
  description?: string
  subject: string
  dueDate: string
  pdfUrl?: string
  teacher?: {
    name: string
  }
}

interface Child {
  _id: string
  name: string
  admissionNo: string
  class: string
  division: string
  classId?: string | null
}

export default function ParentHomeworkPage() {
  const { user } = useAuth()
  const childrenList: Child[] = user?.referenceData?.children || []

  const [selectedChild, setSelectedChild] = useState<string>('')
  const [homework, setHomework] = useState<HomeworkRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize selected child
  useEffect(() => {
    if (childrenList.length > 0) {
      setSelectedChild(childrenList[0]._id)
    }
  }, [user])

  // Fetch homework when selected child changes
  useEffect(() => {
    if (!selectedChild) return

    const childObj = childrenList.find(c => c._id === selectedChild)
    if (!childObj?.classId) {
      setHomework([])
      setError(`${childObj?.name || 'Selected child'} is not currently assigned to a class. Please contact the administrator.`)
      return
    }

    setLoading(true)
    setError(null)
    homeworkApi.getClassHomework(childObj.classId)
      .then(res => {
        if (res.success && res.data) {
          setHomework(res.data)
        }
      })
      .catch(() => setError('Failed to load homework assignments.'))
      .finally(() => setLoading(false))
  }, [selectedChild])

  const childObj = childrenList.find(c => c._id === selectedChild)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-maroon-600" />
            Child's Homework
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your child's assigned homework and due dates.</p>
        </div>
        
        {childrenList.length > 1 && (
          <div className="min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Select Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 shadow-sm text-sm"
            >
              {childrenList.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.class} - {c.division})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {childrenList.length === 0 ? (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl text-yellow-700 dark:text-yellow-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">No children linked to this parent profile. Please contact the administrator.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600" /></div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : homework.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/5 shadow-sm">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No homework assignments found for {childObj?.name || 'your child'}'s class.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homework.map((hw, idx) => {
            const isOverdue = new Date(hw.dueDate) < new Date()
            return (
              <motion.div 
                key={hw._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-2xl border bg-white dark:bg-navy-900 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow
                  ${isOverdue ? 'border-red-100 dark:border-red-500/10' : 'border-gray-200 dark:border-white/10'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-maroon-600 dark:text-maroon-400 bg-maroon-50 dark:bg-maroon-500/10 px-2.5 py-1 rounded-md">
                    {hw.subject}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full
                    ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'}`}
                  >
                    {isOverdue ? 'Overdue' : 'Pending'}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{hw.title}</h3>
                {hw.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">{hw.description}</p>
                )}
                
                <div className="mt-auto pt-4 space-y-3 border-t border-gray-50 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Assigned by: {hw.teacher?.name || 'Teacher'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
                      Due: {new Date(hw.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {hw.pdfUrl && (
                    <a 
                      href={hw.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-gray-200 dark:border-white/10 text-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Materials
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
