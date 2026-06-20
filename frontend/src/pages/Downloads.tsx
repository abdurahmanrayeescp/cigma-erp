import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, BookOpen, Loader2 } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { downloadsApi, type DownloadItem } from '@/lib/api'

// ─── Static fallback data ──────────────────────────────────────────────
const FALLBACK_DOWNLOADS: Array<DownloadItem & { size?: string; type?: string }> = [
  { _id: 'f1',  title: 'Admission Application Form 2025–26',              fileUrl: '#', category: 'Admissions',          createdAt: '2025-06-01', fileSize: '245 KB' },
  { _id: 'f2',  title: 'Admission Guidelines & Procedure',                fileUrl: '#', category: 'Admissions',          createdAt: '2025-06-01', fileSize: '180 KB' },
  { _id: 'f3',  title: 'Academic Calendar 2025–26',                       fileUrl: '#', category: 'Academic Calendar',   createdAt: '2025-06-01', fileSize: '310 KB' },
  { _id: 'f4',  title: 'Exam Schedule — Term 1, 2025',                    fileUrl: '#', category: 'Academic Calendar',   createdAt: '2025-06-01', fileSize: '150 KB' },
  { _id: 'f5',  title: 'Holiday List 2025–26 (General)',                  fileUrl: '#', category: 'Holiday List',        createdAt: '2025-06-01', fileSize: '120 KB' },
  { _id: 'f6',  title: 'Islamic Holiday Calendar 1447 AH',                fileUrl: '#', category: 'Holiday List',        createdAt: '2025-06-01', fileSize: '130 KB' },
  { _id: 'f7',  title: 'Parent-Teacher Meeting Notice — Jul 2025',        fileUrl: '#', category: 'Circulars & Notices', createdAt: '2025-06-01', fileSize: '95 KB' },
  { _id: 'f8',  title: 'Fee Payment Circular 2025–26',                    fileUrl: '#', category: 'Circulars & Notices', createdAt: '2025-06-01', fileSize: '110 KB' },
  { _id: 'f9',  title: 'Class Timetable — Primary (Grade 1–5)',           fileUrl: '#', category: 'Timetable',           createdAt: '2025-06-01', fileSize: '200 KB' },
  { _id: 'f10', title: 'Class Timetable — Middle School (Grade 6–8)',     fileUrl: '#', category: 'Timetable',           createdAt: '2025-06-01', fileSize: '210 KB' },
  { _id: 'f11', title: 'Annual Syllabus — Grade 9 & 10 (NIOS)',           fileUrl: '#', category: 'Syllabus',            createdAt: '2025-06-01', fileSize: '520 KB' },
  { _id: 'f12', title: 'Al-Kayyisah Course Syllabus Overview',            fileUrl: '#', category: 'Syllabus',            createdAt: '2025-06-01', fileSize: '280 KB' },
]

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  'Admissions':          { icon: '📋', color: 'from-maroon-500 to-amber-500' },
  'Academic Calendar':   { icon: '📅', color: 'from-blue-400 to-indigo-500' },
  'Holiday List':        { icon: '🌙', color: 'from-emerald-400 to-teal-500' },
  'Circulars & Notices': { icon: '📢', color: 'from-orange-400 to-red-500' },
  'Timetable':           { icon: '🕐', color: 'from-violet-400 to-purple-500' },
  'Syllabus':            { icon: '📖', color: 'from-cyan-400 to-blue-500' },
  'General':             { icon: '📄', color: 'from-gray-400 to-gray-600' },
}

function groupByCategory(items: DownloadItem[]) {
  return items.reduce<Record<string, DownloadItem[]>>((acc, item) => {
    const cat = item.category ?? 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})
}

function formatDate(str: string) {
  try {
    return new Date(str).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
  } catch {
    return str
  }
}

