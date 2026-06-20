import { CalendarDays } from 'lucide-react'
import TimetableGrid from '@/components/portal/TimetableGrid'

const MOCK_CLASS_ENTRIES = [
  { day: 'Monday', period: 1, subject: 'Mathematics', teacherName: 'Mr. John Doe', startTime: '09:00', endTime: '09:45' },
  { day: 'Monday', period: 2, subject: 'Science', teacherName: 'Mrs. Smith', startTime: '09:45', endTime: '10:30' },
  { day: 'Monday', period: 3, subject: 'English', teacherName: 'Ms. Davis', startTime: '10:45', endTime: '11:30' },
  { day: 'Tuesday', period: 1, subject: 'Science', teacherName: 'Mrs. Smith', startTime: '09:00', endTime: '09:45' },
  { day: 'Tuesday', period: 2, subject: 'Mathematics', teacherName: 'Mr. John Doe', startTime: '09:45', endTime: '10:30' },
  { day: 'Wednesday', period: 1, subject: 'History', teacherName: 'Mr. Wilson', startTime: '09:00', endTime: '09:45' },
]

export default function StudentTimetablePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-maroon-600" />
          Class Timetable
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your weekly class schedule.</p>
      </div>

      <TimetableGrid entries={MOCK_CLASS_ENTRIES} role="STUDENT" />
    </div>
  )
}
