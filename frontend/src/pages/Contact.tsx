import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, MessageCircle, CheckCircle, Clock } from 'lucide-react'
import { inquiriesApi } from '@/lib/api'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

const contactInfo = [
  { icon: MapPin, label: 'Address', value: 'Thana, Kannur, Kerala, India', href: 'https://maps.google.com/?q=Thana,Kannur,Kerala', color: 'from-rose-400 to-pink-500' },
  { icon: Phone, label: 'Phone', value: '+91 97467 70422\n+91 91881 10422', href: 'tel:+919746770422', color: 'from-blue-400 to-indigo-500' },
  { icon: Mail, label: 'Email', value: 'creativekidskannur@gmail.com', href: 'mailto:creativekidskannur@gmail.com', color: 'from-emerald-400 to-forest-500' },
  { icon: InstagramIcon, label: 'Instagram', value: '@creativeintl', href: 'https://instagram.com/creativeintl', color: 'from-violet-400 to-purple-500' },
]

export default function Contact() {
  const { isDark } = useTheme()
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await inquiriesApi.submit({
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject: data.subject,
        message: data.message,
        type: 'general',
      })
      setSubmitted(true)
      reset()
      toast.success('Message sent! We\'ll reply within 24 hours.')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      toast.error(message)
    }
  }

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with any questions, inquiries, or feedback."
        breadcrumbs={[{ label: 'Contact' }]}
        seoTitle="Contact — CIGMA"
        seoDescription="Contact Creative International Girls Madrassa Academy. Address: Thana, Kannur, Kerala. Phone: +91 97467 70422. Email: creativekidskannur@gmail.com"
      />

      {/* Contact Cards */}
      <section className={cn('py-12', isDark ? 'bg-navy-950' : 'bg-gray-50')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((info, i) => {
              const Icon = info.icon
              return (
                <AnimatedSection key={info.label} delay={i * 0.08}>
                  <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block group">
                    <GlassCard hover className="p-5 text-center">
                      <div className={cn('w-12 h-12 mx-auto rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300', info.color)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className={cn('text-xs font-semibold uppercase tracking-wider mb-2', isDark ? 'text-gray-400' : 'text-navy-500')}>{info.label}</p>
                      <p className={cn('text-xs leading-relaxed whitespace-pre-line', isDark ? 'text-gray-200' : 'text-navy-800')}>{info.value}</p>
                    </GlassCard>
                  </a>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className={cn('section-padding', isDark ? 'bg-navy-900' : 'bg-white')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <AnimatedSection direction="left">
              <SectionTitle label="Get In Touch" title="Send Us a Message" />

              {/* WhatsApp quick contact */}
              <a
                href="https://wa.me/919746770422"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">Quick Contact via WhatsApp</span>
                <span className="ml-auto text-emerald-200 text-xs">+91 97467 70422</span>
              </a>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <GlassCard className="p-10 text-center" gold>
                    <CheckCircle className="w-16 h-16 text-forest-500 mx-auto mb-4" />
                    <h3 className={cn('font-display text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-navy-900')}>Message Sent!</h3>
                    <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-navy-600')}>Thank you for reaching out. We will get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-maroon-600 text-sm font-medium hover:underline">Send another message</button>
                  </GlassCard>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'name', label: 'Full Name', placeholder: 'Your name' },
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
                    <input {...register('email')} type="email" placeholder="your@email.com"
                      className={cn('w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors', isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500', errors.email && 'border-red-400')} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>Subject</label>
                    <input {...register('subject')} placeholder="What is your inquiry about?"
                      className={cn('w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors', isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500', errors.subject && 'border-red-400')} />
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className={cn('block text-sm font-medium mb-1.5', isDark ? 'text-gray-300' : 'text-navy-700')}>Message</label>
                    <textarea {...register('message')} rows={5} placeholder="Your message..."
                      className={cn('w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors resize-none', isDark ? 'bg-navy-800 border-white/10 text-white placeholder-gray-500 focus:border-maroon-600/50' : 'bg-gray-50 border-navy-100 text-navy-900 focus:border-maroon-500', errors.message && 'border-red-400')} />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" variant="maroon" size="lg" loading={isSubmitting} className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </AnimatedSection>

            {/* Map + Office Hours */}
            <AnimatedSection direction="right">
              <SectionTitle label="Find Us" title="Our Location" />
              <div className="mt-6 rounded-2xl overflow-hidden h-64 border border-maroon-600/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.0!2d75.377!3d11.869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDUyJzA4LjQiTiA3NcKwMjInMzcuMiJF!5e0!3m2!1sen!2sin!4v1234567890"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CIGMA Location"
                />
              </div>

              <GlassCard className="p-6 mt-6" gold>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-maroon-600" />
                  <h3 className={cn('font-semibold', isDark ? 'text-white' : 'text-navy-900')}>Office Hours</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { day: 'Monday – Friday', time: '9:00 AM – 4:00 PM' },
                    { day: 'Saturday', time: '9:00 AM – 12:00 PM' },
                    { day: 'Sunday', time: 'Closed' },
                  ].map(row => (
                    <div key={row.day} className={cn('flex justify-between text-sm py-1.5 border-b last:border-0', isDark ? 'border-white/5' : 'border-navy-100')}>
                      <span className={isDark ? 'text-gray-300' : 'text-navy-700'}>{row.day}</span>
                      <span className={row.day === 'Sunday' ? 'text-red-400' : 'text-maroon-600 font-medium'}>{row.time}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
