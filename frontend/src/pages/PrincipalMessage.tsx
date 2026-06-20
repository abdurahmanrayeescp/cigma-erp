import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlassCard from '@/components/ui/GlassCard'
import IslamicPattern from '@/components/ui/IslamicPattern'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export default function PrincipalMessage() {
  const { isDark } = useTheme()

  return (
    <>
      <PageHero
        title="Principal's Message"
        subtitle="A word of guidance, inspiration, and commitment from our Principal."
        breadcrumbs={[{ label: "Principal's Message" }]}
        seoTitle="Principal's Message — CIGMA"
        seoDescription="Message from Mr. Rayees Hashim Nyzami, Principal of Creative International Girls Madrassa Academy, on academic excellence and Islamic values."
      />

      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-white')}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className={cn('relative rounded-3xl overflow-hidden', isDark ? 'bg-navy-800 border border-maroon-600/20' : 'bg-navy-50 border border-navy-100')}>
              <IslamicPattern className="opacity-5" />

              <div className="relative p-8 md:p-14">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-maroon-600/20">
                  <div className="shrink-0 relative">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-maroon-500 to-maroon-700 flex items-center justify-center text-7xl shadow-2xl shadow-maroon-500/30">
                      👨‍💼
                    </div>
                    <div className="absolute -inset-2 rounded-full border-2 border-maroon-600/30 animate-pulse-gold" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-maroon-500 text-sm font-semibold uppercase tracking-widest mb-2">Message from the</p>
                    <h1 className={cn('font-display text-3xl font-bold mb-1', isDark ? 'text-white' : 'text-navy-900')}>
                      Mr. Rayees Hashim Nyzami
                    </h1>
                    <p className={cn('text-base font-medium mb-3', isDark ? 'text-gray-400' : 'text-navy-600')}>
                      Principal — Creative International Girls Madrassa Academy
                    </p>
                    <div className="flex gap-1">
                      <div className="h-1 w-10 rounded-full bg-maroon-600" />
                      <div className="h-1 w-3 rounded-full bg-maroon-400" />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-6">
                  <p className="font-arabic text-2xl text-maroon-500 text-center mb-6">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </p>

                  {[
                    `Assalamu Alaikum wa Rahmatullahi wa Barakatuh,`,
                    `It is with immense gratitude to Allah (SWT) and deep pride that I welcome you to Creative International Girls Madrassa Academy (CIGMA). Since our establishment in June 2018, we have been steadfast in our commitment to nurturing young minds that are not only academically accomplished but also deeply rooted in Islamic faith and character.`,
                    `At CIGMA, we believe that true education is a harmony of the mind, heart, and soul. Our academic programs, aligned with the National Institute of Open Schooling (NIOS), provide students with the knowledge and skills they need to excel in the modern world. Simultaneously, our Al-Kayyisah Islamic Course ensures that students are grounded in the authentic teachings of the Qur'an and Sunnah — guiding them towards righteousness, integrity, and purpose.`,
                    `We welcome boys up to Grade 7 and girls all the way through Higher Secondary (Plus Two) — because we are committed to providing every student with a complete, quality education that prepares them for life's challenges with both wisdom and faith.`,
                    `To our students: you are the reason we are here. Approach every lesson with curiosity, every challenge with patience, and every day with gratitude to Allah. Strive not just for grades, but for character. Be not just knowledgeable, but wise. Be not just successful, but righteous.`,
                    `To our parents: your trust in us is a sacred responsibility we carry with honor. We pledge to be your partners in raising the next generation of compassionate, knowledgeable, and morally responsible leaders.`,
                    `May Allah bless our students, our teachers, our families, and our entire school community. May He guide us all on the path of knowledge, righteousness, and service to humanity.`,
                  ].map((para, i) => (
                    <p key={i} className={cn(
                      'leading-relaxed',
                      para.startsWith('Assalamu') ? 'font-semibold text-maroon-600' : isDark ? 'text-gray-300' : 'text-navy-700'
                    )}>
                      {para}
                    </p>
                  ))}

                  {/* Signature */}
                  <div className={cn('mt-10 pt-8 border-t border-maroon-600/20 flex flex-col sm:flex-row items-center justify-between gap-6')}>
                    <div>
                      <p className={cn('text-lg font-bold font-display', isDark ? 'text-white' : 'text-navy-900')}>
                        Rayees Hashim Nyzami
                      </p>
                      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-navy-600')}>
                        Principal, CIGMA — Thana, Kannur, Kerala
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-sm italic', isDark ? 'text-gray-500' : 'text-navy-500')}>"Live For Humanity"</p>
                      <p className="text-maroon-500 font-arabic text-xl mt-1">والله أعلم</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
