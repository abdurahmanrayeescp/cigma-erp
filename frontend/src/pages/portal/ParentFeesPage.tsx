import { useState } from 'react'
import { IndianRupee, Download, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const mockChildren = [
  { id: 'S10001', name: 'Aarav Patel', class: 'Class 1 - A' },
  { id: 'S10002', name: 'Rohan Patel', class: 'Class 3 - B' },
]

const mockFees = {
  academicYear: '2025-2026',
  totalFee: 120000,
  paidAmount: 40000,
  pendingAmount: 80000,
  dueDate: '2025-08-01',
  paymentHistory: [
    { id: 'PAY123', amount: 40000, date: '2025-04-10', method: 'Bank Transfer' }
  ]
}

export default function ParentFeesPage() {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0].id)
  
  const percentagePaid = (mockFees.paidAmount / mockFees.totalFee) * 100
  const isOverdue = new Date(mockFees.dueDate) < new Date() && mockFees.pendingAmount > 0

  const handleDownloadReceipt = (paymentId: string) => {
    alert(`Downloading receipt for payment ${paymentId}`)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-maroon-600" />
            Fee Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View fee structure, payment history, and download receipts.</p>
        </div>

        {mockChildren.length > 1 && (
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500 shadow-sm"
            >
              {mockChildren.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.class})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Academic Fee</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">₹{mockFees.totalFee.toLocaleString()}</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Year: {mockFees.academicYear}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-6 border border-green-100 dark:border-green-500/20">
          <p className="text-sm font-medium text-green-800/80 dark:text-green-400 mb-1">Total Paid</p>
          <h2 className="text-3xl font-bold text-green-900 dark:text-green-300">₹{mockFees.paidAmount.toLocaleString()}</h2>
          <div className="w-full bg-green-200 dark:bg-green-900 rounded-full h-1.5 mt-4">
            <div className="bg-green-600 dark:bg-green-500 h-1.5 rounded-full" style={{ width: `${percentagePaid}%` }}></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`${isOverdue ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' : 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20'} rounded-2xl p-6 border relative overflow-hidden`}>
          <p className={`text-sm font-medium mb-1 ${isOverdue ? 'text-red-800/80 dark:text-red-400' : 'text-orange-800/80 dark:text-orange-400'}`}>Pending Amount</p>
          <h2 className={`text-3xl font-bold ${isOverdue ? 'text-red-900 dark:text-red-300' : 'text-orange-900 dark:text-orange-300'}`}>₹{mockFees.pendingAmount.toLocaleString()}</h2>
          <p className={`text-sm font-semibold mt-2 flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {isOverdue ? <AlertCircle className="w-4 h-4" /> : <ClockIcon className="w-4 h-4" />}
            Due: {new Date(mockFees.dueDate).toLocaleDateString()}
          </p>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 className="text-lg font-bold dark:text-white mb-6">Payment History</h3>
        
        {mockFees.paymentHistory.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No payment history found.</p>
        ) : (
          <div className="space-y-4">
            {mockFees.paymentHistory.map((payment, idx) => (
              <motion.div 
                key={payment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-navy-950"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="mt-1 w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Payment Received</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(payment.date).toLocaleDateString()} • {payment.method}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Ref: {payment.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end sm:gap-6 ml-12 sm:ml-0">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">₹{payment.amount.toLocaleString()}</span>
                  <button 
                    onClick={() => handleDownloadReceipt(payment.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Receipt
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
