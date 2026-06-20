import { useState } from 'react'
import { Bell, Send, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { notificationApi } from '@/lib/api'

const MOCK_HISTORY = [
  { id: '1', title: 'Summer Vacation Dates', audience: 'ALL', date: '2025-05-01T10:00:00Z', readCount: 850 },
  { id: '2', title: 'PTA Meeting Rescheduled', audience: 'PARENTS', date: '2025-05-10T14:30:00Z', readCount: 320 },
]

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('ALL')
  const [channels, setChannels] = useState({ email: true, push: true, whatsapp: false })

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) {
      toast.error('Title and Message are required.')
      return
    }
    
    try {
      const res = await notificationApi.createNotification({
        title,
        message,
        targetAudience: audience,
        channels // Send the channels object to backend
      } as any)
      
      if (res.success) {
        toast.success('Notification dispatched successfully via selected channels!')
        setTitle('')
        setMessage('')
      } else {
        toast.error('Failed to send notification')
      }
    } catch (err) {
      toast.error('An error occurred while sending.')
    }
  }

  const toggleChannel = (channel: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }))
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-maroon-600" />
          Broadcast Center
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Send circulars and announcements to targeted groups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Composer */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-bold dark:text-white mb-6">Compose Message</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
              <select 
                value={audience} onChange={e => setAudience(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              >
                <option value="ALL">Everyone</option>
                <option value="PARENTS">Parents Only</option>
                <option value="STUDENTS">Students Only</option>
                <option value="TEACHERS">Teachers Only</option>
                <option value="STAFF">Support Staff</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title / Subject</label>
              <input 
                type="text" required value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Important Update Regarding Exams"
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Body</label>
              <textarea 
                required rows={5} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Write your announcement here..."
                className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Channels</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => toggleChannel('email')} className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${channels.email ? 'border-maroon-600 bg-maroon-50 text-maroon-700 dark:bg-maroon-500/20 dark:text-maroon-300' : 'border-gray-200 text-gray-500 dark:border-white/10 dark:text-gray-400'}`}>
                  {channels.email && <CheckCircle2 className="w-4 h-4" />} Email
                </button>
                <button type="button" onClick={() => toggleChannel('push')} className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${channels.push ? 'border-maroon-600 bg-maroon-50 text-maroon-700 dark:bg-maroon-500/20 dark:text-maroon-300' : 'border-gray-200 text-gray-500 dark:border-white/10 dark:text-gray-400'}`}>
                  {channels.push && <CheckCircle2 className="w-4 h-4" />} App Push
                </button>
                <button type="button" onClick={() => toggleChannel('whatsapp')} className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${channels.whatsapp ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'border-gray-200 text-gray-500 dark:border-white/10 dark:text-gray-400'}`}>
                  {channels.whatsapp && <CheckCircle2 className="w-4 h-4" />} WhatsApp
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-maroon-600 hover:bg-maroon-700 text-white px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors mt-6 shadow-md shadow-maroon-600/20">
              <Send className="w-5 h-5" /> Dispatch Announcement
            </button>
          </form>
        </motion.div>

        {/* History */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-bold dark:text-white mb-6">Recent Broadcasts</h3>
          <div className="space-y-4">
            {MOCK_HISTORY.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-navy-950">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    Audience: {item.audience}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleString()}</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Delivered • {item.readCount} Reads
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
