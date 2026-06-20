import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Briefcase, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { applicationsApi } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  position: z.string().min(1, 'Please select a position'),
  qualification: z.string().min(2, 'Qualification required'),
  experience: z.string().min(1, 'Experience required'),
  coverLetter: z.string().min(20, 'Please write a brief cover note (min 20 characters)'),
})
type FormData = z.infer<typeof schema>

const positions = [
  { type: 'Teaching', roles: ['Islamic Studies Teacher', 'English Teacher', 'Mathematics Teacher', 'Science Teacher', 'Social Studies Teacher', 'Malayalam Teacher', 'Hindi Teacher', 'Computer Teacher', 'Art & Craft Teacher', 'Physical Education Teacher'] },
  { type: 'Non-Teaching', roles: ['Administrative Officer', 'Office Assistant', 'Librarian', 'Lab Technician', 'Security Staff', 'Peon / Support Staff'] },
]

export default function Career() {
  const { isDark } = useTheme()
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await applicationsApi.submit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        qualification: data.qualification,
        experience: data.experience,
        coverLetter: data.coverLetter,
      })
      setSubmitted(true)
      reset()
      toast.success('Application submitted! We will review your application and contact you.')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit application. Please try again.'
      toast.error(message)
    }
  }

  return (
    <>
      <PageHero
        title="Career"
        subtitle="Join the CIGMA family and be part of a mission to shape the next generation of knowledgeable, righteous leaders."
        breadcrumbs={[{ label: 'Career' }]}
        seoTitle="Career — CIGMA"
        seoDescription="Career opportunities at Creative International Girls Madrassa Academy. Teaching and non-teaching positions available in Kannur, Kerala."
      />

      {/* Open Positions */}
      <section className={cn('section-padding', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Join Our Team" title="Open Positions" subtitle="We are looking for passionate, qualified educators and staff who share our vision for excellence in Islamic education." centered />
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {positions.map((dept, i) => (
              <AnimatedSection key={dept.type} delay={i * 0.1}>
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-500 to-maroon-700 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={cn('font-bold', isDark ? 'text-white' : 'text-navy-900')}>{dept.type} Positions</h3>
                      <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-navy-500')}>{dept.roles.length} roles available</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {dept.roles.map(role => (
                      <div key={role} className={cn('flex items-center gap-2 py-2 px-3 rounded-lg', isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-navy-50', 'transition-colors')}>
                        <div className="w-1.5 h-1.5 rounded-full bg-maroon-600" />
                        <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-navy-700')}>{role}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className={cn('section-padding', isDark ? 'bg-navy-900' : 'bg-white')}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle label="Apply Now" title="Submit Your Application" centered />
          </AnimatedSection>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8">
              <GlassCard className="p-12 text-center" gold>
                <CheckCircle className="w-16 h-16 text-forest-500 mx-auto mb-4" />
                <h3 className={cn('font-display text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-navy-900')}>Application Submitted!</h3>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-navy-600')}>Thank you for your interest in joining CIGMA. We will review your application and contact you within 5–7 working days.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-maroon-600 text-sm font-medium hover:underline">Submit another application</button>
              </GlassCard>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'name', label: 'Full Name', placeholder: 'Your full name' },
                  { id: 'phone', label: 'Phone Number', placeholder: '+91 XXXXX XXXXX' },
                ].map(f => (
                  <div key={f.id}>
                    <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>{f.label}</label>
                    <input {...register(f.id as keyof FormData)} placeholder={f.placeholder}
                      className={cn('w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors', isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500', errors[f.id as keyof FormData] && 'border-red-400')} />
                    {errors[f.id as keyof FormData] && <p className="text-red-400 text-xs mt-1">{errors[f.id as keyof FormData]?.message}</p>}
                  </div>
                ))}
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>Email Address</label>
                <input {...register('email')} placeholder="your@email.com" type="email"
                  className={cn('w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors', isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500', errors.email && 'border-red-400')} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>Position Applying For</label>
                <select {...register('position')} className={cn('w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors', isDark ? 'bg-navy-800 border-white/10 text-white focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500', errors.position && 'border-red-400')}>
                  <option value="">Select position...</option>
                  {positions.map(dept => (
                    <optgroup key={dept.type} label={dept.type}>
                      {dept.roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </optgroup>
                  ))}
                </select>
                {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'qualification', label: 'Highest Qualification', placeholder: 'e.g., B.Ed, M.A., etc.' },
                  { id: 'experience', label: 'Years of Experience', placeholder: 'e.g., 3 years, Fresher' },
                ].map(f => (
                  <div key={f.id}>
                    <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>{f.label}</label>
                    <input {...register(f.id as keyof FormData)} placeholder={f.placeholder}
                      className={cn('w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors', isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500', errors[f.id as keyof FormData] && 'border-red-400')} />
                    {errors[f.id as keyof FormData] && <p className="text-red-400 text-xs mt-1">{errors[f.id as keyof FormData]?.message}</p>}
                  </div>
                ))}
              </div>
              <div>
                <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>Cover Note</label>
                <textarea {...register('coverLetter')} rows={4} placeholder="Tell us why you want to join CIGMA and what you bring to our team..."
                  className={cn('w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors resize-none', isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500', errors.coverLetter && 'border-red-400')} />
                {errors.coverLetter && <p className="text-red-400 text-xs mt-1">{errors.coverLetter.message}</p>}
              </div>
              {/* CV upload placeholder */}
              <div className={cn('border-2 border-dashed rounded-xl p-6 text-center', isDark ? 'border-white/10 hover:border-maroon-600/40' : 'border-navy-100 hover:border-maroon-500', 'transition-colors cursor-pointer')}>
                <Upload className={cn('w-8 h-8 mx-auto mb-2', isDark ? 'text-gray-500' : 'text-navy-400')} />
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-navy-600')}>Upload your CV/Resume (PDF, max 5MB)</p>
                <p className={cn('text-xs mt-1', isDark ? 'text-gray-600' : 'text-navy-400')}>Click to browse or drag and drop</p>
              </div>
              <Button type="submit" variant="maroon" size="lg" loading={isSubmitting} className="w-full">
                Submit Application
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
