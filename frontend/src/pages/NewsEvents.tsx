import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Tag, ArrowRight, Search, Loader2 } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { newsApi, type NewsItem } from '@/lib/api'

// ─── Static fallback (shown when DB is empty) ─────────────────────────
const FALLBACK_NEWS: Array<NewsItem & { icon: string }> = [
  { _id: 's1', category: 'Admissions', publishedAt: 'June 10, 2025', title: 'Admissions Open for Academic Year 2025–26', content: 'Creative International Girls Madrassa Academy is pleased to announce that admissions are now open for the academic year 2025–26 across all grade levels from Prep-1 to Higher Secondary.', isPublished: true, icon: '📋' },
  { _id: 's2', category: 'Events',     publishedAt: 'May 20, 2025',  title: 'Annual Quran Competition 2025 — Results Announced', content: 'CIGMA proudly announces the results of the Annual Quran Recitation Competition held on May 18, 2025. Congratulations to all participants for their inspiring performances.', isPublished: true, icon: '📖' },
  { _id: 's3', category: 'Academic',   publishedAt: 'April 15, 2025', title: 'Academic Calendar for 2025–26 Released', content: 'The academic calendar for the upcoming school year has been officially released. Students and parents can download the full schedule from our Downloads section.', isPublished: true, icon: '📅' },
  { _id: 's4', category: 'Islamic',    publishedAt: 'March 30, 2025', title: 'Al-Kayyisah Course Completion Ceremony', content: 'We celebrated the successful completion of the Al-Kayyisah Islamic Course by our students in a special ceremony attended by parents and faculty.', isPublished: true, icon: '🎓' },
  { _id: 's5', category: 'Events',     publishedAt: 'March 10, 2025', title: 'Annual Sports Day 2025 — Highlights', content: "CIGMA's Annual Sports Day was a huge success with students competing in various athletic events, showcasing sportsmanship and teamwork.", isPublished: true, icon: '🏆' },
  { _id: 's6', category: 'Academic',   publishedAt: 'February 5, 2025', title: 'NIOS Examination Results — Class 10 & 12', content: 'We are delighted to announce that CIGMA students have performed exceptionally well in the NIOS board examinations. The school congratulates all successful students.', isPublished: true, icon: '✅' },
]

const ICON_MAP: Record<string, string> = {
  Admissions: '📋', Academic: '📅', Events: '🏆', Islamic: '🕌', Sports: '⚽', General: '📰',
}

const events = [
  { date: 'Jul 1',  title: 'New Academic Year Begins',     type: 'Academic', hijri: '5 Muharram 1447' },
  { date: 'Jul 15', title: 'Parent-Teacher Meeting',       type: 'Academic', hijri: '19 Muharram 1447' },
  { date: 'Aug 10', title: 'Islamic Quiz Competition',     type: 'Islamic',  hijri: '15 Safar 1447' },
  { date: 'Aug 26', title: 'Annual Sports Day',            type: 'Sports',   hijri: '31 Safar 1447' },
  { date: 'Sep 5',  title: "Teachers' Day Celebration",   type: 'Events',   hijri: '12 Rabi al-Awwal 1447' },
]

const CATEGORIES = ['All', 'Admissions', 'Academic', 'Events', 'Islamic']

function formatDate(str: string) {
  try {
    return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return str
  }
}

