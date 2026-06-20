import { useState } from 'react'
import { Bell, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Summer Vacation Dates', message: 'School will remain closed from June 1st to July 15th.', isRead: false, time: '2h ago' },
  { id: '2', title: 'Term 1 Results Published', message: 'You can now view your Term 1 examination results in the portal.', isRead: false, time: '1d ago' },
  { id: '3', title: 'PTA Meeting Rescheduled', message: 'The meeting scheduled for this Friday is moved to next Monday.', isRead: true, time: '3d ago' },
]

export default function NotificationsWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg relative transition-colors hover:bg-navy-50 text-navy-400 hover:text-navy-600 dark:hover:bg-white/10 dark:text-gray-400 dark:hover:text-white"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-navy-900" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-navy-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-navy-950">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && <span className="bg-maroon-100 text-maroon-700 dark:bg-maroon-500/20 dark:text-maroon-400 text-xs px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 transition-colors ${notif.isRead ? 'opacity-70 hover:bg-gray-50 dark:hover:bg-white/5' : 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold ${notif.isRead ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>{notif.title}</h4>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{notif.message}</p>
                        {!notif.isRead && (
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          >
                            <Check className="w-3 h-3" /> Mark as read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
