import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'maroon' | 'outline' | 'green' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-navy-700 text-white hover:bg-navy-600 hover:shadow-lg hover:shadow-navy-900/30 hover:scale-[1.02] focus:ring-navy-500 active:scale-95',
    secondary: 'bg-white text-navy-800 border border-warm-200 hover:bg-warm-100 hover:border-warm-300 focus:ring-navy-200 shadow-sm',
    ghost:     'bg-transparent text-navy-700 hover:bg-warm-100 dark:text-white/90 dark:hover:bg-white/10',
    maroon:    'bg-gradient-to-r from-maroon-600 to-maroon-700 text-white hover:from-maroon-500 hover:to-maroon-600 hover:shadow-lg hover:shadow-maroon-600/30 hover:scale-[1.02] focus:ring-maroon-500 active:scale-95',
    gold:      'bg-gradient-to-r from-maroon-600 to-maroon-700 text-white hover:from-maroon-500 hover:to-maroon-600 hover:shadow-lg hover:shadow-maroon-600/30 hover:scale-[1.02] focus:ring-maroon-500 active:scale-95',
    green:     'bg-gradient-to-r from-forest-600 to-forest-700 text-white hover:from-forest-500 hover:to-forest-600 hover:shadow-lg hover:shadow-forest-700/30 hover:scale-[1.02] focus:ring-forest-500 active:scale-95',
    outline:   'bg-transparent border-2 border-maroon-600 text-maroon-600 hover:bg-maroon-600 hover:text-white focus:ring-maroon-500 active:scale-95',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
