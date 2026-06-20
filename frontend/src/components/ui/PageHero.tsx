import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  seoTitle?: string
  seoDescription?: string
}

export default function PageHero({ title, subtitle, breadcrumbs, seoTitle, seoDescription }: PageHeroProps) {
  return (
    <>
      <Helmet>
        <title>{seoTitle || `${title} — CIGMA`}</title>
        <meta name="description" content={seoDescription || subtitle || `${title} - Creative International Academy`} />
      </Helmet>
      <div className="relative min-h-[42vh] flex items-end overflow-hidden pt-24 bg-hero-gradient">
        {/* Geometric pattern inspired by logo */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#8B3A3A" strokeWidth="0.8" />
                <circle cx="40" cy="40" r="20" fill="none" stroke="#ffffff" strokeWidth="0.4" />
                <circle cx="0" cy="0" r="8" fill="#4D7C4D" fillOpacity="0.4" />
                <circle cx="80" cy="0" r="8" fill="#4D7C4D" fillOpacity="0.4" />
                <circle cx="0" cy="80" r="8" fill="#4D7C4D" fillOpacity="0.4" />
                <circle cx="80" cy="80" r="8" fill="#4D7C4D" fillOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/60 via-navy-800/40 to-maroon-800/20" />

        {/* Floating decorative rings */}
        <div className="absolute top-20 right-10 w-32 h-32 border border-maroon-500/20 rounded-full animate-spin-slow" />
        <div className="absolute bottom-10 left-10 w-20 h-20 border border-forest-500/15 rounded-full animate-float" />
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-maroon-500/10 rounded-full animate-float-delayed" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          {/* Breadcrumb */}
          {breadcrumbs && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-white/60 text-sm mb-4"
            >
              <Link to="/" className="hover:text-maroon-300 transition-colors">Home</Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-maroon-300 transition-colors">{crumb.label}</Link>
                  ) : (
                    <span className="text-maroon-300">{crumb.label}</span>
                  )}
                </span>
              ))}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            {title}
          </motion.h1>

          {/* Tricolor bar */}
          <div className="flex gap-1 mt-4 mb-4">
            <div className="h-1 w-14 rounded-full bg-maroon-500" />
            <div className="h-1 w-6 rounded-full bg-forest-400" />
            <div className="h-1 w-3 rounded-full bg-white/60" />
          </div>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/75 text-lg max-w-2xl"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </>
  )
}
