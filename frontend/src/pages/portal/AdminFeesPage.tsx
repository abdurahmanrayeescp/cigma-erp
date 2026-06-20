import { IndianRupee, Search, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

const MOCK_STATS = [
  { name: 'Collected', value: 8500000, color: '#10b981' }, // Green
  { name: 'Pending', value: 1500000, color: '#f59e0b' },  // Orange
]

const MOCK_STUDENTS = [
  { id: 'S1', name: 'Aarav Patel', admissionNo: 'A2025001', class: 'Class 1-A', total: 120000, paid: 120000, pending: 0, status: 'Paid' },
  { id: 'S2', name: 'Diya Sharma', admissionNo: 'A2025002', class: 'Class 1-A', total: 120000, paid: 60000, pending: 60000, status: 'Partial' },
  { id: 'S3', name: 'Rohan Gupta', admissionNo: 'A2025003', class: 'Class 1-B', total: 120000, paid: 0, pending: 120000, status: 'Unpaid' },
]

export default function AdminFeesPage() {
  const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(1)}L`

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-maroon-600" />
            School Fees Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Read-only view of school-wide fee collections and dues.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-1 bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold dark:text-white mb-2 self-start">Collection Status</h3>
          <div className="w-full h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_STATS}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(MOCK_STATS[0].value)}</span>
              <span className="text-xs text-gray-500 font-medium">Collected</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            {MOCK_STATS.map(stat => (
              <div key={stat.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{stat.name}: {formatCurrency(stat.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
            <h3 className="text-lg font-bold dark:text-white">Student Directory</h3>
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="Search admission no or name..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white text-sm focus:ring-maroon-500 focus:border-maroon-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Fee</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Paid</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Pending</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10 bg-white dark:bg-navy-900">
                {MOCK_STUDENTS.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{student.admissionNo} • {student.class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white font-medium">
                      ₹{student.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 dark:text-green-400 font-bold">
                      ₹{student.paid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 dark:text-red-400 font-bold">
                      ₹{student.pending.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full
                        ${student.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' 
                        : student.status === 'Partial' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'}`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
