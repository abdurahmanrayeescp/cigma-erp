import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlassCard from '@/components/ui/GlassCard'
import IslamicPattern from '@/components/ui/IslamicPattern'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const management = [
  {
    role: 'Founder & Principal',
    name: 'Mr. Rayees Hashim Nyzami',
    emoji: '👨‍💼',
    message: [
      `In the name of Allah, the Most Gracious, the Most Merciful.`,
      `When I founded Creative International Girls Madrassa Academy in 2018, I had one vision: to create a place where the next generation could grow — not merely as scholars or professionals, but as complete human beings, anchored in faith, driven by knowledge, and devoted to serving humanity.`,
      `The world needs leaders who are not just skilled, but righteous. It needs individuals who carry their knowledge with humility and their success with gratitude. That is precisely what CIGMA was built to produce.`,
      `We integrate world-class academics with authentic Islamic education through our Al-Kayyisah Course — because we believe that no education is complete without both Deen and Dunya. Boys are welcomed until Grade 7, and girls are guided through their entire journey up to Higher Secondary — because every student deserves the opportunity to reach their full potential.`,
      `To every student who walks through our doors: you carry the hopes of your family and the trust of Allah. Learn, grow, serve, and never forget — your education is not just for you, but for the humanity you will one day serve.`,
      `May Allah accept our efforts and make CIGMA a source of light, knowledge, and goodness for generations to come.`,
    ],
  },
]

export default function ManagementMessage() {
  const { isDark } = useTheme()

  return (
    <>
      <PageHero
        title="Management Message"
        subtitle="Guidance and vision from the founder and management of CIGMA."
        breadcrumbs={[{ label: 'Management Message' }]}
        seoTitle="Management Message — CIGMA"
        seoDescription="Message from the Founder and Management of Creative International Girls Madrassa Academy. Mr. Rayees Hashim Nyzami shares the vision of building future leaders through faith and knowledge."
      />

      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-white')}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {management.map((person, i) => (
            <AnimatedSection key={person.name} delay={i * 0.1}>
              <div className={cn('relative rounded-3xl overflow-hidden', isDark ? 'bg-navy-800 border border-maroon-600/20' : 'bg-navy-50 border border-navy-100')}>
                <IslamicPattern className="opacity-5" />
                <div className="relative p-8 md:p-14">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-maroon-600/20">
                    <div className="shrink-0 relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-maroon-500 to-maroon-700 flex items-center justify-center text-6xl shadow-2xl shadow-maroon-500/30">
                        {person.emoji}
                      </div>
                      <div className="absolute -inset-2 rounded-full border-2 border-maroon-600/30 animate-pulse-gold" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-maroon-500 text-xs font-semibold uppercase tracking-widest mb-2">{person.role}</p>
                      <h2 className={cn('font-display text-2xl font-bold mb-1', isDark ? 'text-white' : 'text-navy-900')}>{person.name}</h2>
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-navy-600')}>Creative International Girls Madrassa Academy</p>
                      <div className="flex gap-1 mt-3">
                        <div className="h-1 w-10 rounded-full bg-maroon-600" />
                        <div className="h-1 w-3 rounded-full bg-maroon-400" />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-5">
                    <p className="font-arabic text-2xl text-maroon-500 text-center mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                    {person.message.map((para, j) => (
                      <p key={j} className={cn(
                        'leading-relaxed',
                        para.startsWith('In the name') ? 'font-semibold text-maroon-600' : isDark ? 'text-gray-300' : 'text-navy-700'
                      )}>
                        {para}
                      </p>
                    ))}

                    <div className={cn('mt-10 pt-8 border-t border-maroon-600/20 flex justify-between items-center')}>
                      <div>
                        <p className={cn('text-lg font-bold font-display', isDark ? 'text-white' : 'text-navy-900')}>{person.name}</p>
                        <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-navy-600')}>{person.role}, CIGMA</p>
                      </div>
                      <p className="font-arabic text-xl text-maroon-500">جزاكم الله خيراً</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </>
  )
}
