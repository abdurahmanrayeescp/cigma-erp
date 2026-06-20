import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const levels = [
  {
    icon: '🌱',
    level: 'Pre-Primary',
    grades: 'Prep-1 & Prep-2',
    for: 'Boys & Girls',
    desc: 'Foundation years that develop basic literacy, numeracy, and Islamic values through play-based learning.',
    subjects: ['English', 'Malayalam', 'Mathematics', 'EVS', 'Islamic Studies', 'Art & Craft'],
    color: 'from-emerald-500 to-forest-600',
  },
  {
    icon: '📚',
    level: 'Primary',
    grades: 'Grade 1–5',
    for: 'Boys & Girls',
    desc: 'Building strong academic foundations alongside the Al-Kayyisah Islamic Course.',
    subjects: ['English', 'Malayalam', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Islamic Studies'],
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: '🔬',
    level: 'Middle School',
    grades: 'Grade 6–8',
    for: 'Boys & Girls',
    desc: 'Deepening academic knowledge and Islamic understanding through structured learning.',
    subjects: ['English', 'Mathematics', 'Science', 'Social Science', 'Malayalam', 'Al-Kayyisah Course'],
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: '🎓',
    level: 'High School',
    grades: 'Grade 9–10',
    for: 'Girls Only',
    desc: 'NIOS board preparation with rigorous academics and continued Islamic education.',
    subjects: ['English', 'Mathematics', 'Science', 'Social Science', 'Home Science', 'Al-Kayyisah Course'],
    color: 'from-orange-500 to-rose-600',
  },
  {
    icon: '⭐',
    level: 'Higher Secondary',
    grades: 'Grade 11–12',
    for: 'Girls Only',
    desc: 'Advanced NIOS curriculum preparing students for higher education and professional pathways.',
    subjects: ['NIOS Elective Subjects', 'Al-Kayyisah Islamic Course', 'Career Guidance', 'Life Skills'],
    color: 'from-maroon-600 to-amber-600',
  },
]

const kayyisahTopics = [
  { icon: '📖', title: "Qur'an & Tajweed", desc: 'Proper recitation and memorization of the Holy Quran' },
  { icon: '📜', title: 'Hadith Studies', desc: "Authentic teachings from Prophet Muhammad's (SAW) Sunnah" },
  { icon: '🕌', title: 'Islamic Jurisprudence', desc: 'Fiqh — understanding Islamic law and rulings' },
  { icon: '🕰️', title: 'Islamic History', desc: 'Life of the Prophet, Companions, and Islamic civilization' },
  { icon: '💫', title: 'Aqeedah', desc: 'Islamic belief system and its foundations' },
  { icon: '🌺', title: 'Akhlaq', desc: 'Islamic character, ethics, and moral development' },
]

export default function Academics() {
  const { isDark } = useTheme()

  return (
    <>
      <PageHero
        title="Academics"
        subtitle="A comprehensive educational journey from early childhood to Higher Secondary, integrating modern academics with Islamic wisdom."
        breadcrumbs={[{ label: 'Academics' }]}
        seoTitle="Academics — CIGMA"
        seoDescription="CIGMA academic programs — Prep-1 to Higher Secondary. NIOS board affiliated. Boys till Grade 7, Girls till Plus Two. Al-Kayyisah Islamic Course integrated."
      />

      {/* Education Structure */}
      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Programs" title="Education at Every Level" subtitle="From foundational learning to advanced studies — CIGMA provides a complete educational pathway." centered />
          </AnimatedSection>

          <div className="mt-14 space-y-8">
            {levels.map((lvl, i) => (
              <AnimatedSection key={lvl.level} delay={i * 0.1}>
                <GlassCard className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left color bar */}
                    <div className={cn('bg-gradient-to-br p-8 flex flex-col items-center justify-center text-center lg:w-56 shrink-0', lvl.color)}>
                      <div className="text-5xl mb-3">{lvl.icon}</div>
                      <h3 className="text-white font-bold text-lg">{lvl.level}</h3>
                      <p className="text-white/80 text-sm">{lvl.grades}</p>
                      <span className={cn('mt-3 px-3 py-1 rounded-full text-xs font-medium',
                        lvl.for === 'Girls Only' ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
                      )}>
                        {lvl.for}
                      </span>
                    </div>

                    {/* Right content */}
                    <div className="p-8 flex-1">
                      <p className={cn('text-sm leading-relaxed mb-5', isDark ? 'text-gray-300' : 'text-navy-600')}>{lvl.desc}</p>
                      <div>
                        <p className={cn('text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-navy-500')}>Core Subjects</p>
                        <div className="flex flex-wrap gap-2">
                          {lvl.subjects.map(subj => (
                            <span key={subj} className={cn(
                              'px-3 py-1 rounded-full text-xs font-medium border',
                              isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-navy-50 border-navy-100 text-navy-700'
                            )}>
                              {subj}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Al-Kayyisah Section */}
      <section className={cn('section-padding relative overflow-hidden', 'bg-navy-900')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Islamic Education" title="The Al-Kayyisah Islamic Course" subtitle="A comprehensive Islamic curriculum running alongside every academic level at CIGMA." light centered />
          </AnimatedSection>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-5">
            {kayyisahTopics.map((topic, i) => (
              <AnimatedSection key={topic.title} delay={i * 0.1}>
                <div className="glass rounded-xl p-5 text-center border border-white/10 hover:border-maroon-600/30 transition-colors duration-300">
                  <div className="text-4xl mb-3">{topic.icon}</div>
                  <h3 className="text-white font-semibold text-sm mb-2">{topic.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{topic.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* NIOS Badge */}
          <AnimatedSection className="mt-12">
            <div className="glass-dark rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 border border-maroon-600/20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-maroon-500 to-maroon-700 flex items-center justify-center text-4xl shrink-0">📜</div>
              <div>
                <p className="text-maroon-500 text-sm font-semibold uppercase tracking-wider mb-1">Board of Affiliation</p>
                <h3 className="text-white font-display text-2xl font-bold mb-2">National Institute of Open Schooling (NIOS)</h3>
                <p className="text-white/70 text-sm">All academic certifications at CIGMA are recognized under NIOS — India's premier open schooling board — ensuring national-level qualification for our students.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
