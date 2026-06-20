import React from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/ThemeContext'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  accent?: boolean   // maroon accent border
  gold?: boolean     // backward-compat alias for accent
}

export default function GlassCard({ children, className = '', hover = false, accent = false, gold = false }: GlassCardProps) {
  const { isDark } = useTheme()
  const hasAccent = accent || gold
  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden transition-all duration-300',
        isDark
          ? 'bg-white/5 border border-white/10 backdrop-blur-xl'
          : 'bg-white/70 border border-warm-200 backdrop-blur-xl shadow-md',
        hasAccent && 'border-maroon-600/40',
        hover && 'hover:scale-[1.02] hover:shadow-xl cursor-pointer',
        hover && isDark && 'hover:border-maroon-600/40 hover:bg-white/10',
        hover && !isDark && 'hover:border-maroon-500/50 hover:shadow-maroon-100',
        className
      )}
    >
      {children}
    </div>
  )
}
