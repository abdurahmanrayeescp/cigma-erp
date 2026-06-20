interface IslamicPatternProps {
  className?: string
  color?: string
  opacity?: number
}

export default function IslamicPattern({ className = '', color = '#8B3A3A', opacity = 0.08 }: IslamicPatternProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="islamic-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* 8-pointed star / geometric pattern */}
          <g fill={color} fillOpacity={opacity} fillRule="evenodd">
            <polygon points="40,5 47,16 60,16 52,25 55,38 40,32 25,38 28,25 20,16 33,16" />
            <rect x="0" y="0" width="10" height="10" transform="rotate(45 5 5)" />
            <rect x="70" y="70" width="10" height="10" transform="rotate(45 75 75)" />
            <rect x="0" y="70" width="10" height="10" transform="rotate(45 5 75)" />
            <rect x="70" y="0" width="10" height="10" transform="rotate(45 75 5)" />
            <circle cx="40" cy="40" r="3" />
            <circle cx="0" cy="0" r="3" />
            <circle cx="80" cy="0" r="3" />
            <circle cx="0" cy="80" r="3" />
            <circle cx="80" cy="80" r="3" />
          </g>
          <g stroke={color} strokeOpacity={opacity * 0.5} strokeWidth="0.5" fill="none">
            <line x1="0" y1="40" x2="80" y2="40" />
            <line x1="40" y1="0" x2="40" y2="80" />
            <line x1="0" y1="0" x2="80" y2="80" />
            <line x1="80" y1="0" x2="0" y2="80" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-geo)" />
    </svg>
  )
}
