import { useAuth } from '@/context/AuthContext'
import AiInsightsWidget from '@/components/ai/AiInsightsWidget'
import AiParentStatusWidget from '@/components/ai/AiParentStatusWidget'

export default function ParentDashboard() {
  const { user } = useAuth()
  const childrenList = user?.referenceData?.children || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Parent Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome, {user?.name}. Monitor your children's progress here.</p>
      </div>

      {/* AI Insights Panel */}
      <AiParentStatusWidget childrenList={childrenList} />
      <AiInsightsWidget role="PARENT" childrenList={childrenList} />

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="text-base font-bold dark:text-white mb-2">Academic Notifications</h3>
        <p className="text-gray-400 dark:text-gray-500 py-4">Keep track of homework assignments, attendance updates, results disclosures, and school fee schedules via the sidebar portal.</p>
      </div>
    </div>
  )
}
