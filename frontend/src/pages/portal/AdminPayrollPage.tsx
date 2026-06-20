import { useState, useEffect } from 'react'
import { Banknote, PlayCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { get, post } from '@/lib/api'

export default function AdminPayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState('June 2025') // Default mock month

  const fetchPayrolls = async () => {
    try {
      setLoading(true)
      const res = await get(`/api/payroll?month=${month}`)
      if (res.success) setPayrolls(res.data)
    } catch (err) {
      toast.error('Failed to load payroll records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayrolls()
  }, [month])

  const handleGenerate = async () => {
    if (!confirm(`Generate payroll for all active teachers for ${month}?`)) return
    try {
      const res = await post('/api/payroll/generate', { month })
      if (res.success) {
        toast.success(res.message)
        fetchPayrolls()
      }
    } catch (error) {
      toast.error('Failed to generate payroll')
    }
  }

  const handlePay = async (id: string) => {
    try {
      const res = await post(`/api/payroll/${id}/pay`, {})
      if (res.success) {
        toast.success('Payment marked successfully')
        fetchPayrolls()
      }
    } catch (error) {
      toast.error('Failed to process payment')
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Banknote className="w-6 h-6 text-maroon-600" />
            Payroll Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage teacher salaries, allowances, and payment processing.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={month} 
            onChange={e => setMonth(e.target.value)}
            className="rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2"
          >
            <option value="June 2025">June 2025</option>
            <option value="May 2025">May 2025</option>
            <option value="April 2025">April 2025</option>
          </select>
          <button 
            onClick={handleGenerate}
            className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <PlayCircle className="w-4 h-4" /> Generate Payroll
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading payroll data...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No payroll generated for {month}.</td></tr>
              ) : (
                payrolls.map((pay: any) => (
                  <tr key={pay._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{pay.employeeId?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{pay.employeeId?.employeeId} | {pay.employeeId?.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">₹{pay.basicSalary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">₹{pay.netSalary}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pay.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400'}`}>
                        {pay.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {pay.status === 'pending' ? (
                        <button onClick={() => handlePay(pay._id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Mark Paid
                        </button>
                      ) : (
                        <span className="text-green-600 dark:text-green-400 text-xs font-medium">Paid on {new Date(pay.paymentDate).toLocaleDateString()}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
