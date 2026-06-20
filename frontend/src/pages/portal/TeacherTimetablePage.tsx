import { CalendarDays } from 'lucide-react'
import TimetableGrid from '@/components/portal/TimetableGrid'
import { useAuth } from '@/context/AuthContext'

const MOCK_TEACHER_ENTRIES = [
  { day: 'Monday', period: 1, subject: 'Mathematics', className: 'Class 1 - A', startTime: '09:00', endTime: '09:45' },
  { day: 'Monday', period: 3, subject: 'Mathematics', className: 'Class 1 - B', startTime: '10:45', endTime: '11:30' },
  { day: 'Tuesday', period: 2, subject: 'Mathematics', className: 'Class 1 - A', startTime: '09:45', endTime: '10:30' },
  { day: 'Wednesday', period: 1, subject: 'Mathematics', className: 'Class 1 - B', startTime: '09:00', endTime: '09:45' },
  { day: 'Thursday', period: 4, subject: 'Mathematics', className: 'Class 1 - A', startTime: '11:30', endTime: '12:15' },
  { day: 'Friday', period: 5, subject: 'Mathematics', className: 'Class 1 - B', startTime: '13:00', endTime: '13:45' },
]

export default function TeacherTimetablePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-maroon-600" />
          My Weekly Timetable
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your assigned classes for the week.</p>
      </div>

      <TimetableGrid entries={MOCK_TEACHER_ENTRIES} role="TEACHER" />
    </div>
  )
}
