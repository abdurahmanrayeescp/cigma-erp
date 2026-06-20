import { FileSpreadsheet, Users, CalendarDays, IndianRupee } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function AdminReportsPage() {
  const handleDownload = (type: string) => {
    // We simulate the download by opening the export endpoint directly
    window.open(`http://localhost:5000/api/reports/${type}`, '_blank')
    toast.success(`Exporting ${type} report...`)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-maroon-600" />
          Advanced Reports
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export raw CSV data for spreadsheet analysis and auditing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Student Master Data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export all registered students with demographics.</p>
          </div>
          <button 
            onClick={() => handleDownload('students')}
            className="mt-2 w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors dark:text-white"
          >
            Export CSV
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Global Attendance</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete attendance records across all classes.</p>
          </div>
          <button 
            onClick={() => handleDownload('attendance')}
            className="mt-2 w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors dark:text-white"
          >
            Export CSV
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <IndianRupee className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Financial Transactions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export all collected fee receipts and payments.</p>
          </div>
          <button 
            onClick={() => handleDownload('fees')}
            className="mt-2 w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors dark:text-white"
          >
            Export CSV
          </button>
        </motion.div>
      </div>
    </div>
  )
}
