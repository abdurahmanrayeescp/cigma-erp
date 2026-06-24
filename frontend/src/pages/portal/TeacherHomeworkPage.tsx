import { useEffect, useState } from 'react'
import { BookOpen, Upload, Plus, Trash2, Clock, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { teachersApi, homeworkApi, academicsApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface ClassRecord {
  _id: string
  className: string
  division: string
}

interface SubjectRecord {
  _id: string
  name: string
}

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

export default function TeacherHomeworkPage() {
  const { user } = useAuth()
  
  const [myClasses, setMyClasses] = useState<ClassRecord[]>([])
  const [allClasses, setAllClasses] = useState<ClassRecord[]>([])
  const [subjects, setSubjects] = useState<SubjectRecord[]>([])
  
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [homeworkList, setHomeworkList] = useState<HomeworkRecord[]>([])
  
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listLoading, setListLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch initial classes and subjects
  useEffect(() => {
    Promise.all([
      teachersApi.getMyClasses(),
      academicsApi.getSubjects()
    ])
      .then(([classesRes, subjectsRes]) => {
        if (classesRes.success && classesRes.data) {
          setMyClasses(classesRes.data.myClasses || [])
          setAllClasses(classesRes.data.allClasses || [])
          const initialClass = classesRes.data.myClasses?.[0]?._id || classesRes.data.allClasses?.[0]?._id
          if (initialClass) {
            setSelectedClass(initialClass)
          }
        }
        if (subjectsRes.success && subjectsRes.data) {
          setSubjects(subjectsRes.data)
          if (subjectsRes.data.length > 0) {
            setSelectedSubject(subjectsRes.data[0].name)
          }
        }
      })
      .catch(() => setError('Failed to load initial class and subject data.'))
      .finally(() => setLoading(false))
  }, [])

  // Fetch homework for selected class
  useEffect(() => {
    if (!selectedClass) return

    setListLoading(true)
    homeworkApi.getClassHomework(selectedClass)
      .then(res => {
        if (res.success && res.data) {
          setHomeworkList(res.data)
        }
      })
      .catch(() => toast.error('Failed to load homework for selected class.'))
      .finally(() => setListLoading(false))
  }, [selectedClass])

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate || !selectedClass || !selectedSubject) {
      toast.error('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      let pdfUrl = ''
      if (pdfFile) {
        // Upload mock URL or static path since upload API is not implemented
        pdfUrl = `/uploads/homework/${Date.now()}_${pdfFile.name}`
      }

      const payload = {
        title,
        description,
        classId: selectedClass,
        subject: selectedSubject,
        dueDate,
        pdfUrl: pdfUrl || undefined
      }

      const res = await homeworkApi.assignHomework(payload)
      if (res.success) {
        toast.success('Homework assigned successfully!')
        setShowForm(false)
        setTitle('')
        setDescription('')
        setPdfFile(null)
        setDueDate('')
        // Refresh list
        const updated = await homeworkApi.getClassHomework(selectedClass)
        if (updated.success && updated.data) {
          setHomeworkList(updated.data)
        }
      } else {
        toast.error(res.message || 'Failed to assign homework.')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this homework assignment?')) return

    try {
      const res = await homeworkApi.deleteHomework(id)
      if (res.success) {
        toast.success('Homework deleted successfully.')
        setHomeworkList(prev => prev.filter(hw => hw._id !== id))
      } else {
        toast.error(res.message || 'Failed to delete homework.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete homework.')
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
        {!loading && !error && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-maroon-600/30"
          >
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Assign New</>}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600" /></div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <>
          {showForm && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
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
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date *</label>
                  <input 
                    type="date" required
                    value={dueDate} onChange={e => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class *</label>
                  <select 
                    value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500"
                  >
                    <optgroup label="My Classes">
                      {myClasses.map(c => <option key={c._id} value={c._id}>{c.className} - {c.division}</option>)}
                    </optgroup>
                    <optgroup label="Other Classes">
                      {allClasses.filter(c => !myClasses.some(mc => mc._id === c._id)).map(c => (
                        <option key={c._id} value={c._id}>{c.className} - {c.division}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                  <select 
                    value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500"
                  >
                    {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions / Description</label>
                  <textarea 
                    rows={3}
                    value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500"
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
                <button 
                  type="submit" disabled={submitting}
                  className="bg-maroon-600 hover:bg-maroon-700 disabled:bg-maroon-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {submitting ? 'Assigning...' : 'Assign Homework'}
                </button>
              </div>
            </motion.form>
          )}

          {/* Selector for Class View */}
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-lg font-bold dark:text-white">Active Assignments</h3>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class Filter:</label>
                <select 
                  value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                  className="rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-1.5 text-sm focus:ring-maroon-500"
                >
                  <optgroup label="My Classes">
                    {myClasses.map(c => <option key={c._id} value={c._id}>{c.className} - {c.division}</option>)}
                  </optgroup>
                  <optgroup label="Other Classes">
                    {allClasses.filter(c => !myClasses.some(mc => mc._id === c._id)).map(c => (
                      <option key={c._id} value={c._id}>{c.className} - {c.division}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {listLoading ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600" /></div>
            ) : homeworkList.length === 0 ? (
              <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No homework assignments active for this class.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homeworkList.map((hw) => (
                  <div key={hw._id} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-navy-950 relative hover:shadow-md transition-shadow">
                    <button 
                      onClick={() => handleDelete(hw._id)} 
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="font-bold text-gray-900 dark:text-white">{hw.title}</h4>
                    {hw.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{hw.description}</p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">
                      Subject: {hw.subject} • Assigned by: {hw.teacher?.name || 'Teacher'}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Due: {new Date(hw.dueDate).toLocaleDateString()}
                      </span>
                      {hw.pdfUrl && (
                        <a 
                          href={hw.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 px-2.5 py-1 rounded-md flex items-center gap-1 hover:underline"
                        >
                          <BookOpen className="w-3 h-3" /> PDF Attached
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
