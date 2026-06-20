import { BookOpen, Download, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

const MOCK_HOMEWORK = [
  { id: '1', title: 'Algebra Equations Exercise 4A', subject: 'Mathematics', dueDate: '2025-06-25', pdfUrl: '#', status: 'pending' },
  { id: '2', title: 'Read Chapter 3 and Answer Qs', subject: 'Science', dueDate: '2025-06-26', pdfUrl: '', status: 'pending' },
  { id: '3', title: 'Write an essay on Global Warming', subject: 'English', dueDate: '2025-06-15', pdfUrl: '#', status: 'completed' },
]

export default function StudentHomeworkPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-maroon-600" />
          My Homework
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your assigned homework and download study materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_HOMEWORK.map((hw, idx) => {
          const isOverdue = new Date(hw.dueDate) < new Date() && hw.status === 'pending'
          return (
            <motion.div 
              key={hw.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-2xl border bg-white dark:bg-navy-900 shadow-sm flex flex-col h-full
                ${hw.status === 'completed' ? 'border-green-200 dark:border-green-500/20' 
                : isOverdue ? 'border-red-200 dark:border-red-500/20' 
                : 'border-gray-200 dark:border-white/10'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {hw.subject}
                </span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full
                  ${hw.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                  : isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' 
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'}`}
                >
                  {hw.status === 'completed' ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{hw.title}</h3>
              
              <div className="mt-auto pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className={isOverdue ? 'text-red-500' : ''}>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                </div>
                
                {hw.pdfUrl && (
                  <button className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-gray-200 dark:border-white/10">
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