export default function Downloads() {
  const { isDark } = useTheme()
  const [groupedDownloads, setGroupedDownloads] = useState<Record<string, DownloadItem[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    async function loadDownloads() {
      try {
        const res = await downloadsApi.list()
        if (res.data && res.data.length > 0) {
          setGroupedDownloads(groupByCategory(res.data))
          setUseFallback(false)
        } else {
          setGroupedDownloads(groupByCategory(FALLBACK_DOWNLOADS))
          setUseFallback(true)
        }
      } catch {
        setGroupedDownloads(groupByCategory(FALLBACK_DOWNLOADS))
        setUseFallback(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadDownloads()
  }, [])

  const categories = Object.keys(groupedDownloads)

  return (
    <>
      <PageHero
        title="Downloads"
        subtitle="Access important documents, forms, calendars, and notices from CIGMA."
        breadcrumbs={[{ label: 'Downloads' }]}
        seoTitle="Downloads — CIGMA"
        seoDescription="Download forms, academic calendar, holiday list, circulars, timetable, and syllabus from Creative International Girls Madrassa Academy."
      />

      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Documents" title="Download Center" subtitle="All school documents available for download in PDF format." centered />
          </AnimatedSection>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-maroon-600" />
            </div>
          ) : (
            <>
              {useFallback && (
                <p className={cn('mt-6 text-xs text-center px-3 py-2 rounded-lg border max-w-lg mx-auto', isDark ? 'text-gray-500 border-white/5 bg-white/[0.02]' : 'text-navy-400 border-navy-100 bg-navy-50')}>
                  Showing sample documents. Real files will appear here once uploaded by admin.
                </p>
              )}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categories.map((cat, i) => {
                  const meta = CATEGORY_META[cat] ?? CATEGORY_META['General']
                  const files = groupedDownloads[cat] ?? []
                  return (
                    <AnimatedSection key={cat} delay={i * 0.08}>
                      <GlassCard className="p-6 h-full">
                        {/* Category header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl', meta.color)}>
                            {meta.icon}
                          </div>
                          <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-navy-900')}>{cat}</h3>
                        </div>

                        {/* Files */}
                        <div className="space-y-3">
                          {files.map(file => (
                            <a
                              key={file._id}
                              href={file.fileUrl !== '#' ? file.fileUrl : undefined}
                              target={file.fileUrl !== '#' ? '_blank' : undefined}
                              rel="noopener noreferrer"
                              className={cn(
                                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer',
                                isDark ? 'hover:bg-white/5 bg-white/[0.02]' : 'hover:bg-navy-50 bg-gray-50/50',
                                file.fileUrl === '#' && 'opacity-60 cursor-not-allowed'
                              )}
                              onClick={e => file.fileUrl === '#' && e.preventDefault()}
                            >
                              <div className="shrink-0">
                                <FileText className="w-8 h-8 text-maroon-600" />
                                <span className={cn('block text-center text-xs font-bold mt-0.5', 'text-maroon-600')}>PDF</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn('text-xs font-medium leading-snug truncate', isDark ? 'text-gray-200' : 'text-navy-800')}>{file.title}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  {file.fileSize && (
                                    <span className={cn('text-xs', isDark ? 'text-gray-500' : 'text-navy-400')}>{file.fileSize}</span>
                                  )}
                                  {file.fileSize && <span className="w-1 h-1 rounded-full bg-gray-400" />}
                                  <span className={cn('text-xs flex items-center gap-1', isDark ? 'text-gray-500' : 'text-navy-400')}>
                                    <Calendar className="w-3 h-3" />{formatDate(file.createdAt)}
                                  </span>
                                </div>
                              </div>
                              {file.fileUrl !== '#' && (
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-maroon-600/10 flex items-center justify-center text-maroon-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-maroon-600 hover:text-white">
                                  <Download className="w-4 h-4" />
                                </div>
                              )}
                            </a>
                          ))}
                        </div>
                      </GlassCard>
                    </AnimatedSection>
                  )
                })}
              </div>
            </>
          )}

          {/* Info note */}
          <AnimatedSection className="mt-10">
            <div className={cn('rounded-xl p-5 flex items-start gap-3', isDark ? 'bg-navy-800/50 border border-white/5' : 'bg-blue-50 border border-blue-100')}>
              <BookOpen className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-blue-700')}>
                Documents are updated regularly. For the latest circulars or documents not listed here, please contact the school office at <a href="tel:+919746770422" className="font-semibold text-maroon-600">+91 97467 70422</a> or email <a href="mailto:creativekidskannur@gmail.com" className="font-semibold text-maroon-600">creativekidskannur@gmail.com</a>.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
