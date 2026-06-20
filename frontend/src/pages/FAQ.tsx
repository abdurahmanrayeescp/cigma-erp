import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import IslamicPattern from '@/components/ui/IslamicPattern'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    category: 'Admissions',
    items: [
      { q: 'What grades does CIGMA offer?', a: 'CIGMA offers education from Prep-1 through Higher Secondary (Grade 11–12). Boys are admitted up to Grade 7, and girls are admitted up to Higher Secondary (Plus Two).' },
      { q: 'When do admissions open?', a: 'Admissions typically open in March–April for the new academic year starting June. Please check our News & Events page or contact us for the latest schedule.' },
      { q: 'What documents are required for admission?', a: 'You will need the student\'s birth certificate, previous school records (Transfer Certificate if applicable), passport-size photographs, and Aadhar card of student and parent/guardian.' },
      { q: 'Is there an admission test?', a: 'Depending on the grade level, there may be a basic assessment or interaction. Please contact us for grade-specific admission requirements.' },
    ],
  },
  {
    category: 'Academics',
    items: [
      { q: 'Which board is CIGMA affiliated with?', a: 'CIGMA is affiliated with the National Institute of Open Schooling (NIOS) — one of India\'s most reputed open schooling systems, recognized nationwide.' },
      { q: 'What is the Al-Kayyisah Islamic Course?', a: 'The Al-Kayyisah Islamic Course is our comprehensive Islamic curriculum taught alongside regular academics. It covers Quranic studies, Tajweed, Hadith, Islamic history, and character development based on the Qur\'an and Sunnah.' },
      { q: 'Is Islamic education compulsory?', a: 'Yes, the Al-Kayyisah Islamic Course is an integral part of our curriculum. It runs alongside regular academic subjects and is designed to complement, not interfere with, academic learning.' },
      { q: 'What subjects are offered at the Higher Secondary level?', a: 'Higher Secondary programs follow NIOS curriculum. Please contact us or visit our Academics page for the current subject combination options available.' },
    ],
  },
  {
    category: 'Islamic Course',
    items: [
      { q: 'Do I need prior Islamic knowledge to join?', a: 'No prior knowledge is required. The Al-Kayyisah course is structured for all levels, starting from basic Islamic fundamentals.' },
      { q: 'Is there a certificate for the Islamic course?', a: 'Yes, students who complete the Al-Kayyisah Islamic Course receive a certificate from CIGMA upon successful completion.' },
    ],
  },
  {
    category: 'Fees',
    items: [
      { q: 'What are the school fees?', a: 'Fee structures vary by grade level. Please contact our office at +91 97467 70422 or email us at creativekidskannur@gmail.com for the current fee schedule.' },
      { q: 'Are there any scholarships or fee concessions?', a: 'CIGMA believes education should be accessible. We evaluate concession requests on a case-by-case basis. Please contact the office to discuss your situation.' },
    ],
  },
  {
    category: 'General',
    items: [
      { q: 'Where is CIGMA located?', a: 'CIGMA is located in Thana, Kannur, Kerala, India. You can reach us at +91 97467 70422 or +91 91881 10422.' },
      { q: 'What are the school hours?', a: 'Please contact our office for the current timetable and school hours, as schedules may vary by grade and academic calendar.' },
      { q: 'Is CIGMA a girls-only school?', a: 'CIGMA accepts both boys and girls. Boys are admitted from Prep-1 up to Grade 7, and girls are admitted all the way through Higher Secondary (Plus Two).' },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const { isDark } = useTheme()

  return (
    <div className={cn('rounded-xl border overflow-hidden transition-all duration-300', isDark ? 'border-white/10 bg-navy-800/50' : 'border-navy-100 bg-white')}>
      <button
        onClick={() => setOpen(!open)}
        className={cn('w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-200', isDark ? 'hover:bg-white/5' : 'hover:bg-navy-50')}
      >
        <span className={cn('font-medium text-sm pr-4', isDark ? 'text-white' : 'text-navy-900')}>{q}</span>
        <span className="shrink-0 text-maroon-600">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={cn('px-6 pb-5 pt-1 text-sm leading-relaxed border-t', isDark ? 'border-white/5 text-gray-400' : 'border-navy-100 text-navy-600')}>
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const { isDark } = useTheme()
  const [activeCategory, setActiveCategory] = useState('Admissions')

  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to the most common questions about CIGMA, admissions, academics, and more."
        breadcrumbs={[{ label: 'FAQ' }]}
        seoTitle="FAQ — CIGMA"
        seoDescription="Frequently asked questions about Creative International Girls Madrassa Academy — admissions, academics, Islamic course, fees, and more."
      />

      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Help Center" title="Got Questions? We Have Answers." centered />
          </AnimatedSection>

          {/* Category tabs */}
          <div className="mt-10 flex flex-wrap gap-2 justify-center">
            {faqs.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  activeCategory === cat.category
                    ? 'bg-maroon-600 text-white shadow-lg shadow-maroon-500/30'
                    : isDark ? 'bg-navy-800 text-gray-400 hover:text-white border border-white/10' : 'bg-white text-navy-600 hover:text-navy-900 border border-navy-100 hover:border-navy-300'
                )}
              >
                {cat.category}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            {faqs.find(c => c.category === activeCategory)?.items.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <FAQItem q={item.q} a={item.a} />
              </AnimatedSection>
            ))}
          </div>

          {/* Contact prompt */}
          <AnimatedSection className="mt-12">
            <GlassCard className="p-8 text-center" gold>
              <div className="text-4xl mb-3">💬</div>
              <h3 className={cn('font-display text-xl font-bold mb-2', isDark ? 'text-white' : 'text-navy-900')}>
                Still have questions?
              </h3>
              <p className={cn('text-sm mb-5', isDark ? 'text-gray-400' : 'text-navy-600')}>
                We're happy to help. Reach out to us directly and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:+919746770422" className="px-6 py-2.5 rounded-xl bg-maroon-600 text-white text-sm font-semibold hover:bg-maroon-700 transition-colors">
                  📞 Call Us
                </a>
                <a href="mailto:creativekidskannur@gmail.com" className={cn('px-6 py-2.5 rounded-xl text-sm font-semibold border transition-colors', isDark ? 'border-white/20 text-gray-300 hover:bg-white/5' : 'border-navy-200 text-navy-700 hover:bg-navy-50')}>
                  ✉️ Email Us
                </a>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
