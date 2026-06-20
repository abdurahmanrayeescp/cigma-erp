import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, FileText, Phone } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { inquiriesApi } from '@/lib/api'

const schema = z.object({
  studentName: z.string().min(2, 'Name must be at least 2 characters'),
  parentName: z.string().min(2, 'Parent name required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  grade: z.string().min(1, 'Please select a grade'),
  message: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const steps = [
  { icon: '📋', title: 'Submit Inquiry', desc: 'Fill out the online inquiry form or contact us directly.' },
  { icon: '📞', title: 'Get Called', desc: 'Our team will call you within 24 hours to discuss.' },
  { icon: '📄', title: 'Submit Documents', desc: 'Bring required documents to the school office.' },
  { icon: '✅', title: 'Confirmation', desc: 'Receive your admission confirmation and join CIGMA!' },
]

const eligibility = [
  { level: 'Prep-1', age: '3–4 years', gender: 'Boys & Girls' },
  { level: 'Prep-2', age: '4–5 years', gender: 'Boys & Girls' },
  { level: 'Primary (1–5)', age: '5–11 years', gender: 'Boys & Girls' },
  { level: 'Middle (6–8)', age: '11–14 years', gender: 'Boys & Girls' },
  { level: 'High School (9–10)', age: '14–16 years', gender: 'Girls Only' },
  { level: 'Higher Secondary (11–12)', age: '16–18 years', gender: 'Girls Only' },
]

const documents = [
  'Birth Certificate of student',
  'Previous school Transfer Certificate (TC)',
  'Last academic result / report card',
  'Aadhar card (student & parent)',
  '4 passport-size photographs',
  'Community/Caste certificate (if applicable)',
]

export default function Admissions() {
  const { isDark } = useTheme()
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await inquiriesApi.submit({
        name: data.studentName,
        parentName: data.parentName,
        phone: data.phone,
        email: data.email || undefined,
        grade: data.grade,
        message: data.message || '',
        type: 'admission',
      })
      setSubmitted(true)
      reset()
      toast.success('Inquiry submitted! We will contact you within 24 hours.')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.'
      toast.error(message)
    }
  }

  return (
    <>
      <PageHero
        title="Admissions"
        subtitle="Begin your child's journey towards academic excellence and Islamic values at CIGMA."
        breadcrumbs={[{ label: 'Admissions' }]}
        seoTitle="Admissions — CIGMA"
        seoDescription="Apply for admission to Creative International Girls Madrassa Academy. Open for Prep-1 to Higher Secondary. Boys till Grade 7, Girls till Plus Two. NIOS affiliated."
      />

      {/* Process Steps */}
      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-white')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="How to Apply" title="Admission Process" subtitle="A simple 4-step process to join the CIGMA family." centered />
          </AnimatedSection>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-maroon-600 to-maroon-400 hidden lg:block" />
            {steps.map((step, i) => (
              <AnimatedSection key={step.title} delay={i * 0.12}>
                <div className="text-center relative">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-maroon-500 to-maroon-700 flex items-center justify-center text-3xl shadow-lg shadow-maroon-500/30 mb-4 relative z-10">
                    {step.icon}
                  </div>
                  <div className="absolute top-8 left-1/2 w-6 h-6 bg-maroon-600 rounded-full flex items-center justify-center text-white text-xs font-bold -translate-x-1/2 -translate-y-1/2 z-20 border-2 border-white shadow">
                    {i + 1}
                  </div>
                  <h3 className={cn('font-semibold mb-2', isDark ? 'text-white' : 'text-navy-900')}>{step.title}</h3>
                  <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-navy-600')}>{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className={cn('section-padding', isDark ? 'bg-navy-900' : 'bg-gray-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Who Can Apply" title="Eligibility by Grade" centered />
          </AnimatedSection>
          <div className="mt-10 overflow-x-auto">
            <table className={cn('w-full rounded-xl overflow-hidden text-sm', isDark ? 'bg-navy-800' : 'bg-white')}>
              <thead>
                <tr className="bg-gradient-to-r from-maroon-600 to-maroon-700 text-white">
                  <th className="px-6 py-3 text-left font-semibold">Grade Level</th>
                  <th className="px-6 py-3 text-left font-semibold">Age Group</th>
                  <th className="px-6 py-3 text-left font-semibold">Eligible For</th>
                </tr>
              </thead>
              <tbody>
                {eligibility.map((row, i) => (
                  <tr key={row.level} className={cn('border-t', isDark ? 'border-white/5 hover:bg-white/5' : 'border-navy-50 hover:bg-navy-50', i % 2 === 0 ? '' : isDark ? 'bg-white/[0.02]' : 'bg-gray-50/50')}>
                    <td className={cn('px-6 py-3 font-medium', isDark ? 'text-white' : 'text-navy-900')}>{row.level}</td>
                    <td className={cn('px-6 py-3', isDark ? 'text-gray-300' : 'text-navy-700')}>{row.age}</td>
                    <td className="px-6 py-3">
                      <span className={cn('px-3 py-1 rounded-full text-xs font-medium',
                        row.gender === 'Girls Only' ? 'bg-pink-500/10 text-pink-500' : 'bg-blue-500/10 text-blue-500'
                      )}>
                        {row.gender}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Form + Documents */}
      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-white')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Inquiry Form */}
            <AnimatedSection direction="left">
              <SectionTitle label="Apply Now" title="Online Inquiry Form" />
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6">
                  <GlassCard className="p-10 text-center" gold>
                    <CheckCircle className="w-16 h-16 text-forest-500 mx-auto mb-4" />
                    <h3 className={cn('font-display text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-navy-900')}>Inquiry Submitted!</h3>
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-navy-600')}>Thank you for your interest in CIGMA. Our team will contact you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-maroon-600 text-sm font-medium hover:underline">Submit another inquiry</button>
                  </GlassCard>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  {[
                    { id: 'studentName', label: "Student's Full Name", placeholder: 'Enter student name', required: true },
                    { id: 'parentName', label: "Parent/Guardian Name", placeholder: 'Enter parent name', required: true },
                    { id: 'phone', label: 'Phone Number', placeholder: '+91 XXXXX XXXXX', required: true },
                    { id: 'email', label: 'Email Address (optional)', placeholder: 'your@email.com' },
                  ].map(field => (
                    <div key={field.id}>
                      <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>
                        {field.label}
                      </label>
                      <input
                        {...register(field.id as keyof FormData)}
                        placeholder={field.placeholder}
                        className={cn(
                          'w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors',
                          isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500',
                          errors[field.id as keyof FormData] && 'border-red-400'
                        )}
                      />
                      {errors[field.id as keyof FormData] && (
                        <p className="text-red-400 text-xs mt-1">{errors[field.id as keyof FormData]?.message}</p>
                      )}
                    </div>
                  ))}

                  <div>
                    <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>Grade Applying For</label>
                    <select
                      {...register('grade')}
                      className={cn(
                        'w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors',
                        isDark ? 'bg-navy-800 border-white/10 text-white focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500',
                        errors.grade && 'border-red-400'
                      )}
                    >
                      <option value="">Select grade level...</option>
                      {eligibility.map(e => <option key={e.level} value={e.level}>{e.level}</option>)}
                    </select>
                    {errors.grade && <p className="text-red-400 text-xs mt-1">{errors.grade.message}</p>}
                  </div>

                  <div>
                    <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>Additional Message (optional)</label>
                    <textarea
                      {...register('message')}
                      rows={3}
                      placeholder="Any questions or additional information..."
                      className={cn(
                        'w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors resize-none',
                        isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500'
                      )}
                    />
                  </div>

                  <Button type="submit" variant="maroon" size="lg" loading={isSubmitting} className="w-full">
                    Submit Inquiry <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </AnimatedSection>

            {/* Documents */}
            <AnimatedSection direction="right">
              <SectionTitle label="Be Prepared" title="Documents Required" />
              <div className="mt-6 space-y-3">
                {documents.map((doc, i) => (
                  <div key={i} className={cn('flex items-center gap-3 p-3 rounded-xl', isDark ? 'bg-navy-800/50' : 'bg-gray-50')}>
                    <div className="w-6 h-6 rounded-full bg-maroon-600/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-maroon-600" />
                    </div>
                    <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-navy-700')}>{doc}</span>
                  </div>
                ))}
              </div>

              <GlassCard className="p-6 mt-8" gold>
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-maroon-600" />
                  <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-navy-900')}>Prefer to call?</h3>
                </div>
                <p className={cn('text-sm mb-4', isDark ? 'text-gray-400' : 'text-navy-600')}>
                  Speak directly with our admissions team — we're available Monday to Saturday, 9 AM to 4 PM.
                </p>
                <div className="space-y-2">
                  <a href="tel:+919746770422" className="flex items-center gap-2 text-maroon-600 font-semibold hover:text-maroon-500 transition-colors">
                    📞 +91 97467 70422
                  </a>
                  <a href="tel:+919188110422" className="flex items-center gap-2 text-maroon-600 font-semibold hover:text-maroon-500 transition-colors">
                    📞 +91 91881 10422
                  </a>
                </div>
              </GlassCard>

              <div className={cn('mt-6 p-5 rounded-xl border flex items-center gap-4', isDark ? 'border-white/10 bg-navy-800/50' : 'border-navy-100 bg-navy-50')}>
                <FileText className="w-8 h-8 text-maroon-600 shrink-0" />
                <div>
                  <p className={cn('font-medium text-sm', isDark ? 'text-white' : 'text-navy-900')}>Download Application Form</p>
                  <p className={cn('text-xs mt-0.5', isDark ? 'text-gray-500' : 'text-navy-500')}>Fill offline and submit at the school office</p>
                  <button className="text-maroon-600 text-xs font-medium mt-2 hover:underline">Download PDF →</button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
