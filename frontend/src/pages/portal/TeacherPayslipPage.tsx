import { useState, useEffect } from 'react'
import { Banknote, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { get } from '@/lib/api'

export default function TeacherPayslipPage() {
  const { user } = useAuth()
  const [payslips, setPayslips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPayslips = async () => {
    try {
      setLoading(true)
      if (user?.referenceId) {
        const res = await get(`/api/payroll/teacher/${user.referenceId}`)
        if (res.success) setPayslips(res.data)
      }
    } catch (err) {
      toast.error('Failed to load payslips')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayslips()
  }, [])

  const handleDownload = (id: string) => {
    // In a real app this would call an endpoint returning PDF blob.
    alert(`Downloading payslip ${id}...`)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Banknote className="w-6 h-6 text-maroon-600" />
          My Payslips
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your monthly salary history and download payslips.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading your payslips...</p>
        ) : payslips.length === 0 ? (
          <p className="text-gray-500">No payslips available yet.</p>
        ) : (
          payslips.map((slip, idx) => (
            <motion.div 
              key={slip._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${slip.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'}`}>
                  {slip.status.toUpperCase()}
                </span>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{slip.month}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Net Pay: <span className="font-bold text-gray-900 dark:text-white">₹{slip.netSalary}</span></p>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Basic Salary</span>
                  <span className="font-semibold dark:text-white">₹{slip.basicSalary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Allowances</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">+₹{slip.allowances}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Deductions</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">-₹{slip.deductions}</span>
                </div>
              </div>

              {slip.status === 'paid' && (
                <button 
                  onClick={() => handleDownload(slip._id)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
