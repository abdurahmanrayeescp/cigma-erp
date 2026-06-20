import { useEffect, useState } from 'react'
import { CalendarDays, Plus, Trash2, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { timetableApi, academicsApi, teachersApi } from '@/lib/api'
import TimetableGrid from '@/components/portal/TimetableGrid'

interface ClassObj {
  _id: string
  className: string
  division: string
}

interface Teacher {
  _id: string
  name: string
}

interface Subject {
  _id: string
  name: string
}

export default function AdminTimetablePage() {
  const [classes, setClasses] = useState<ClassObj[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [timetableEntries, setTimetableEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form State
  const [day, setDay] = useState('Monday')
  const [period, setPeriod] = useState(1)
  const [subjectName, setSubjectName] = useState('')
  const [teacherId, setTeacherId] = useState('')
  const [startTime, setStartTime] = useState('09:00 AM')
  const [endTime, setEndTime] = useState('09:45 AM')

  useEffect(() => {
    // Fetch configuration options
    academicsApi.getClasses().then(res => {
      if (res.success && res.data) {
        setClasses(res.data)
        if (res.data.length > 0) setSelectedClass(res.data[0]._id)
      }
    })
    teachersApi.list().then(res => {
      if (res.success && res.data) {
        setTeachers(res.data)
        if (res.data.length > 0) setTeacherId(res.data[0]._id)
      }
    })
    academicsApi.getSubjects().then(res => {
      if (res.success && res.data) {
        setSubjects(res.data)
        if (res.data.length > 0) setSubjectName(res.data[0].name)
      }
    })
  }, [])

  const loadTimetable = () => {
    if (!selectedClass) return
    setLoading(true)
    timetableApi.getClassTimetable(selectedClass)
      .then(res => {
        if (res.success && res.data) {
          // Format entries for TimetableGrid
          const formatted = res.data.map((item: any) => ({
            _id: item._id,
            day: item.day,
            period: item.period,
            subject: item.subject,
            teacherName: item.teacher?.name || 'Unassigned',
            startTime: item.startTime,
            endTime: item.endTime
          }))
          setTimetableEntries(formatted)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTimetable()
  }, [selectedClass])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClass) return

    try {
      const res = await timetableApi.createTimetable({
        classId: selectedClass,
        day,
        period,
        subject: subjectName,
        teacherId,
        startTime,
        endTime
      })
      if (res.success) {
        toast.success('Timetable entry created successfully!')
        setShowAddForm(false)
        loadTimetable()
      } else {
        toast.error(res.message || 'Failed to create entry')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create entry')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule period?')) return
    try {
      const res = await timetableApi.deleteTimetable(id)
      toast.success('Period removed')
      loadTimetable()
    } catch (err: any) {
      toast.error('Failed to remove period')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-maroon-600" />
            Class Schedules & Timetables
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure periods, assign teachers, and publish weekly timetables.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 text-sm focus:ring-maroon-500 focus:border-maroon-500 font-bold"
          >
            {classes.map(c => (
              <option key={c._id} value={c._id}>{c.className} - {c.division || 'A'}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Period
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-navy-900 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden"
          >
            <form onSubmit={handleAdd} className="space-y-4">
              <h3 className="text-sm font-bold dark:text-white flex items-center gap-1.5 mb-2">
                <Calendar className="w-4 h-4 text-maroon-600" />
                Schedule New Period
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Day</label>
                  <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full text-xs rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-2">
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Period No</label>
                  <select value={period} onChange={(e) => setPeriod(Number(e.target.value))} className="w-full text-xs rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-2">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>Period {num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                  <select value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="w-full text-xs rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-2">
                    {subjects.map(s => (
                      <option key={s._id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Teacher</label>
                  <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="w-full text-xs rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-2">
                    {teachers.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Start Time</label>
                  <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full text-xs rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-2" placeholder="09:00 AM" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">End Time</label>
                  <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full text-xs rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-3 py-2" placeholder="09:45 AM" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-semibold dark:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-maroon-600 text-white rounded-lg text-xs font-semibold hover:bg-maroon-700">Save period</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <TimetableGrid entries={timetableEntries} role="STUDENT" />
          
          {timetableEntries.length > 0 && (
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
              <h3 className="text-sm font-bold dark:text-white mb-4">Period Administration List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timetableEntries.map((entry) => (
                  <div key={entry._id} className="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{entry.subject}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.day} • Period {entry.period} ({entry.startTime} - {entry.endTime})
                      </p>
                      <p className="text-[11px] text-maroon-600 dark:text-maroon-400 font-semibold mt-0.5">Teacher: {entry.teacherName}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(entry._id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
