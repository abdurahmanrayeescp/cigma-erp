import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { X, ZoomIn, Loader2 } from 'lucide-react'
import { galleryApi, type GalleryItem } from '@/lib/api'

const CATEGORIES = [
  'All', 'Annual Day', 'Graduation Ceremony', 'Sports Day', 'Classroom Activities',
  'Islamic Programs', 'Eid Celebrations', 'Quran Competitions', 'Seminars & Workshops',
  'Study Tours', 'Cultural Programs',
]

// ─── Static fallback items (placeholders until real photos are uploaded) ─
const PLACEHOLDER_COLORS = [
  'from-rose-400 to-pink-600', 'from-emerald-400 to-teal-600', 'from-blue-400 to-indigo-600',
  'from-violet-400 to-purple-600', 'from-orange-400 to-red-500', 'from-maroon-500 to-amber-600',
  'from-cyan-400 to-blue-500', 'from-fuchsia-400 to-pink-500', 'from-lime-400 to-green-600',
  'from-amber-400 to-orange-500', 'from-rose-500 to-red-600', 'from-sky-400 to-cyan-500',
]

const FALLBACK_ITEMS: Array<GalleryItem & { color: string }> = [
  { _id: 'g1',  title: 'Annual Day 2024 Ceremony',          imageUrl: '', category: 'Annual Day',            color: PLACEHOLDER_COLORS[0] },
  { _id: 'g2',  title: "Qur'an Recitation Competition",     imageUrl: '', category: 'Quran Competitions',    color: PLACEHOLDER_COLORS[1] },
  { _id: 'g3',  title: 'Science Lab Activities',            imageUrl: '', category: 'Classroom Activities',  color: PLACEHOLDER_COLORS[2] },
  { _id: 'g4',  title: 'Mawlid Celebration',               imageUrl: '', category: 'Islamic Programs',      color: PLACEHOLDER_COLORS[3] },
  { _id: 'g5',  title: 'Annual Sports Day 2024',            imageUrl: '', category: 'Sports Day',            color: PLACEHOLDER_COLORS[4] },
  { _id: 'g6',  title: 'Eid al-Fitr Celebrations',         imageUrl: '', category: 'Eid Celebrations',      color: PLACEHOLDER_COLORS[5] },
  { _id: 'g7',  title: 'Graduation Ceremony 2024',          imageUrl: '', category: 'Graduation Ceremony',   color: PLACEHOLDER_COLORS[6] },
  { _id: 'g8',  title: 'Teacher Development Workshop',      imageUrl: '', category: 'Seminars & Workshops',  color: PLACEHOLDER_COLORS[7] },
  { _id: 'g9',  title: 'Educational Study Tour',            imageUrl: '', category: 'Study Tours',           color: PLACEHOLDER_COLORS[8] },
  { _id: 'g10', title: 'Cultural Heritage Program',         imageUrl: '', category: 'Cultural Programs',     color: PLACEHOLDER_COLORS[9] },
  { _id: 'g11', title: 'Prize Distribution Ceremony',       imageUrl: '', category: 'Annual Day',            color: PLACEHOLDER_COLORS[10] },
  { _id: 'g12', title: 'Art & Craft Exhibition',           imageUrl: '', category: 'Classroom Activities',  color: PLACEHOLDER_COLORS[11] },
]

type DisplayItem = GalleryItem & { color?: string }

export default function Gallery() {
  const { isDark } = useTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<DisplayItem | null>(null)
  const [items, setItems] = useState<DisplayItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await galleryApi.list({ limit: 100 })
        if (res.data && res.data.length > 0) {
          setItems(res.data.map((item, i) => ({ ...item, color: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length] })))
          setUseFallback(false)
        } else {
          setItems(FALLBACK_ITEMS)
          setUseFallback(true)
        }
      } catch {
        setItems(FALLBACK_ITEMS)
        setUseFallback(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadGallery()
  }, [])

  const filtered = activeCategory === 'All' ? items : items.filter(g => g.category === activeCategory)

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Moments of learning, celebration, and community from the CIGMA campus."
        breadcrumbs={[{ label: 'Gallery' }]}
        seoTitle="Gallery — CIGMA"
        seoDescription="Photo gallery of CIGMA events — Annual Day, Quran Competitions, Sports Day, Islamic Programs, Eid Celebrations, Graduation Ceremonies, and more."
      />

      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Our Moments" title="Life at CIGMA" centered />
          </AnimatedSection>

          {/* Category filter */}
          <div className="mt-10 flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                  activeCategory === cat
                    ? 'bg-maroon-600 text-white shadow-md shadow-maroon-500/30'
                    : isDark ? 'bg-navy-800 text-gray-400 border border-white/10 hover:text-white' : 'bg-white text-navy-600 border border-navy-100 hover:border-navy-300'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-maroon-600" />
            </div>
          ) : (
            <>
              {useFallback && (
                <p className={cn('mt-6 text-xs text-center', isDark ? 'text-gray-600' : 'text-navy-400')}>
                  Showing placeholder gallery. Real photos will appear here once uploaded by admin.
                </p>
              )}

              {/* Masonry grid */}
              <motion.div layout className="mt-10 columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                <AnimatePresence>
                  {filtered.map((item, i) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="break-inside-avoid mb-4 cursor-pointer group"
                      onClick={() => setLightbox(item)}
                    >
                      <div className={cn(
                        'relative rounded-xl overflow-hidden',
                        i % 3 === 0 ? 'aspect-square' : i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-video'
                      )}>
                      {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title ?? item.caption ?? item.description ?? 'Gallery photo'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : item.url ? (
                          <img
                            src={item.url}
                            alt={item.caption ?? item.title ?? item.description ?? 'Gallery photo'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className={cn('absolute inset-0 bg-gradient-to-br flex flex-col items-center justify-center p-4', item.color)}>
                            <div className="text-5xl mb-2 opacity-50">🖼️</div>
                            <p className="text-white/70 text-xs text-center">{item.title ?? item.description}</p>
                          </div>
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/60 transition-all duration-300 flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white text-xs font-medium">{item.title ?? item.description}</p>
                          <span className="text-maroon-400 text-xs">{item.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">📷</div>
                  <p className={cn('text-lg', isDark ? 'text-gray-400' : 'text-navy-600')}>No photos in this category yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-3xl w-full rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {lightbox.imageUrl ? (
                <img src={lightbox.imageUrl} alt={lightbox.title ?? ''} className="w-full max-h-[80vh] object-contain rounded-2xl" />
              ) : (
                <div className={cn('aspect-video rounded-2xl bg-gradient-to-br flex items-center justify-center', lightbox.color)}>
                  <div className="text-center">
                    <div className="text-8xl mb-4 opacity-40">🖼️</div>
                    <p className="text-white font-semibold text-lg">{lightbox.title ?? lightbox.description}</p>
                    <span className="text-white/60 text-sm">{lightbox.category}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
