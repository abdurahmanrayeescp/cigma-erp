import { useAuth } from '@/context/AuthContext'

export default function ParentDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Parent Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400">Welcome, {user?.name}. Monitor your children's progress here.</p>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mt-6">
        <p className="text-gray-400 dark:text-gray-500 text-center py-10">Child selector and overview goes here</p>
      </div>
    </div>
  )
}
