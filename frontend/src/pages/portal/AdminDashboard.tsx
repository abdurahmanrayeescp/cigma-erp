import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, GraduationCap, IndianRupee } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const attendanceData = [
  { name: 'Mon', present: 1100, absent: 100 },
  { name: 'Tue', present: 1150, absent: 50 },
  { name: 'Wed', present: 1120, absent: 80 },
  { name: 'Thu', present: 1180, absent: 20 },
  { name: 'Fri', present: 1160, absent: 40 },
]

const feeData = [
  { name: 'Jan', collected: 400000 },
  { name: 'Feb', collected: 500000 },
  { name: 'Mar', collected: 800000 },
  { name: 'Apr', collected: 1200000 },
  { name: 'May', collected: 2000000 },
  { name: 'Jun', collected: 5000000 },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    feesCollected: 0,
    feesPending: 0,
    attendancePresent: 0,
    attendanceAbsent: 0
  })

  // Mock fetching stats, later we will connect to /api/dashboard/admin/stats
  useEffect(() => {
    // We will use the api later, for now just static to show UI
    setStats({
      totalStudents: 1200,
      totalTeachers: 45,
      totalParents: 1100,
      feesCollected: 5000000,
      feesPending: 250000,
      attendancePresent: 1150,
      attendanceAbsent: 50
    })
  }, [])

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: GraduationCap, color: 'bg-green-500' },
    { label: 'Total Parents', value: stats.totalParents, icon: Users, color: 'bg-purple-500' },
    { label: 'Pending Fees', value: `₹${stats.feesPending.toLocaleString()}`, icon: IndianRupee, color: 'bg-red-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-2xl font-bold mt-2 dark:text-white">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center text-white bg-opacity-90`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Attendance Analytics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Monthly Fee Collections</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value / 100000}L`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                <Area type="monotone" dataKey="collected" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFees)" />
                <defs>
                  <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
