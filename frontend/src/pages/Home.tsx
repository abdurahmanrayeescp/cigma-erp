import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useRef } from 'react'
import { BookOpen, Star, Users, Award, ChevronDown, ArrowRight, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlassCard from '@/components/ui/GlassCard'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const stats = [
  { icon: Users, value: '500+', label: 'Students Enrolled' },
  { icon: Star, value: '7+', label: 'Years of Excellence' },
  { icon: BookOpen, value: '12', label: 'Grade Levels' },
  { icon: Award, value: '100%', label: 'Dedicated Faculty' },
]

const coreValues = [
  { icon: '🌙', title: 'Faith (Iman)', desc: 'Rooted in sincere belief and devotion to Allah', color: 'from-navy-600 to-navy-700' },
  { icon: '📖', title: 'Knowledge (Ilm)', desc: 'Pursuing academic and Islamic wisdom together', color: 'from-maroon-600 to-maroon-700' },
  { icon: '⚖️', title: 'Integrity', desc: 'Honesty and moral uprightness in all actions', color: 'from-forest-600 to-forest-700' },
  { icon: '🤝', title: 'Respect', desc: 'Honouring every individual with dignity', color: 'from-navy-700 to-navy-800' },
  { icon: '🏆', title: 'Excellence', desc: 'Striving for the highest standard in all endeavors', color: 'from-maroon-500 to-maroon-600' },
  { icon: '📏', title: 'Discipline', desc: "Order and steadfastness guided by Qur'an and Sunnah", color: 'from-forest-500 to-forest-600' },
  { icon: '❤️', title: 'Service', desc: 'Giving back to humanity with compassion', color: 'from-maroon-700 to-navy-700' },
  { icon: '👑', title: 'Leadership', desc: 'Developing confident, visionary future leaders', color: 'from-navy-600 to-forest-600' },
]

const programs = [
  { level: 'Prep-1 & Prep-2', grade: 'Pre-School', icon: '🌱', color: 'from-forest-400 to-forest-600', forBoth: true },
  { level: 'Primary', grade: 'Grade 1–5', icon: '📚', color: 'from-navy-500 to-navy-700', forBoth: true },
  { level: 'Middle School', grade: 'Grade 6–8', icon: '🔬', color: 'from-maroon-500 to-maroon-700', forBoth: true },
  { level: 'High School', grade: 'Grade 9–10', icon: '🎓', color: 'from-navy-600 to-maroon-600', girls: true },
  { level: 'Higher Secondary', grade: 'Grade 11–12', icon: '⭐', color: 'from-maroon-600 to-navy-800', girls: true },
]

const news = [
  { date: 'Jun 2025', title: 'Al-Kayyisah Islamic Course Admissions Open', category: 'Admissions' },
  { date: 'May 2025', title: 'Annual Quran Competition Results Announced', category: 'Events' },
  { date: 'Apr 2025', title: 'Academic Year 2025-26 Schedule Released', category: 'Academic' },
]

const FloatingRing = ({ className, delay = 0, size = 80 }: { className?: string; delay?: number; size?: number }) => (
  <motion.div
    className={cn('absolute border rounded-full', className)}
    style={{ width: size, height: size }}
    animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
  />
)

export default function Home() {
  const { isDark } = useTheme()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <>
      <Helmet>
        <title>CIGMA — Creative International Academy | Live for Humanity</title>
        <meta name="description" content="Creative International Academy (CIGMA) — Where Academic Excellence Meets Islamic Values. Established 2018, Thana, Kannur, Kerala. NIOS Board. Al-Kayyisah Islamic Course." />
        <meta property="og:title" content="CIGMA — Creative International Academy" />
        <meta property="og:description" content="Where Academic Excellence Meets Islamic Values." />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "School",
          "name": "Creative International Academy",
          "alternateName": "CIGMA",
          "url": "",
          "logo": "/logo.png",
          "description": "Where Academic Excellence Meets Islamic Values",
          "foundingDate": "2018-06",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Thana",
            "addressRegion": "Kannur, Kerala",
            "postalCode": "670012",
            "addressCountry": "IN"
          },
          "telephone": ["+919746770422", "+919188110422"],
          "email": "creativekidskannur@gmail.com",
          "sameAs": ["https://instagram.com/creativeintl"]
        })}</script>
      </Helmet>

      {/* ====== HERO ====== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
        {/* Logo-inspired circular patterns */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hero-bg-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#8B3A3A" strokeWidth="1" />
                <circle cx="60" cy="60" r="35" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="60" cy="60" r="5" fill="#4D7C4D" fillOpacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-bg-pattern)" />
          </svg>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/80 via-navy-900/70 to-maroon-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,58,58,0.15),transparent_60%)]" />

        {/* Floating decorative rings */}
        <FloatingRing className="top-24 right-16 border-maroon-500/25" size={120} />
        <FloatingRing className="top-40 right-40 border-forest-500/20" size={60} delay={1.5} />
        <FloatingRing className="bottom-32 left-24 border-navy-400/25" size={90} delay={2} />
        <FloatingRing className="bottom-16 left-52 border-maroon-500/15" size={40} delay={3} />
        <motion.div
          className="absolute top-1/3 right-1/4 w-4 h-4 bg-maroon-500/40 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-2/3 left-1/3 w-3 h-3 bg-forest-400/40 rounded-full"
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 z-10">
          <div className="max-w-4xl">
            {/* Logo + Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <img
                src="/logo.png"
                alt="CIGMA Logo"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-maroon-400/60 shadow-xl"
              />
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-maroon-600/20 border border-maroon-500/30 text-maroon-200 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-maroon-400 animate-pulse" />
                Est. June 2018 · Thana, Kannur, Kerala
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Where{' '}
              <span className="text-maroon-gradient">Academic Excellence</span>
              {' '}Meets{' '}
              <span className="relative">
                Islamic Values
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-maroon-500 to-forest-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/75 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl"
            >
              Creative International Academy has been providing quality academic and Islamic education since June 2018. We nurture confident, knowledgeable, and morally responsible students through modern education integrated with the <span className="text-maroon-300 font-semibold">Al-Kayyisah Islamic Course</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/academics">
                <Button variant="maroon" size="lg" className="text-base px-8 py-4">
                  <BookOpen className="w-5 h-5" />
                  Explore Academics
                </Button>
              </Link>
              <Link to="/admissions">
                <Button variant="outline" size="lg" className="text-base px-8 py-4 border-white/30 text-white hover:bg-white hover:text-navy-800">
                  <ArrowRight className="w-5 h-5" />
                  Apply for Admission
                </Button>
              </Link>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 text-white/40 font-arabic text-xl tracking-wide"
            >
              "Live for Humanity"
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* Floating glass info cards */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4"
        >
          {[
            { icon: '📖', label: 'Al-Kayyisah Course' },
            { icon: '📜', label: 'NIOS Board' },
            { icon: '👩‍🎓', label: 'Girls up to +2' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.15 }}
              className="glass rounded-xl px-4 py-3 flex items-center gap-3 border border-white/10"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white/80 text-sm font-medium whitespace-nowrap">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="py-8 relative bg-navy-800 border-y border-maroon-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <AnimatedSection key={stat.label} delay={i * 0.1}>
                  <div className="text-center">
                    <Icon className="w-6 h-6 text-maroon-400 mx-auto mb-2" />
                    <p className="text-4xl font-bold font-display text-white">{stat.value}</p>
                    <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== ABOUT PREVIEW ====== */}
      <section className={cn('section-padding relative overflow-hidden', isDark ? 'bg-navy-950' : 'bg-warm-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <SectionTitle
                label="Our Story"
                title="A Vision Rooted in Faith & Knowledge"
                subtitle="Creative International Academy was established in June 2018 with a commitment to nurturing students who excel academically while remaining grounded in Islamic values."
              />
              <div className="mt-8 space-y-4">
                {[
                  { icon: '🏛️', text: 'Affiliated with National Institute of Open Schooling (NIOS)' },
                  { icon: '📍', text: 'Located in Thana, Kannur, Kerala, Pin-670012' },
                  { icon: '👦👧', text: 'Boys up to Grade 7 · Girls up to Higher Secondary' },
                  { icon: '📖', text: 'Integrating Al-Kayyisah Islamic Course with regular academics' },
                ].map(item => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <p className={cn('text-sm leading-relaxed', isDark ? 'text-navy-300' : 'text-navy-600')}>{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/about">
                  <Button variant="maroon">Learn Our Story <ArrowRight className="w-4 h-4" /></Button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto relative">
                  <GlassCard className="p-8 text-center bg-gradient-to-br from-navy-800 to-navy-900 border-maroon-600/30">
                    <img src="/logo.png" alt="CIGMA" className="w-32 h-32 mx-auto rounded-full object-cover ring-4 ring-maroon-500/40 mb-4" />
                    <p className="font-display text-2xl font-bold text-white mb-1">CIGMA</p>
                    <p className="text-white/60 text-sm mb-4">Creative International Academy</p>
                    <div className="h-px bg-gradient-to-r from-transparent via-maroon-500 to-transparent mb-4" />
                    <p className="font-arabic text-white/60 text-lg">"Live for Humanity"</p>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-xl bg-white/5">
                        <p className="text-2xl font-bold text-maroon-400">2018</p>
                        <p className="text-white/50 text-xs">Established</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <p className="text-2xl font-bold text-forest-400">NIOS</p>
                        <p className="text-white/50 text-xs">Board</p>
                      </div>
                    </div>
                  </GlassCard>
                  <div className="absolute -inset-4 rounded-3xl border border-maroon-500/10 -z-10" />
                  <div className="absolute -inset-8 rounded-3xl border border-navy-500/5 -z-10" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ====== CORE VALUES ====== */}
      <section className={cn('section-padding relative overflow-hidden', isDark ? 'bg-navy-900' : 'bg-white')}>
        <div className="absolute inset-0 tree-pattern opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle
              label="What We Stand For"
              title="Our Core Values"
              subtitle="Eight pillars that define our educational philosophy and shape every student's journey."
              centered
            />
          </AnimatedSection>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {coreValues.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.08}>
                <GlassCard hover className="p-5 text-center group">
                  <div className={cn('w-14 h-14 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform duration-300', value.color)}>
                    {value.icon}
                  </div>
                  <h3 className={cn('font-semibold text-sm mb-2', isDark ? 'text-white' : 'text-navy-900')}>{value.title}</h3>
                  <p className={cn('text-xs leading-relaxed', isDark ? 'text-navy-300' : 'text-navy-600')}>{value.desc}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PROGRAMS ====== */}
      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-warm-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle
              label="Academic Programs"
              title="Education for Every Stage"
              subtitle="From early childhood to higher secondary — a complete educational journey aligned with NIOS standards."
              centered
            />
          </AnimatedSection>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {programs.map((prog, i) => (
              <AnimatedSection key={prog.level} delay={i * 0.1}>
                <div className={cn(
                  'relative rounded-2xl p-6 text-center overflow-hidden group hover:scale-[1.03] transition-all duration-300 cursor-pointer',
                  `bg-gradient-to-br ${prog.color}`
                )}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300" />
                  <div className="text-4xl mb-3">{prog.icon}</div>
                  <h3 className="text-white font-bold text-sm mb-1">{prog.level}</h3>
                  <p className="text-white/80 text-xs mb-3">{prog.grade}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {prog.forBoth && (
                      <>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">Boys</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">Girls</span>
                      </>
                    )}
                    {prog.girls && !prog.forBoth && (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs">Girls Only</span>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-8 text-center">
            <Link to="/academics">
              <Button variant="maroon">View Full Curriculum <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== AL-KAYYISAH SECTION ====== */}
      <section className="section-padding relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="alkay-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8B3A3A" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="#4D7C4D" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#alkay-pattern)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 to-maroon-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-maroon-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3">Islamic Education</p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                The Al-Kayyisah<br />
                <span className="text-maroon-gradient">Islamic Course</span>
              </h2>
              <div className="flex gap-1 mb-6">
                <div className="h-1 w-12 rounded-full bg-maroon-600" />
                <div className="h-1 w-4 rounded-full bg-forest-500" />
              </div>
              <p className="text-white/75 text-lg leading-relaxed mb-6">
                A comprehensive Islamic curriculum that runs alongside our regular academics, grounding students in authentic teachings from the Qur'an and Sunnah — preparing them to be righteous, knowledgeable individuals who contribute positively to society.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Quranic studies and Tajweed',
                  'Hadith and Islamic jurisprudence',
                  'Islamic history and ethics',
                  'Character development and moral values',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-maroon-600/20 border border-maroon-500/40 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-maroon-400" />
                    </div>
                    <span className="text-white/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/academics">
                <Button variant="maroon">Learn More <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <GlassCard className="p-8 text-center border-maroon-600/30">
                <p className="font-arabic text-3xl text-maroon-300 mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                <p className="text-white/60 text-sm mb-6">In the name of Allah, the Most Gracious, the Most Merciful</p>
                <div className="h-px bg-gradient-to-r from-transparent via-maroon-500 to-transparent mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  {["Qur'an", 'Sunnah', 'Aqeedah', 'Akhlaq'].map(subject => (
                    <div key={subject} className="p-4 rounded-xl bg-maroon-600/10 border border-maroon-600/20">
                      <p className="text-maroon-300 font-semibold text-sm">{subject}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ====== PRINCIPAL PREVIEW ====== */}
      <section className={cn('section-padding', isDark ? 'bg-navy-900' : 'bg-white')}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className={cn(
              'relative rounded-3xl p-10 md:p-14 overflow-hidden',
              isDark ? 'bg-navy-800 border border-maroon-700/30' : 'bg-navy-900'
            )}>
              <div className="absolute inset-0 tree-pattern opacity-20" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-maroon-500 to-navy-700 flex items-center justify-center text-5xl shadow-xl">
                    👨‍💼
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-maroon-400 text-sm font-semibold uppercase tracking-widest mb-3">Message from the Principal</p>
                  <blockquote className="font-display text-xl md:text-2xl text-white italic leading-relaxed mb-4">
                    "Our mission is to raise a generation that is deeply rooted in faith, excels in knowledge, and serves humanity with compassion and courage."
                  </blockquote>
                  <p className="text-white font-semibold text-base">Mr. Rayees Hashim Nyzami</p>
                  <p className="text-white/60 text-sm">Principal, CIGMA</p>
                </div>
              </div>
              <div className="mt-8 text-center md:text-right">
                <Link to="/principal-message">
                  <Button variant="outline" className="border-maroon-500/40 text-maroon-400 hover:bg-maroon-600 hover:text-white hover:border-maroon-600">
                    Read Full Message <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== NEWS TICKER ====== */}
      <section className={cn('py-6 border-y', isDark ? 'bg-navy-950 border-maroon-700/15' : 'bg-warm-50 border-warm-200')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="shrink-0 px-3 py-1 rounded-md bg-maroon-600 text-white text-xs font-bold uppercase tracking-wider">Latest</span>
            <div className="overflow-hidden flex-1">
              <motion.div
                className="flex gap-12"
                animate={{ x: [0, -600] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                {[...news, ...news].map((item, i) => (
                  <span key={i} className={cn('shrink-0 text-sm', isDark ? 'text-navy-300' : 'text-navy-700')}>
                    <span className="text-maroon-600 font-semibold">{item.date}</span> — {item.title}
                  </span>
                ))}
              </motion.div>
            </div>
            <Link to="/news-events" className="shrink-0">
              <Button variant="ghost" size="sm" className="text-maroon-600 hover:text-maroon-700">
                All News <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== ADMISSIONS CTA ====== */}
      <section className="section-padding bg-gradient-to-r from-maroon-700 via-maroon-600 to-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 tree-pattern" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">📣 Admissions Open</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Begin Your Journey with CIGMA
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of learners where academic excellence meets Islamic values. Applications for the 2025–26 academic year are now open.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admissions">
                <Button variant="secondary" size="lg">Apply for Admission</Button>
              </Link>
              <a href="tel:+919746770422">
                <Button size="lg" className="bg-white/20 border border-white/40 text-white hover:bg-white/30">
                  <Phone className="w-4 h-4" /> Call Now: +91 97467 70422
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== CONTACT QUICK ====== */}
      <section className={cn('py-12 border-t', isDark ? 'bg-navy-950 border-white/5' : 'bg-white border-warm-100')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className={cn('flex items-center gap-3', isDark ? 'text-navy-300' : 'text-navy-700')}>
              <Phone className="w-5 h-5 text-maroon-600" />
              <div>
                <p className="text-xs text-navy-400 mb-0.5">Call us anytime</p>
                <a href="tel:+919746770422" className="font-semibold hover:text-maroon-600 transition-colors">+91 97467 70422</a>
              </div>
            </div>
            <div className={cn('flex items-center gap-3', isDark ? 'text-navy-300' : 'text-navy-700')}>
              <InstagramIcon className="w-5 h-5 text-maroon-600" />
              <div>
                <p className="text-xs text-navy-400 mb-0.5">Follow us</p>
                <a href="https://instagram.com/creativeintl" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-maroon-600 transition-colors">@creativeintl</a>
              </div>
            </div>
            <Link to="/contact">
              <Button variant="maroon">Get In Touch <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== MAP ====== */}
      <section className={cn('', isDark ? 'bg-navy-950' : 'bg-warm-50')}>
        <div className="w-full h-64 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.0!2d75.377!3d11.869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDUyJzA4LjQiTiA3NcKwMjInMzcuMiJF!5e0!3m2!1sen!2sin!4v1234567890"
            className="w-full h-full grayscale"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="CIGMA Location — Thana, Kannur, Kerala"
          />
          <div className="absolute inset-0 pointer-events-none border-t-4 border-maroon-600" />
        </div>
      </section>
    </>
  )
}
