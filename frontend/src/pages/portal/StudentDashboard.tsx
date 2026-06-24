import { useAuth } from '@/context/AuthContext'
import AiInsightsWidget from '@/components/ai/AiInsightsWidget'

export default function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Student Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome, {user?.name}. Here is your academic overview.</p>
      </div>

      {/* AI Insights Panel */}
      <AiInsightsWidget role="STUDENT" referenceId={user?.referenceId} />

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="text-base font-bold dark:text-white mb-2">Student Portal Updates</h3>
        <p className="text-gray-400 dark:text-gray-500 py-4">Explore your sidebar navigation for complete details on marks, attendance registries, library cards, and timetable schedules.</p>
      </div>
    </div>
  )
}
