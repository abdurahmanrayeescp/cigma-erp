import { useState, useEffect } from 'react'
import { Bus, Plus, Users, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { get, post } from '@/lib/api'

export default function AdminTransportPage() {
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  const [newRoute, setNewRoute] = useState({ routeName: '', vehicleNumber: '', driverName: '', driverPhone: '' })

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      const res = await get('/api/transport')
      if (res.success) setRoutes(res.data)
    } catch (err) {
      toast.error('Failed to load transport routes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await post('/api/transport', newRoute)
      if (res.success) {
        toast.success('Route added successfully')
        setIsAdding(false)
        setNewRoute({ routeName: '', vehicleNumber: '', driverName: '', driverPhone: '' })
        fetchRoutes()
      }
    } catch (error) {
      toast.error('Failed to add route')
    }
  }

  const handleAssignStudent = async (routeId: string) => {
    const studentId = prompt("Enter Student ID to assign to this route:")
    if (!studentId) return

    try {
      const res = await post(`/api/transport/assign`, { routeId, studentId })
      if (res.success) {
        toast.success('Student assigned to route successfully')
        fetchRoutes()
      }
    } catch (error) {
      toast.error('Failed to assign student')
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Bus className="w-6 h-6 text-maroon-600" />
            Transport Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage school bus routes, vehicles, and student assignments.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-maroon-600 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> {isAdding ? 'Cancel' : 'New Route'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddRoute}
            className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-4"
          >
            <h3 className="font-bold dark:text-white">Add New Route</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" required placeholder="Route Name (e.g. R1 City Center)" value={newRoute.routeName} onChange={e => setNewRoute({...newRoute, routeName: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500" />
              <input type="text" required placeholder="Vehicle No (e.g. KL-01-AB-1234)" value={newRoute.vehicleNumber} onChange={e => setNewRoute({...newRoute, vehicleNumber: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500" />
              <input type="text" required placeholder="Driver Name" value={newRoute.driverName} onChange={e => setNewRoute({...newRoute, driverName: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500" />
              <input type="text" required placeholder="Driver Phone" value={newRoute.driverPhone} onChange={e => setNewRoute({...newRoute, driverPhone: e.target.value})} className="w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Route</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading routes...</p>
        ) : routes.length === 0 ? (
          <p className="text-gray-500">No transport routes defined yet.</p>
        ) : (
          routes.map(route => (
            <motion.div 
              key={route._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{route.routeName}</h3>
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded text-xs font-semibold mt-2">
                    <Bus className="w-3 h-3" /> {route.vehicleNumber}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Driver:</strong> {route.driverName} ({route.driverPhone})</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" /> <strong>Students Assigned:</strong> {route.students?.length || 0}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => handleAssignStudent(route._id)}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Assign Student
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
