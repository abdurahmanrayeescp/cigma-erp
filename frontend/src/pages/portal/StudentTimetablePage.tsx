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

export default function StudentTimetablePage() {
  const { user } = useAuth()
  const classId = user?.referenceData?.classId

  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!classId) {
      setLoading(false)
      setError('You are not assigned to any class. Please contact the administrator.')
      return
    }

    timetableApi.getClassTimetable(classId)
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
  }, [classId])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-maroon-600" />
          Class Timetable
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your weekly class schedule.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600" /></div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <TimetableGrid entries={entries} role="STUDENT" />
      )}
    </div>
  )
}
