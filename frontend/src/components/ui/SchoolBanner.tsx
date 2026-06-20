import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export default function SchoolBanner() {
  const { isDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        'relative overflow-hidden border-t-4',
        isDark
          ? 'bg-navy-900 border-maroon-600'
          : 'bg-white border-maroon-600'
      )}
    >
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon-600 via-navy-600 to-forest-500" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Letterhead image — the official school banner */}
        <div className={cn(
          'rounded-2xl overflow-hidden shadow-lg border',
          isDark ? 'border-navy-700 bg-white' : 'border-warm-200 bg-white'
        )}>
          <img
            src="/letterhead.png"
            alt="Creative International Academy — Thana, Kannur, Kerala"
            className="w-full h-auto object-contain"
            style={{ maxHeight: '160px' }}
          />
        </div>

        {/* Tagline strip */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-center">
          <span className={cn('text-sm font-medium', isDark ? 'text-navy-300' : 'text-navy-600')}>
            📍 Thana, Kannur, Kerala — Pin 670012
          </span>
          <span className="w-1 h-1 rounded-full bg-maroon-400 hidden sm:block" />
          <a
            href="tel:+919746770422"
            className={cn('text-sm font-medium hover:text-maroon-500 transition-colors', isDark ? 'text-navy-300' : 'text-navy-600')}
          >
            📞 +91 97467 70422
          </a>
          <span className="w-1 h-1 rounded-full bg-maroon-400 hidden sm:block" />
          <a
            href="mailto:creativekidskannur@gmail.com"
            className={cn('text-sm font-medium hover:text-maroon-500 transition-colors', isDark ? 'text-navy-300' : 'text-navy-600')}
          >
            ✉️ creativekidskannur@gmail.com
          </a>
          <span className="w-1 h-1 rounded-full bg-maroon-400 hidden sm:block" />
          <a
            href="https://www.creativecigma.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-maroon-600 hover:text-navy-600 transition-colors"
          >
            🌐 www.creativecigma.com
          </a>
        </div>
      </div>
    </motion.div>
  )
}