export default function NewsEvents() {
  const { isDark } = useTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [newsItems, setNewsItems] = useState<Array<NewsItem & { icon?: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await newsApi.list({ limit: 50 })
        if (res.data && res.data.length > 0) {
          setNewsItems(res.data)
          setUseFallback(false)
        } else {
          setNewsItems(FALLBACK_NEWS)
          setUseFallback(true)
        }
      } catch {
        setNewsItems(FALLBACK_NEWS)
        setUseFallback(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadNews()
  }, [])

  const filtered = newsItems.filter(n => {
    const cat = n.category ?? ''
    const matchCat = activeCategory === 'All' || cat === activeCategory
    const body = n.body ?? n.content ?? (n as { excerpt?: string }).excerpt ?? ''
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || body.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      <PageHero
        title="News & Events"
        subtitle="Stay updated with the latest happenings, announcements, and events at CIGMA."
        breadcrumbs={[{ label: 'News & Events' }]}
        seoTitle="News & Events — CIGMA"
        seoDescription="Latest news, announcements, and upcoming events from Creative International Girls Madrassa Academy, Kannur."
      />

      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* News Feed */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <SectionTitle label="Latest Updates" title="News & Announcements" />
              </AnimatedSection>

              {/* Search + Filter */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={cn(
                      'w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border transition-colors',
                      isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-white border-navy-100 text-navy-900 focus:border-maroon-500',
                      'outline-none'
                    )}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                        activeCategory === cat
                          ? 'bg-maroon-600 text-white'
                          : isDark ? 'bg-navy-800 text-gray-400 border border-white/10 hover:text-white' : 'bg-white text-navy-600 border border-navy-100'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-maroon-600" />
                </div>
              )}

              {/* News cards */}
              {!isLoading && (
                <div className="mt-6 space-y-5">
                  {useFallback && (
                    <p className={cn('text-xs px-3 py-2 rounded-lg border', isDark ? 'text-gray-500 border-white/5 bg-white/[0.02]' : 'text-navy-400 border-navy-100 bg-navy-50')}>
                      Showing example articles. Real news will appear here once added by admin.
                    </p>
                  )}
                  {filtered.map((item, i) => {
                    const icon = (item as { icon?: string }).icon ?? ICON_MAP[item.category] ?? '📰'
                    const excerpt = item.body ?? item.content ?? (item as { excerpt?: string }).excerpt ?? ''
                    const dateStr = formatDate(item.publishDate ?? item.publishedAt ?? '')
                    return (
                      <AnimatedSection key={item._id} delay={i * 0.08}>
                        <GlassCard hover className="p-5">
                          <div className="flex gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-maroon-500/20 to-maroon-700/20 flex items-center justify-center text-2xl">
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium',
                                  item.category === 'Islamic'    ? 'bg-emerald-500/10 text-emerald-500' :
                                  item.category === 'Academic'   ? 'bg-blue-500/10 text-blue-500' :
                                  item.category === 'Events'     ? 'bg-purple-500/10 text-purple-500' :
                                  'bg-maroon-600/10 text-maroon-600'
                                )}>
                                  <Tag className="inline w-3 h-3 mr-1" />{item.category}
                                </span>
                                <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-navy-400')}>
                                  <Calendar className="inline w-3 h-3 mr-1" />{dateStr}
                                </span>
                              </div>
                              <h3 className={cn('font-semibold text-sm mb-2 leading-snug', isDark ? 'text-white' : 'text-navy-900')}>
                                {item.title}
                              </h3>
                              <p className={cn('text-xs leading-relaxed line-clamp-2', isDark ? 'text-gray-400' : 'text-navy-600')}>
                                {excerpt}
                              </p>
                              <button className="mt-2 text-maroon-600 text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all">
                                Read more <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </GlassCard>
                      </AnimatedSection>
                    )
                  })}
                  {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-3">📰</div>
                      <p className={cn(isDark ? 'text-gray-400' : 'text-navy-600')}>No news found for your search.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Events Sidebar */}
            <div>
              <AnimatedSection direction="right">
                <SectionTitle label="Coming Up" title="Upcoming Events" />
                <div className="mt-6 space-y-4">
                  {events.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn('flex gap-4 p-4 rounded-xl border', isDark ? 'bg-navy-800/50 border-white/5' : 'bg-white border-navy-100')}
                    >
                      <div className="shrink-0 w-12 text-center">
                        <div className="bg-gradient-to-br from-maroon-500 to-maroon-700 rounded-lg px-2 py-1">
                          <p className="text-white text-xs font-bold leading-none">{event.date.split(' ')[0]}</p>
                          <p className="text-white/80 text-xs">{event.date.split(' ')[1]}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-navy-900')}>{event.title}</h4>
                        <p className="text-maroon-600 text-xs mt-0.5">{event.type}</p>
                        <p className={cn('text-xs mt-1 flex items-center gap-1', isDark ? 'text-gray-500' : 'text-navy-400')}>
                          🌙 {event.hijri}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
