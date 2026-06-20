import { useState } from 'react'
import { BookOpen, Upload, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const MOCK_HOMEWORK = [
  { id: '1', title: 'Algebra Equations Exercise 4A', class: 'Class 1 - A', subject: 'Mathematics', dueDate: '2025-06-25', pdfUrl: '#' },
  { id: '2', title: 'Read Chapter 3 and Answer Qs', class: 'Class 1 - B', subject: 'Science', dueDate: '2025-06-26', pdfUrl: '' },
]

export default function TeacherHomeworkPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedClass, setSelectedClass] = useState('class_1_a')
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [dueDate, setDueDate] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate) {
      toast.error('Title and Due Date are required.')
      return
    }
    // API call would go here
    toast.success('Homework assigned successfully!')
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this homework?')) {
      toast.success('Homework deleted')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-maroon-600" />
            Homework Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Assign homework, upload study materials, and manage due dates.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          {showForm ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Assign New'}
        </button>
      </div>

      {showForm && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5"
          onSubmit={handleAssign}
        >
          <h3 className="text-lg font-bold dark:text-white mb-4">Assign New Homework</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input 
                type="text" required
                value={title} onChange={e => setTitle(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date *</label>
              <input 
                type="date" required
                value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class *</label>
              <select 
                value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              >
                <option value="class_1_a">Class 1 - A</option>
                <option value="class_1_b">Class 1 - B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
              <select 
                value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions / Description</label>
              <textarea 
                rows={3}
                value={description} onChange={e => setDescription(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload PDF Attachment (Optional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
                  </div>
                  <input type="file" accept=".pdf" className="hidden" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              {pdfFile && <p className="text-sm mt-2 text-green-600 font-medium">Selected file: {pdfFile.name}</p>}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-maroon-600 hover:bg-maroon-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Assign Homework
            </button>
          </div>
        </motion.form>
      )}

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-bold dark:text-white mb-4">Active Assignments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_HOMEWORK.map((hw) => (
            <div key={hw.id} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-navy-950 relative hover:shadow-md transition-shadow">
              <button onClick={() => handleDelete(hw.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <h4 className="font-bold text-gray-900 dark:text-white">{hw.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{hw.subject} • {hw.class}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 px-2 py-1 rounded-md">
                  Due: {new Date(hw.dueDate).toLocaleDateString()}
                </span>
                {hw.pdfUrl && (
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 px-2 py-1 rounded-md flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> PDF Attached
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
