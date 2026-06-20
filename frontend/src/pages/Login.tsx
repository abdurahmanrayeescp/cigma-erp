import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { LogIn, Eye, EyeOff, GraduationCap, Users, ShieldCheck, Loader2 } from 'lucide-react'

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'staff',   label: 'Staff',   icon: Users },
  { id: 'admin',   label: 'Admin',   icon: ShieldCheck },
]

export default function Login() {
  const { isDark }    = useTheme()
  const { login }     = useAuth()
  const navigate      = useNavigate()

  const [role, setRole]         = useState('student')
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      toast.error('Please enter your email and password.')
      return
    }

    setIsLoading(true)
    const result = await login(form.email.trim(), form.password)
    setIsLoading(false)

    if (result.success) {
      toast.success('Logged in successfully!')
      navigate('/')        // redirect to home (swap with '/dashboard' when ready)
    } else {
      toast.error(result.message || 'Login failed. Please try again.')
    }
  }

  return (
    <>
      <Helmet>
        <title>Login — CIGMA</title>
        <meta name="description" content="Login to your CIGMA portal — Student, Staff, or Admin access." />
      </Helmet>

      <div className={cn(
        'min-h-screen flex items-center justify-center px-4 py-24',
        isDark ? 'bg-navy-950' : 'bg-warm-50'
      )}>
        {/* Background glow circles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-maroon-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-navy-600/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={cn(
            'relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden',
            isDark
              ? 'bg-navy-900 border border-maroon-700/30'
              : 'bg-white border border-warm-200'
          )}
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-maroon-600 via-navy-600 to-forest-500" />

          <div className="px-8 py-10">
            {/* Logo + heading */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="/logo.png"
                alt="CIGMA"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-maroon-600/30 shadow-lg mb-4"
              />
              <h1 className={cn('font-display text-2xl font-bold', isDark ? 'text-white' : 'text-navy-900')}>
                Welcome Back
              </h1>
              <p className={cn('text-sm mt-1', isDark ? 'text-navy-300' : 'text-navy-500')}>
                Sign in to your CIGMA account
              </p>
            </div>

            {/* Role selector */}
            <div className={cn('flex rounded-xl p-1 mb-6', isDark ? 'bg-navy-800' : 'bg-warm-100')}>
              {roles.map(r => {
                const Icon = r.icon
                const active = role === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                      active
                        ? 'bg-maroon-600 text-white shadow-md shadow-maroon-600/30'
                        : isDark
                          ? 'text-navy-300 hover:text-white'
                          : 'text-navy-500 hover:text-navy-700'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {r.label}
                  </button>
                )
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-navy-200' : 'text-navy-700')}>
                  Email / Username
                </label>
                <input
                  id="login-email"
                  type="text"
                  required
                  autoComplete="email"
                  placeholder={role === 'student' ? 'Student ID or email' : 'Your email address'}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  disabled={isLoading}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all duration-200',
                    'focus:ring-2 focus:ring-maroon-500/50 focus:border-maroon-500',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    isDark
                      ? 'bg-navy-800 border-navy-700 text-white placeholder:text-navy-500'
                      : 'bg-warm-50 border-warm-200 text-navy-900 placeholder:text-navy-400'
                  )}
                />
              </div>

              <div>
                <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-navy-200' : 'text-navy-700')}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    disabled={isLoading}
                    className={cn(
                      'w-full px-4 py-3 pr-11 rounded-xl text-sm border outline-none transition-all duration-200',
                      'focus:ring-2 focus:ring-maroon-500/50 focus:border-maroon-500',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      isDark
                        ? 'bg-navy-800 border-navy-700 text-white placeholder:text-navy-500'
                        : 'bg-warm-50 border-warm-200 text-navy-900 placeholder:text-navy-400'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className={cn('absolute right-3 top-1/2 -translate-y-1/2', isDark ? 'text-navy-400 hover:text-navy-200' : 'text-navy-400 hover:text-navy-600')}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input id="remember-me" type="checkbox" className="accent-maroon-600 w-3.5 h-3.5 rounded" />
                  <span className={isDark ? 'text-navy-300' : 'text-navy-500'}>Remember me</span>
                </label>
                <button type="button" className="text-maroon-500 hover:text-maroon-600 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-maroon-600 hover:bg-maroon-700 disabled:bg-maroon-400 text-white font-semibold text-sm shadow-lg shadow-maroon-600/30 hover:scale-[1.02] disabled:scale-100 transition-all duration-300 mt-2"
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                  : <><LogIn className="w-4 h-4" /> Sign In as {roles.find(r => r.id === role)?.label}</>
                }
              </button>
            </form>

            {/* Footer note */}
            <p className={cn('text-center text-xs mt-6', isDark ? 'text-navy-500' : 'text-navy-400')}>
              Need access?{' '}
              <a href="/contact" className="text-maroon-500 hover:text-maroon-600 font-medium transition-colors">
                Contact the school office
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
