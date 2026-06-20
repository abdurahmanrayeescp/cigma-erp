import { useAuth } from '@/context/AuthContext'

export default function TeacherDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Teacher Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name}. Here is your class overview.</p>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mt-6">
        <p className="text-gray-400 dark:text-gray-500 text-center py-10">Today's Timetable goes here</p>
      </div>
    </div>
  )
}
