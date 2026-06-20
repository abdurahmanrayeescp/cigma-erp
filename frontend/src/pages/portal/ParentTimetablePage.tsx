import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import TimetableGrid from '@/components/portal/TimetableGrid'

const mockChildren = [
  { id: 'S10001', name: 'Aarav Patel', class: 'Class 1 - A' },
  { id: 'S10002', name: 'Rohan Patel', class: 'Class 3 - B' },
]

const MOCK_CLASS_ENTRIES = [
  { day: 'Monday', period: 1, subject: 'Mathematics', teacherName: 'Mr. John Doe', startTime: '09:00', endTime: '09:45' },
  { day: 'Monday', period: 2, subject: 'Science', teacherName: 'Mrs. Smith', startTime: '09:45', endTime: '10:30' },
  { day: 'Monday', period: 3, subject: 'English', teacherName: 'Ms. Davis', startTime: '10:45', endTime: '11:30' },
  { day: 'Tuesday', period: 1, subject: 'Science', teacherName: 'Mrs. Smith', startTime: '09:00', endTime: '09:45' },
  { day: 'Tuesday', period: 2, subject: 'Mathematics', teacherName: 'Mr. John Doe', startTime: '09:45', endTime: '10:30' },
]

export default function ParentTimetablePage() {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0].id)
  
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

        {mockChildren.length > 1 && (
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500 shadow-sm"
            >
              {mockChildren.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.class})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <TimetableGrid entries={MOCK_CLASS_ENTRIES} role="PARENT" />
    </div>
  )
}
