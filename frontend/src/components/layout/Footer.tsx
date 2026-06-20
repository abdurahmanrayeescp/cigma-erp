import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Heart } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News & Events', href: '/news-events' },
  { label: 'Contact Us', href: '/contact' },
]

const moreLinks = [
  { label: 'Principal Message', href: '/principal-message' },
  { label: 'Management Message', href: '/management-message' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Career', href: '/career' },
  { label: 'Downloads', href: '/downloads' },
  { label: 'FAQ', href: '/faq' },
]

export default function Footer() {
  const { isDark } = useTheme()

  return (
    <footer className={cn(
      'relative overflow-hidden',
      isDark ? 'bg-navy-950' : 'bg-navy-900'
    )}>
      {/* Top accent line using logo colors */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon-600 via-navy-500 to-forest-500" />

      {/* Subtle circle pattern inspired by logo */}
      <div className="absolute inset-0 tree-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="CIGMA Logo"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-maroon-600/50"
              />
              <div>
                <p className="text-white font-bold font-display text-lg leading-tight">CIGMA</p>
                <p className="text-maroon-400 text-xs mt-0.5">Est. June 2018</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Creative International Academy — nurturing knowledgeable, righteous, and confident individuals through academic excellence and Islamic values.
            </p>
            <p className="text-maroon-300 font-display italic text-sm">"Live for Humanity"</p>

            {/* Social */}
            <div className="mt-5">
              <a
                href="https://instagram.com/creativeintl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-maroon-600/20 hover:border-maroon-500/40 transition-all duration-300"
              >
                <InstagramIcon className="w-4 h-4 text-maroon-400" />
                @creativeintl
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-maroon-400 font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm hover:text-maroon-300 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-maroon-500/50 group-hover:bg-maroon-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-maroon-400 font-semibold text-sm uppercase tracking-wider mb-5">More</h3>
            <ul className="space-y-2.5">
              {moreLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm hover:text-maroon-300 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-maroon-500/50 group-hover:bg-maroon-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-maroon-400 font-semibold text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-maroon-400 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm">Thana, Kannur, Kerala, India<br /><span className="text-white/40 text-xs">Pin: 670012</span></p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-maroon-400 shrink-0" />
                <div className="space-y-1">
                  <a href="tel:+919746770422" className="block text-white/70 text-sm hover:text-maroon-300 transition-colors">
                    +91 97467 70422
                  </a>
                  <a href="tel:+919188110422" className="block text-white/70 text-sm hover:text-maroon-300 transition-colors">
                    +91 91881 10422
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-maroon-400 shrink-0" />
                <a
                  href="mailto:creativekidskannur@gmail.com"
                  className="text-white/70 text-sm hover:text-maroon-300 transition-colors break-all"
                >
                  creativekidskannur@gmail.com
                </a>
              </div>
              <div className="mt-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white/50 text-xs">Board of Affiliation</p>
                <p className="text-forest-400 text-sm font-medium">National Institute of Open Schooling (NIOS)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Creative International Academy (CIGMA). All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-maroon-400 fill-maroon-400" />
            <span>CIGMA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
