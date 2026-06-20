import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import IslamicPattern from '@/components/ui/IslamicPattern'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const timeline = [
  { year: '2018', title: 'Foundation', desc: 'Creative International Girls Madrassa Academy was established in Thana, Kannur, Kerala, with a vision of integrating quality education with authentic Islamic values.' },
  { year: '2019', title: 'NIOS Affiliation', desc: 'Received affiliation with the National Institute of Open Schooling (NIOS), enabling students to pursue recognized board examinations.' },
  { year: '2020', title: 'Al-Kayyisah Launch', desc: 'Introduced the Al-Kayyisah Islamic Course as a core curriculum component, integrating Islamic studies alongside regular academics.' },
  { year: '2022', title: 'Expansion', desc: 'Extended the school\'s capacity with new classrooms, a library, and dedicated facilities for both academic and Islamic learning.' },
  { year: '2024', title: 'Higher Secondary', desc: 'Launched Higher Secondary (Grade 11–12) program for girls, completing the full educational journey from Prep to Plus Two.' },
  { year: '2025', title: 'Today', desc: 'CIGMA continues to grow as a leading Islamic educational institution in Kerala, nurturing hundreds of students across all levels.' },
]

const missionPoints = [
  'Providing quality academic education aligned with NIOS standards',
  'Offering comprehensive Islamic learning through the Al-Kayyisah Course',
  'Developing moral character rooted in Qur\'an and Sunnah',
  'Fostering discipline, leadership, and self-confidence',
  'Building a safe, inspiring, and inclusive learning environment',
  'Empowering students to contribute positively to society',
]

export default function About() {
  const { isDark } = useTheme()

  return (
    <>
      <PageHero
        title="About CIGMA"
        subtitle="A story of faith, knowledge, and a commitment to shaping the future generation."
        breadcrumbs={[{ label: 'About Us' }]}
        seoTitle="About CIGMA — Creative International Girls Madrassa Academy"
        seoDescription="Learn about CIGMA's history, vision, mission, and values. Established June 2018 in Thana, Kannur, Kerala. NIOS board affiliated school with Al-Kayyisah Islamic Course."
      />

      {/* History Timeline */}
      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-white')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Our History" title="The CIGMA Journey" centered />
          </AnimatedSection>
          <div className="mt-14 relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-maroon-600 via-navy-400 to-transparent hidden md:block" />
            <div className="space-y-8 md:space-y-12">
              {timeline.map((item, i) => (
                <AnimatedSection key={item.year} delay={i * 0.1}>
                  <div className={cn('flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center', i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')}>
                    <div className="flex-1 md:text-right md:odd:text-right md:even:text-left">
                      {i % 2 === 0 ? (
                        <GlassCard className="p-6">
                          <p className="text-maroon-600 font-bold text-lg mb-1">{item.year}</p>
                          <h3 className={cn('font-display text-xl font-bold mb-2', isDark ? 'text-white' : 'text-navy-900')}>{item.title}</h3>
                          <p className={cn('text-sm leading-relaxed', isDark ? 'text-gray-400' : 'text-navy-600')}>{item.desc}</p>
                        </GlassCard>
                      ) : <div />}
                    </div>
                    {/* Center dot */}
                    <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-maroon-500 to-maroon-700 items-center justify-center text-white font-bold text-sm shadow-lg shadow-maroon-500/30 z-10">
                      {item.year.slice(-2)}
                    </div>
                    <div className="flex-1">
                      {i % 2 !== 0 ? (
                        <GlassCard className="p-6">
                          <p className="text-maroon-600 font-bold text-lg mb-1">{item.year}</p>
                          <h3 className={cn('font-display text-xl font-bold mb-2', isDark ? 'text-white' : 'text-navy-900')}>{item.title}</h3>
                          <p className={cn('text-sm leading-relaxed', isDark ? 'text-gray-400' : 'text-navy-600')}>{item.desc}</p>
                        </GlassCard>
                      ) : <div />}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className={cn('section-padding relative overflow-hidden', isDark ? 'bg-navy-900' : 'bg-navy-50')}>
        <IslamicPattern className="opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <GlassCard className="p-8 h-full" gold>
                <div className="text-5xl mb-4">🔭</div>
                <SectionTitle label="Our Vision" title="Where We're Headed" />
                <p className={cn('mt-4 text-sm leading-relaxed', isDark ? 'text-gray-300' : 'text-navy-700')}>
                  To become a leading Islamic educational institution that nurtures knowledgeable, righteous, and confident individuals — by integrating academic excellence with authentic Islamic teachings — preparing students to contribute positively to society and be a mercy to humanity.
                </p>
              </GlassCard>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <GlassCard className="p-8 h-full" gold>
                <div className="text-5xl mb-4">🎯</div>
                <SectionTitle label="Our Mission" title="How We Get There" />
                <ul className="mt-4 space-y-3">
                  {missionPoints.map(point => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-maroon-600 mt-0.5 shrink-0" />
                      <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-navy-700')}>{point}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Board Affiliation */}
      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-white')}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className={cn('rounded-2xl p-10 border', isDark ? 'bg-navy-800 border-maroon-600/20' : 'bg-navy-50 border-navy-100')}>
              <div className="text-6xl mb-4">📜</div>
              <p className="text-maroon-600 font-semibold text-sm uppercase tracking-wider mb-2">Board of Affiliation</p>
              <h2 className={cn('font-display text-3xl font-bold mb-3', isDark ? 'text-white' : 'text-navy-900')}>
                National Institute of Open Schooling
              </h2>
              <p className={cn('text-lg font-medium mb-4 text-maroon-500')}>NIOS</p>
              <p className={cn('text-sm max-w-xl mx-auto', isDark ? 'text-gray-400' : 'text-navy-600')}>
                CIGMA is affiliated with NIOS — India's largest open schooling system — ensuring our students receive nationally recognized qualifications while pursuing their academic and Islamic education goals.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className={cn('py-12 border-t', isDark ? 'border-white/5' : 'border-gray-100')}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h3 className={cn('font-display text-2xl font-bold mb-4', isDark ? 'text-white' : 'text-navy-900')}>
              Ready to join the CIGMA family?
            </h3>
            <Link to="/admissions">
              <Button variant="maroon" size="lg">Apply for Admission <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
