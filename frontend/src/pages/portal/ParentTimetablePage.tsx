import { useEffect, useState } from 'react'
import { CalendarDays, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { timetableApi } from '@/lib/api'
import TimetableGrid from '@/components/portal/TimetableGrid'

interface BackendTimetableEntry {
  _id: string
  day: string
  period: number
  subject: string
  teacher?: {
    name: string
  }
  startTime?: string
  endTime?: string
}

interface Child {
  _id: string
  name: string
  admissionNo: string
  class: string
  division: string
  classId?: string | null
}

export default function ParentTimetablePage() {
  const { user } = useAuth()
  const childrenList: Child[] = user?.referenceData?.children || []

  const [selectedChild, setSelectedChild] = useState<string>('')
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize selected child
  useEffect(() => {
    if (childrenList.length > 0) {
      setSelectedChild(childrenList[0]._id)
    }
  }, [user])

  // Fetch timetable when selected child changes
  useEffect(() => {
    if (!selectedChild) return

    const childObj = childrenList.find(c => c._id === selectedChild)
    if (!childObj?.classId) {
      setEntries([])
      setError(`${childObj?.name || 'Selected child'} is not currently assigned to a class. Please contact the administrator.`)
      return
    }

    setLoading(true)
    setError(null)
    timetableApi.getClassTimetable(childObj.classId)
      .then(res => {
        if (res.success && res.data) {
          const mapped = res.data.map((item: BackendTimetableEntry) => ({
            day: item.day,
            period: item.period,
            subject: item.subject,
            teacherName: item.teacher?.name,
            startTime: item.startTime,
            endTime: item.endTime
          }))
          setEntries(mapped)
        }
      })
      .catch(() => setError('Failed to load class timetable.'))
      .finally(() => setLoading(false))
  }, [selectedChild])

  const childObj = childrenList.find(c => c._id === selectedChild)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-maroon-600" />
            Child's Timetable
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your children's weekly class schedules.</p>
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
      ) : (
        <TimetableGrid entries={entries} role="PARENT" />
      )}
    </div>
  )
}
