import { useEffect, useState } from 'react'
import { IndianRupee, Download, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { feesApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface Child {
  _id: string
  name: string
  admissionNo: string
  class: string
  division: string
}

interface PaymentHistoryItem {
  _id: string
  amount: number
  date: string
  method: string
}

interface FeeRecord {
  _id: string
  academicYear: string
  totalFee: number
  paidAmount: number
  pendingAmount: number
  dueDate: string
  paymentHistory: PaymentHistoryItem[]
}

export default function ParentFeesPage() {
  const { user } = useAuth()
  const childrenList: Child[] = user?.referenceData?.children || []

  const [selectedChild, setSelectedChild] = useState<string>('')
  const [feeRecord, setFeeRecord] = useState<FeeRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize selected child
  useEffect(() => {
    if (childrenList.length > 0) {
      setSelectedChild(childrenList[0]._id)
    }
  }, [user])

  // Fetch fees when selected child changes
  useEffect(() => {
    if (!selectedChild) return

    setLoading(true)
    setError(null)
    setFeeRecord(null)

    feesApi.getStudentFees(selectedChild)
      .then(res => {
        if (res.success && res.data) {
          // If a student has multiple fee records, we grab the first one (most recent / current year)
          if (res.data.length > 0) {
            setFeeRecord(res.data[0])
          } else {
            setFeeRecord(null)
          }
        }
      })
      .catch(() => setError('Failed to load fee information.'))
      .finally(() => setLoading(false))
  }, [selectedChild])

  const percentagePaid = feeRecord ? (feeRecord.paidAmount / feeRecord.totalFee) * 100 : 0
  const isOverdue = feeRecord 
    ? new Date(feeRecord.dueDate) < new Date() && feeRecord.pendingAmount > 0 
    : false

  const handleDownloadReceipt = (feeId: string, paymentId: string) => {
    const apiBase = import.meta.env.VITE_API_URL || '/api'
    window.open(`${apiBase}/fees/receipt/${feeId}/${paymentId}`, '_blank')
  }

  const childObj = childrenList.find(c => c._id === selectedChild)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-maroon-600" />
            Fee Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View fee structures, payment history, and download receipt PDFs.</p>
        </div>

        {childrenList.length > 1 && (
          <div className="min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Select Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 shadow-sm text-sm"
            >
              {childrenList.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.class} - {c.division})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {childrenList.length === 0 ? (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl text-yellow-700 dark:text-yellow-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">No children linked to this parent profile. Please contact the administrator.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-maroon-600" /></div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : !feeRecord ? (
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 text-center border border-gray-100 dark:border-white/5 shadow-sm">
          <IndianRupee className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No fee record found for {childObj?.name || 'the selected child'}.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5"
            >
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Academic Fee</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">₹{feeRecord.totalFee.toLocaleString()}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">Year: {feeRecord.academicYear}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.05 }} 
              className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-6 border border-green-100 dark:border-green-500/20 shadow-sm"
            >
              <p className="text-xs font-semibold text-green-800/80 dark:text-green-400 uppercase tracking-wider mb-1">Total Paid</p>
              <h2 className="text-3xl font-bold text-green-900 dark:text-green-300">₹{feeRecord.paidAmount.toLocaleString()}</h2>
              <div className="w-full bg-green-200 dark:bg-green-900/50 rounded-full h-1.5 mt-4">
                <div className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full" style={{ width: `${percentagePaid}%` }} />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }} 
              className={`${isOverdue ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' : 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20'} rounded-2xl p-6 border shadow-sm relative overflow-hidden`}
            >
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isOverdue ? 'text-red-800/80 dark:text-red-400' : 'text-orange-800/80 dark:text-orange-400'}`}>Pending Amount</p>
              <h2 className={`text-3xl font-bold ${isOverdue ? 'text-red-900 dark:text-red-300' : 'text-orange-900 dark:text-orange-300'}`}>₹{feeRecord.pendingAmount.toLocaleString()}</h2>
              <p className={`text-sm font-bold mt-2 flex items-center gap-1.5 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                Due: {new Date(feeRecord.dueDate).toLocaleDateString()}
              </p>
            </motion.div>
          </div>

          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold dark:text-white mb-6">Payment History</h3>
            
            {feeRecord.paymentHistory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">No payment history found.</p>
            ) : (
              <div className="space-y-4">
                {feeRecord.paymentHistory.map((payment, idx) => (
                  <motion.div 
                    key={payment._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-navy-950 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <div className="mt-1 w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Payment Received</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(payment.date).toLocaleDateString()} • {payment.method}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-mono">Ref: {payment._id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end sm:gap-6 ml-12 sm:ml-0">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">₹{payment.amount.toLocaleString()}</span>
                      <button 
                        onClick={() => handleDownloadReceipt(feeRecord._id, payment._id)}
                        className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Receipt PDF
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
