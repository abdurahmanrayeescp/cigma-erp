import { cn } from '@/lib/utils'
import { useTheme } from '@/context/ThemeContext'

interface SectionTitleProps {
  label?: string
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
  className?: string
}

export default function SectionTitle({ label, title, subtitle, centered = false, light = false, className = '' }: SectionTitleProps) {
  const { isDark } = useTheme()

  return (
    <div className={cn(centered && 'text-center', className)}>
      {label && (
        <p className="text-maroon-600 text-sm font-semibold uppercase tracking-[0.2em] mb-3">
          {label}
        </p>
      )}
      <h2 className={cn(
        'font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4',
        light ? 'text-white' : isDark ? 'text-white' : 'text-navy-800'
      )}>
        {title}
      </h2>
      {/* Tricolor underline bar inspired by logo colors */}
      <div className={cn('flex gap-1 mb-4', centered && 'justify-center')}>
        <div className="h-1 w-10 rounded-full bg-maroon-600" />
        <div className="h-1 w-5 rounded-full bg-navy-600" />
        <div className="h-1 w-3 rounded-full bg-forest-500" />
      </div>
      {subtitle && (
        <p className={cn(
          'text-base md:text-lg max-w-2xl leading-relaxed',
          light ? 'text-white/80' : isDark ? 'text-navy-300' : 'text-navy-600',
          centered && 'mx-auto'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
