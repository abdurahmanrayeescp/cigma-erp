import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, ChevronDown, LogIn } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'School',
    children: [
      { label: 'Principal Message', href: '/principal-message' },
      { label: 'Management Message', href: '/management-message' },
      { label: 'Academics', href: '/academics' },
      { label: 'Facilities', href: '/facilities' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News & Events', href: '/news-events' },
  { label: 'Admissions', href: '/admissions' },
  {
    label: 'More',
    children: [
      { label: 'Career', href: '/career' },
      { label: 'Downloads', href: '/downloads' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { theme, toggleTheme, isDark } = useTheme()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
    setActiveDropdown(null)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  const solidBg = isScrolled || isMobileOpen

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        solidBg
          ? isDark
            ? 'bg-navy-950/96 backdrop-blur-xl border-b border-maroon-700/30 shadow-lg shadow-navy-900/40'
            : 'bg-white/96 backdrop-blur-xl border-b border-warm-200 shadow-lg shadow-navy-900/10'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="CIGMA — Creative International Academy"
                className="w-14 h-14 rounded-full object-cover shadow-md ring-2 ring-maroon-600/40 group-hover:ring-maroon-500 transition-all duration-300"
              />
              <div className="absolute -inset-1 rounded-full bg-maroon-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
            </div>
            <div className="hidden sm:block">
              <p className={cn(
                'text-base font-bold font-display tracking-wide leading-none',
                solidBg
                  ? 'text-navy-700'
                  : 'text-white'
              )}>
                CIGMA
              </p>
              <p className={cn(
                'text-xs font-medium leading-tight mt-0.5 max-w-[160px]',
                solidBg
                  ? isDark ? 'text-navy-300' : 'text-navy-500'
                  : 'text-white/80'
              )}>
                Creative Int'l Academy
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div key={link.label} className="relative">
                {link.children ? (
                  <div>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        solidBg
                          ? isDark
                            ? 'text-navy-200 hover:text-maroon-400 hover:bg-white/5'
                            : 'text-navy-700 hover:text-maroon-600 hover:bg-warm-100'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200',
                        activeDropdown === link.label && 'rotate-180'
                      )} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            'absolute top-full left-0 mt-2 w-56 rounded-xl shadow-2xl py-2 z-50',
                            isDark
                              ? 'bg-navy-900 border border-maroon-700/30'
                              : 'bg-white border border-warm-200'
                          )}
                        >
                          {link.children.map(child => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={cn(
                                'block px-4 py-2.5 text-sm font-medium transition-all duration-150',
                                isDark
                                  ? 'text-navy-200 hover:text-maroon-400 hover:bg-white/5'
                                  : 'text-navy-700 hover:text-maroon-600 hover:bg-warm-100',
                                isActive(child.href) && 'text-maroon-600 font-semibold'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.href!}
                    className={cn(
                      'relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      solidBg
                        ? isDark
                          ? 'text-navy-200 hover:text-maroon-400 hover:bg-white/5'
                          : 'text-navy-700 hover:text-maroon-600 hover:bg-warm-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10',
                      isActive(link.href!) && (solidBg ? 'text-maroon-600 font-semibold' : 'text-white font-semibold')
                    )}
                  >
                    {link.label}
                    {isActive(link.href!) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-maroon-500"
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                solidBg
                  ? isDark
                    ? 'text-navy-300 hover:bg-white/10 hover:text-maroon-400'
                    : 'text-navy-600 hover:bg-warm-100 hover:text-maroon-600'
                  : 'text-white/90 hover:bg-white/10'
              )}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>


            {/* Login Button — Desktop */}
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-maroon-600 hover:bg-maroon-700 text-white text-sm font-semibold shadow-md hover:shadow-maroon-600/40 hover:scale-105 transition-all duration-300"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </Link>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={cn(
                'lg:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
                solidBg
                  ? isDark ? 'text-navy-300 hover:bg-white/10' : 'text-navy-700 hover:bg-warm-100'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'lg:hidden overflow-hidden border-t pb-4',
                isDark ? 'border-maroon-700/20' : 'border-warm-200'
              )}
            >
              <div className="pt-4 space-y-1">
                {navLinks.map(link => (
                  <div key={link.label}>
                    {link.children ? (
                      <div>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium',
                            isDark ? 'text-navy-200 hover:bg-white/5' : 'text-navy-700 hover:bg-warm-100'
                          )}
                        >
                          {link.label}
                          <ChevronDown className={cn('w-4 h-4 transition-transform', activeDropdown === link.label && 'rotate-180')} />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === link.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 mt-1 space-y-1"
                            >
                              {link.children.map(child => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  className={cn(
                                    'block px-4 py-2 rounded-lg text-sm',
                                    isDark ? 'text-navy-300 hover:text-maroon-400 hover:bg-white/5' : 'text-navy-600 hover:text-maroon-600 hover:bg-warm-100',
                                    isActive(child.href) && 'text-maroon-600 font-semibold'
                                  )}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={link.href!}
                        className={cn(
                          'block px-4 py-2.5 rounded-lg text-sm font-medium',
                          isDark ? 'text-navy-200 hover:text-maroon-400 hover:bg-white/5' : 'text-navy-700 hover:text-maroon-600 hover:bg-warm-100',
                          isActive(link.href!) && 'text-maroon-600 font-semibold'
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
                {/* Login Button — Mobile */}
                <div className="pt-2 px-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-maroon-600 hover:bg-maroon-700 text-white text-sm font-semibold transition-colors"
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
