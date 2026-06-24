import { useEffect, useState, useCallback } from 'react'
import { CheckSquare, Save, RefreshCw, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { teachersApi, attendanceApi } from '@/lib/api'

interface ClassObj { _id: string; className: string; division: string }
interface StudentRow { _id: string; admissionNo: string; name: string }
type Status = 'present' | 'absent' | 'late' | 'leave'

export default function TeacherAttendancePage() {
  const [classes, setClasses]         = useState<ClassObj[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassObj | null>(null)
  const [students, setStudents]       = useState<StudentRow[]>([])
  const [attendance, setAttendance]   = useState<Record<string, Status>>({})
  const [date, setDate]               = useState(new Date().toISOString().split('T')[0])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [loadingRoster, setLoadingRoster]   = useState(false)
  const [saving, setSaving]           = useState(false)
  const [existingRecords, setExistingRecords] = useState<any[]>([])

  // Load teacher's assigned classes
  useEffect(() => {
    teachersApi.getMyClasses()
      .then(res => {
        if (res.success && res.data) {
          const all = [
            ...(res.data.myClasses || []),
            ...(res.data.allClasses || []).filter(
              ac => !(res.data.myClasses || []).some(mc => mc._id === ac._id)
            )
          ]
          setClasses(all)
          if (all.length > 0) setSelectedClass(all[0])
        }
      })
      .catch(() => toast.error('Could not load classes'))
      .finally(() => setLoadingClasses(false))
  }, [])

  // Fetch roster + any existing attendance for selected class + date
  const fetchRoster = useCallback(() => {
    if (!selectedClass) return
    setLoadingRoster(true)
    Promise.all([
      teachersApi.getClassStudents(selectedClass._id),
      attendanceApi.getClassAttendance(selectedClass._id, date),
    ])
      .then(([rosterRes, attRes]) => {
        const roster: StudentRow[] = rosterRes.success ? rosterRes.data : []
        const existing: any[] = attRes.success ? attRes.data : []
        setStudents(roster)
        setExistingRecords(existing)
        // Pre-fill attendance: existing record → otherwise default 'present'
        const map: Record<string, Status> = {}
        for (const s of roster) {
          const rec = existing.find(r => r.student?._id === s._id || r.student === s._id)
          map[s._id] = rec ? rec.status : 'present'
        }
        setAttendance(map)
      })
      .catch(() => toast.error('Failed to load class roster'))
      .finally(() => setLoadingRoster(false))
  }, [selectedClass, date])

  useEffect(() => { fetchRoster() }, [fetchRoster])

  const handleStatusChange = (studentId: string, status: Status) =>
    setAttendance(prev => ({ ...prev, [studentId]: status }))

  const handleSave = async () => {
    if (!selectedClass) return
    setSaving(true)
    try {
      const records = students.map(s => ({ studentId: s._id, status: attendance[s._id] || 'present' }))
      await attendanceApi.markAttendance(selectedClass._id, date, records)
      toast.success('Attendance saved successfully!')
    } catch {
      toast.error('Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  const statusConfig: Record<Status, { label: string; active: string; inactive: string }> = {
    present: { label: 'Present', active: 'bg-green-100 border-green-500 text-green-700 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/50', inactive: 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10' },
    absent:  { label: 'Absent',  active: 'bg-red-100 border-red-500 text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50',   inactive: 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10' },
    late:    { label: 'Late',    active: 'bg-orange-100 border-orange-500 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/50', inactive: 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10' },
    leave:   { label: 'Leave',   active: 'bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/50', inactive: 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10' },
  }

  const counts = students.reduce((acc, s) => {
    const st = attendance[s._id] || 'present'
    acc[st] = (acc[st] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-maroon-600" />
            Class Attendance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mark daily attendance for your students.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || students.length === 0}
          className="bg-maroon-600 hover:bg-maroon-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Attendance'}
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Class</label>
            {loadingClasses ? (
              <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
            ) : (
              <select
                value={selectedClass?._id || ''}
                onChange={e => setSelectedClass(classes.find(c => c._id === e.target.value) || null)}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2.5 focus:ring-maroon-500 focus:border-maroon-500 text-sm"
              >
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.className} — {c.division}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2.5 focus:ring-maroon-500 focus:border-maroon-500 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchRoster}
              disabled={loadingRoster}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loadingRoster ? 'animate-spin' : ''}`} />
              Refresh Roster
            </button>
          </div>
        </div>

        {/* Summary chips */}
        {students.length > 0 && (
          <div className="flex gap-3 flex-wrap mb-4">
            {(['present', 'absent', 'late', 'leave'] as Status[]).map(st => (
              <span key={st} className={`px-3 py-1 rounded-full text-xs font-bold border ${statusConfig[st].active}`}>
                {statusConfig[st].label}: {counts[st] || 0}
              </span>
            ))}
          </div>
        )}

        {/* Roster Table */}
        {loadingRoster ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <AlertCircle className="w-10 h-10 mb-3" />
            <p className="font-medium">No students found in this class.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-navy-900 divide-y divide-gray-100 dark:divide-white/5">
                <AnimatePresence>
                  {students.map((student, idx) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`transition-colors ${
                        attendance[student._id] === 'absent' ? 'bg-red-50/50 dark:bg-red-500/5' :
                        attendance[student._id] === 'late'   ? 'bg-orange-50/50 dark:bg-orange-500/5' :
                        attendance[student._id] === 'leave'  ? 'bg-yellow-50/50 dark:bg-yellow-500/5' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-400 dark:text-gray-500 font-mono">{idx + 1}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{student.admissionNo}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(['present', 'absent', 'late', 'leave'] as Status[]).map(status => (
                            <label
                              key={status}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border select-none ${
                                attendance[student._id] === status
                                  ? statusConfig[status].active
                                  : statusConfig[status].inactive
                              }`}
                            >
                              <input
                                type="radio"
                                name={`status-${student._id}`}
                                className="sr-only"
                                checked={attendance[student._id] === status}
                                onChange={() => handleStatusChange(student._id, status)}
                              />
                              {statusConfig[status].label}
                            </label>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
