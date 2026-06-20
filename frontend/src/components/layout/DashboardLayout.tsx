import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Bell, User, LogOut, Moon, Sun, 
  LayoutDashboard, Users, GraduationCap, BookOpen, 
  CalendarDays, CheckSquare, FileText, IndianRupee,
  Settings, Layers, Home, Award, Bus, Banknote, ShieldAlert
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import NotificationsWidget from '@/components/portal/NotificationsWidget'

// Types for navigation
interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/portal/admin', icon: LayoutDashboard },
  { label: 'Students', href: '/portal/admin/students', icon: Users },
  { label: 'Teachers', href: '/portal/admin/teachers', icon: GraduationCap },
  { label: 'Classes & Subjects', href: '/portal/admin/academics', icon: BookOpen },
  { label: 'Attendance Analytics', href: '/portal/admin/attendance', icon: CheckSquare },
  { label: 'Marks & Results', href: '/portal/admin/marks', icon: FileText },
  { label: 'Fees Overview', href: '/portal/admin/fees', icon: IndianRupee },
  { label: 'Timetable', href: '/portal/admin/timetable', icon: CalendarDays },
  { label: 'Library', href: '/portal/admin/library', icon: BookOpen },
  { label: 'Transport', href: '/portal/admin/transport', icon: Bus },
  { label: 'Payroll', href: '/portal/admin/payroll', icon: Banknote },
  { label: 'Certificates', href: '/portal/admin/certificates', icon: Award },
  { label: 'Reports', href: '/portal/admin/reports', icon: Layers },
  { label: 'Audit Logs', href: '/portal/admin/audit', icon: ShieldAlert },
  { label: 'Settings', href: '/portal/admin/settings', icon: Settings },
]

const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/portal/teacher', icon: LayoutDashboard },
  { label: 'My Classes', href: '/portal/teacher/classes', icon: Users },
  { label: 'Attendance', href: '/portal/teacher/attendance', icon: CheckSquare },
  { label: 'Marks Entry', href: '/portal/teacher/marks', icon: FileText },
  { label: 'Homework', href: '/portal/teacher/homework', icon: BookOpen },
  { label: 'Timetable', href: '/portal/teacher/timetable', icon: CalendarDays },
  { label: 'Payslips', href: '/portal/teacher/payslips', icon: Banknote },
]

const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/portal/student', icon: LayoutDashboard },
  { label: 'Attendance', href: '/portal/student/attendance', icon: CheckSquare },
  { label: 'Results', href: '/portal/student/results', icon: FileText },
  { label: 'Homework', href: '/portal/student/homework', icon: BookOpen },
  { label: 'Timetable', href: '/portal/student/timetable', icon: CalendarDays },
  { label: 'Library', href: '/portal/student/library', icon: BookOpen },
]

const PARENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/portal/parent', icon: LayoutDashboard },
  { label: 'Attendance', href: '/portal/parent/attendance', icon: CheckSquare },
  { label: 'Results', href: '/portal/parent/results', icon: FileText },
  { label: 'Homework', href: '/portal/parent/homework', icon: BookOpen },
  { label: 'Fees', href: '/portal/parent/fees', icon: IndianRupee },
  { label: 'Timetable', href: '/portal/parent/timetable', icon: CalendarDays },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Determine navigation based on role
  let navItems: NavItem[] = []
  if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') navItems = ADMIN_NAV
  else if (user?.role === 'TEACHER') navItems = TEACHER_NAV
  else if (user?.role === 'PARENT') navItems = PARENT_NAV
  else if (user?.role === 'STUDENT') navItems = STUDENT_NAV

  return (
    <div className={cn('min-h-screen flex transition-colors duration-300', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-navy-900/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r shadow-2xl lg:shadow-none lg:static transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isDark ? 'bg-navy-900 border-white/5' : 'bg-white border-navy-100'
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-transparent">
          <Layers className="w-8 h-8 text-maroon-600 mr-3" />
          <span className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-navy-900')}>CIGMA ERP</span>
        </div>

        <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/portal/admin' && location.pathname.startsWith(item.href))
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-maroon-600 text-white shadow-md shadow-maroon-600/20' 
                    : isDark 
                      ? 'text-gray-400 hover:bg-white/5 hover:text-white' 
                      : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className={cn(
          'h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b z-30',
          isDark ? 'bg-navy-900/80 border-white/5 backdrop-blur-md' : 'bg-white/80 border-navy-100 backdrop-blur-md'
        )}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={cn('p-2 rounded-lg lg:hidden', isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-navy-50 text-navy-600')}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className={cn('text-sm font-semibold hidden sm:block', isDark ? 'text-white' : 'text-navy-900')}>
              {user?.role.replace('_', ' ')} PORTAL
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <NavLink to="/" className={cn('p-2 rounded-lg hidden sm:block transition-colors', isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-navy-50 text-navy-400 hover:text-navy-600')} title="Back to Website">
              <Home className="w-5 h-5" />
            </NavLink>
            <button
              onClick={toggleTheme}
              className={cn('p-2 rounded-lg transition-colors', isDark ? 'hover:bg-white/10 text-gray-400 hover:text-yellow-400' : 'hover:bg-navy-50 text-navy-400 hover:text-navy-600')}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <NotificationsWidget />
            
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className={cn('text-sm font-bold leading-tight', isDark ? 'text-white' : 'text-navy-900')}>{user?.name}</p>
                <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-navy-500')}>{user?.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-maroon-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <button onClick={logout} className={cn('p-2 rounded-lg transition-colors ml-1', isDark ? 'hover:bg-white/10 text-red-400' : 'hover:bg-red-50 text-red-500')} title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-6 lg:p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
