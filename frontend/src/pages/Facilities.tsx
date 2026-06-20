import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const facilities = [
  { icon: '🏫', title: 'Modern Classrooms', desc: 'Well-ventilated, spacious classrooms equipped with modern teaching aids and comfortable seating designed for optimal learning.', color: 'from-blue-400 to-indigo-500' },
  { icon: '📚', title: 'Library', desc: 'A well-stocked library with academic textbooks, reference books, Islamic literature, and reading materials for all age groups.', color: 'from-emerald-400 to-forest-500' },
  { icon: '💻', title: 'Computer Lab', desc: 'A dedicated computer laboratory enabling digital literacy and technology education as part of modern academic preparation.', color: 'from-violet-400 to-purple-500' },
  { icon: '🕌', title: 'Prayer Hall (Musalla)', desc: 'A dedicated prayer space for daily Salah, ensuring students practice their faith as part of their school routine.', color: 'from-maroon-500 to-amber-500' },
  { icon: '🏃', title: 'Sports Grounds', desc: 'Outdoor activity space for physical education, sports events, and recreational activities promoting health and teamwork.', color: 'from-orange-400 to-red-500' },
  { icon: '🔬', title: 'Science Lab', desc: 'Equipped laboratory facilities supporting practical science education with hands-on experiments for middle and high school students.', color: 'from-cyan-400 to-blue-500' },
  { icon: '🎨', title: 'Art Room', desc: 'A creative space for art, craft, and cultural activities, nurturing students\' creativity and artistic expression.', color: 'from-pink-400 to-rose-500' },
  { icon: '🚌', title: 'Safe Campus', desc: 'A secure, monitored campus environment with controlled access ensuring the safety and well-being of all students.', color: 'from-forest-400 to-green-500' },
]

export default function Facilities() {
  const { isDark } = useTheme()

  return (
    <>
      <PageHero
        title="Facilities"
        subtitle="State-of-the-art infrastructure designed to support academic excellence and Islamic learning."
        breadcrumbs={[{ label: 'Facilities' }]}
        seoTitle="Facilities — CIGMA"
        seoDescription="Explore the facilities at CIGMA — modern classrooms, library, computer lab, prayer hall, science lab, sports grounds, and more."
      />

      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Our Infrastructure" title="World-Class Facilities" subtitle="Every facility at CIGMA is designed to support both academic and spiritual growth." centered />
          </AnimatedSection>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, i) => (
              <AnimatedSection key={fac.title} delay={i * 0.08}>
                <GlassCard hover className="p-6 text-center group h-full flex flex-col">
                  <div className={cn('w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300', fac.color)}>
                    {fac.icon}
                  </div>
                  <h3 className={cn('font-semibold mb-3', isDark ? 'text-white' : 'text-navy-900')}>{fac.title}</h3>
                  <p className={cn('text-sm leading-relaxed flex-1', isDark ? 'text-gray-400' : 'text-navy-600')}>{fac.desc}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>

          {/* Campus callout */}
          <AnimatedSection className="mt-16">
            <div className="rounded-2xl bg-gradient-to-r from-navy-900 to-navy-800 p-10 text-center border border-maroon-600/20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px'}} />
              </div>
              <div className="relative">
                <div className="text-5xl mb-4">🏫</div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">Visit Our Campus</h3>
                <p className="text-white/70 text-sm max-w-xl mx-auto mb-6">
                  We welcome parents and prospective students to visit CIGMA and experience our learning environment firsthand. Please contact us to schedule a campus tour.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="tel:+919746770422" className="px-6 py-3 rounded-xl bg-maroon-600 text-white text-sm font-semibold hover:bg-maroon-700 transition-colors">
                    📞 Schedule a Visit
                  </a>
                  <a href="https://maps.google.com/?q=Thana,Kannur,Kerala" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                    📍 Get Directions
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
