import { useAuth } from '@/context/AuthContext'
import AiInsightsWidget from '@/components/ai/AiInsightsWidget'

export default function TeacherDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Teacher Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name}. Here is your class overview.</p>
      </div>

      {/* AI Insights Panel */}
      <AiInsightsWidget role="TEACHER" />

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="text-base font-bold dark:text-white mb-2">Teacher Guidelines</h3>
        <p className="text-gray-400 dark:text-gray-500 py-4">Manage homework, mark student attendance registries, upload marks cards, and schedule periods for classes dynamically using sidebar options.</p>
      </div>
    </div>
  )
}
