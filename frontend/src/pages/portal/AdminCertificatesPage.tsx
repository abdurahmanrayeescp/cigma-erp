import { useState } from 'react'
import { Award, Search, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { get, post } from '@/lib/api'

export default function AdminCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [certificateType, setCertificateType] = useState('tc') // 'tc' or 'bonafide'
  const [reason, setReason] = useState('')
  const [dateOfLeaving, setDateOfLeaving] = useState('')
  const [purpose, setPurpose] = useState('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm) {
      toast.error('Please enter a student Admission Number or ID')
      return
    }

    try {
      // In a real flow, you'd first search for the student ID. 
      // We assume `searchTerm` is the actual student ObjectId for this demo.
      const payload = certificateType === 'tc' 
        ? { studentId: searchTerm, reason, dateOfLeaving }
        : { studentId: searchTerm, purpose }

      const endpoint = certificateType === 'tc' ? '/api/certificates/tc' : '/api/certificates/bonafide'
      
      // We mock the download since it returns a PDF blob, using window.open for simplicity
      window.open(`http://localhost:5000${endpoint}?studentId=${searchTerm}&reason=${reason}`, '_blank')
      
      toast.success(`${certificateType.toUpperCase()} Certificate Generated successfully`)
    } catch (err) {
      toast.error('Failed to generate certificate')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-maroon-600" />
            Certificate Generator
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Issue official school documents dynamically.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID / Admission No</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white focus:ring-maroon-500 focus:border-maroon-500"
                  placeholder="e.g. 64abc123..."
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certificate Type</label>
              <select
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              >
                <option value="tc">Transfer Certificate (TC)</option>
                <option value="bonafide">Bonafide Certificate</option>
              </select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {certificateType === 'tc' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Leaving</label>
                  <input
                    type="date"
                    required
                    value={dateOfLeaving}
                    onChange={(e) => setDateOfLeaving(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Leaving</label>
                  <input
                    type="text"
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Relocating to another city"
                    className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                </div>
              </motion.div>
            )}

            {certificateType === 'bonafide' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose of Certificate</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Opening a Bank Account"
                  className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/5">
            <button
              type="submit"
              className="bg-maroon-600 hover:bg-maroon-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" /> Generate & Download PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
