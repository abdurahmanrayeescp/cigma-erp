import { motion } from 'framer-motion'

interface TimetableEntry {
  day: string
  period: number
  subject: string
  teacherName?: string
  className?: string
  startTime?: string
  endTime?: string
}

interface TimetableGridProps {
  entries: TimetableEntry[]
  role: 'TEACHER' | 'STUDENT' | 'PARENT'
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const PERIODS = [1, 2, 3, 4, 5, 6]

export default function TimetableGrid({ entries, role }: TimetableGridProps) {
  
  const getEntry = (day: string, period: number) => {
    return entries.find(e => e.day === day && e.period === period)
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10 table-fixed">
        <thead>
          <tr className="bg-gray-50 dark:bg-white/5">
            <th className="w-24 px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase border-r border-gray-200 dark:border-white/10">Day / Period</th>
            {PERIODS.map(p => (
              <th key={p} className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Period {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-white/10">
          {DAYS.map((day, idx) => (
            <motion.tr 
              key={day} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <td className="w-24 px-4 py-4 text-center font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10">
                {day}
              </td>
              {PERIODS.map(period => {
                const entry = getEntry(day, period)
                return (
                  <td key={period} className="px-2 py-3 text-center align-top border-x border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    {entry ? (
                      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg p-2 h-full flex flex-col justify-center">
                        <span className="font-bold text-blue-900 dark:text-blue-300 text-sm block leading-tight">{entry.subject}</span>
                        {(role === 'STUDENT' || role === 'PARENT') && entry.teacherName && (
                          <span className="text-xs text-blue-700/80 dark:text-blue-400 mt-1">{entry.teacherName}</span>
                        )}
                        {role === 'TEACHER' && entry.className && (
                          <span className="text-xs text-blue-700/80 dark:text-blue-400 mt-1">{entry.className}</span>
                        )}
                        {entry.startTime && entry.endTime && (
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                            {entry.startTime} - {entry.endTime}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-full min-h-[60px] flex items-center justify-center text-gray-300 dark:text-gray-600 text-xs">
                        -
                      </div>
                    )}
                  </td>
                )
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
