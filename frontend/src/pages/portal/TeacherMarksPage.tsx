import { useEffect, useState } from 'react'
import { FileEdit, Save, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { teachersApi, marksApi, academicsApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface StudentRecord {
  _id: string
  admissionNo: string
  name: string
}

interface ClassRecord {
  _id: string
  className: string
  division: string
}

interface SubjectRecord {
  _id: string
  name: string
}

interface MarkRecord {
  student: string | { _id: string }
  marksObtained: number
  maxMarks: number
}

export default function TeacherMarksPage() {
  const { user } = useAuth()
  
  const [myClasses, setMyClasses] = useState<ClassRecord[]>([])
  const [allClasses, setAllClasses] = useState<ClassRecord[]>([])
  const [subjects, setSubjects] = useState<SubjectRecord[]>([])
  
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedExam, setSelectedExam] = useState('Midterm Exam')
  const [academicYear, setAcademicYear] = useState('2025-2026')
  const [maxMarks, setMaxMarks] = useState(100)

  const [students, setStudents] = useState<StudentRecord[]>([])
  const [marks, setMarks] = useState<Record<string, string>>({})
  
  const [loading, setLoading] = useState(true)
  const [fetchingStudents, setFetchingStudents] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      .catch(() => setError('Failed to load classes and subjects.'))
      .finally(() => setLoading(false))
  }, [])

  // Load students and their existing marks
  const fetchStudentsAndMarks = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select class and subject first.')
      return
    }

    setFetchingStudents(true)
    try {
      // 1. Fetch all students in the selected class
      const studentsRes = await teachersApi.getClassStudents(selectedClass)
      let studentsData: StudentRecord[] = []
      if (studentsRes.success && studentsRes.data) {
        studentsData = studentsRes.data
        setStudents(studentsData)
      } else {
        toast.error('Failed to load students.')
        setFetchingStudents(false)
        return
      }

      // 2. Fetch existing marks for this class/subject/exam combination
      const marksRes = await marksApi.getClassMarks(selectedClass, selectedSubject, selectedExam, academicYear)
      const marksMap: Record<string, string> = {}
      
      if (marksRes.success && marksRes.data) {
        const existingMarks: any[] = marksRes.data
        
        // Populate maxMarks from first record if exists
        if (existingMarks.length > 0 && existingMarks[0].maxMarks) {
          setMaxMarks(existingMarks[0].maxMarks)
        }

        // Map marks to student ID
        existingMarks.forEach((m: any) => {
          const sId = typeof m.student === 'object' ? m.student._id : m.student
          if (sId) {
            marksMap[sId] = String(m.marksObtained)
          }
        })
      }

      setMarks(marksMap)
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch class records.')
    } finally {
      setFetchingStudents(false)
    }
  }

  // Fetch when class/subject/exam changes
  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchStudentsAndMarks()
    }
  }, [selectedClass, selectedSubject, selectedExam, academicYear])

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks(prev => ({ ...prev, [studentId]: value }))
  }

  const handleSave = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select class and subject.')
      return
    }

    // Validate marks are numeric and within bounds
    const invalid = Object.entries(marks).some(([studentId, val]) => {
      if (!val) return false // allow leaving blank/unassigned
      const n = Number(val)
      return isNaN(n) || n > maxMarks || n < 0
    })

    if (invalid) {
      toast.error(`Marks must be between 0 and ${maxMarks}`)
      return
    }

    // Build records list
    const records = Object.entries(marks)
      .filter(([_, val]) => val !== '')
      .map(([studentId, val]) => ({
        studentId,
        marksObtained: Number(val),
        maxMarks
      }))

    if (records.length === 0) {
      toast.error('No marks entered to save.')
      return
    }

    setSaving(true)
    try {
      const res = await marksApi.uploadMarks(
        selectedClass,
        selectedSubject,
        selectedExam,
        academicYear,
        records
      )
      if (res.success) {
        toast.success('Marks saved successfully!')
      } else {
        toast.error(res.message || 'Failed to save marks.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred saving marks.')
    } finally {
      setSaving(false)
    }
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
        {!loading && !error && students.length > 0 && (
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-maroon-6:00 hover:bg-maroon-700 bg-maroon-600 disabled:bg-maroon-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-maroon-600/30"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Marks'}
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
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500"
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
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500"
              >
                {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Exam</label>
              <select 
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500"
              >
                <option value="Midterm Exam">Midterm Exam</option>
                <option value="Finals">Finals</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Max Marks</label>
              <input 
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Academic Year</label>
              <select 
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500"
              >
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>
          </div>

          {/* Marks Table */}
          {fetchingStudents ? (
            <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600" /></div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-gray-400 dark:text-gray-500">
              <p>No students found for the selected class.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Adm No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">Marks Obtained</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Auto Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-navy-900 divide-y divide-gray-200 dark:divide-white/10">
                  {students.map((student, idx) => {
                    const val = marks[student._id]
                    const obtained = Number(val || 0)
                    const percentage = val ? (obtained / maxMarks) * 100 : null
                    
                    let grade = '-'
                    if (percentage !== null && !isNaN(percentage)) {
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
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        key={student._id}
                        className="hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">{student.admissionNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="number"
                            min="0"
                            max={maxMarks}
                            value={marks[student._id] ?? ''}
                            onChange={(e) => handleMarkChange(student._id, e.target.value)}
                            placeholder="Not Entered"
                            className="w-32 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-1.5 focus:ring-maroon-500 text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-md
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
          )}
        </div>
      )}
    </div>
  )
}
