import { useEffect, useState } from 'react'
import { CalendarDays, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { timetableApi } from '@/lib/api'
import TimetableGrid from '@/components/portal/TimetableGrid'

interface BackendTeacherTimetableEntry {
  _id: string
  day: string
  period: number
  subject: string
  class?: {
    className: string
    division: string
  }
  startTime?: string
  endTime?: string
}

export default function TeacherTimetablePage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    timetableApi.getTeacherTimetable('me')
      .then(res => {
        if (res.success && res.data) {
          const mapped = res.data.map((item: BackendTeacherTimetableEntry) => ({
            day: item.day,
            period: item.period,
            subject: item.subject,
            className: item.class ? `${item.class.className} - ${item.class.division}` : undefined,
            startTime: item.startTime,
            endTime: item.endTime
          }))
          setEntries(mapped)
        }
      })
      .catch(() => setError('Failed to load your weekly timetable.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-maroon-600" />
          My Weekly Timetable
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your assigned classes for the week.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600" /></div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <TimetableGrid entries={entries} role="TEACHER" />
      )}
    </div>
  )
}
