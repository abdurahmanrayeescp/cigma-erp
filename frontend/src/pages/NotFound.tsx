import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import IslamicPattern from '@/components/ui/IslamicPattern'

export default function NotFound() {
  const { isDark } = useTheme()
  return (
    <div className={cn('min-h-screen flex items-center justify-center relative overflow-hidden pt-20', isDark ? 'bg-navy-950' : 'bg-white')}>
      <IslamicPattern className="opacity-5" />
      <div className="relative text-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <p className="text-9xl font-bold font-display text-maroon-600/20 select-none">404</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="text-6xl mb-6">🕌</div>
          <h1 className={cn('font-display text-3xl font-bold mb-3', isDark ? 'text-white' : 'text-navy-900')}>Page Not Found</h1>
          <p className={cn('text-sm max-w-sm mx-auto mb-8', isDark ? 'text-gray-400' : 'text-navy-600')}>
            The page you're looking for doesn't exist. Perhaps you were looking for something else?
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-maroon-600 to-maroon-700 text-white text-sm font-semibold hover:scale-105 transition-transform">
              <Home className="w-4 h-4" /> Go Home
            </Link>
            <button onClick={() => window.history.back()} className={cn('flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-colors', isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-navy-100 text-navy-700 hover:bg-navy-50')}>
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
