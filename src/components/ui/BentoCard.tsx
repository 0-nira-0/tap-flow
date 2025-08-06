import { useRef } from 'react'
import { useMouseParallax } from '../../hooks/useMouseParallax'
import { useCursorSpotlight } from '../../hooks/useCursorSpotlight'

interface BentoCardProps {
  icon: string
  title: string
  description: string
  className?: string
  accent?: boolean
}

export default function BentoCard({ icon, title, description, className = '', accent = false }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { style, handlers: parallaxHandlers } = useMouseParallax(cardRef, 8)
  const { spotStyle, handlers: spotHandlers } = useCursorSpotlight()

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    parallaxHandlers.onMouseMove(e)
    spotHandlers.onMouseMove(e)
  }

  const onMouseLeave = () => {
    parallaxHandlers.onMouseLeave()
    spotHandlers.onMouseLeave()
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-card p-6 glass cursor-default ${className}`}
      style={{ ...style, transition: 'transform 0.1s ease' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* spotlight overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-card" style={spotStyle} />

      {/* accent border glow */}
      {accent && (
        <div className="absolute inset-0 rounded-card pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(138,43,226,0.3)' }} />
      )}

      <div className="relative z-10">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-display font-semibold text-white text-lg mb-1">{title}</h3>
        <p className="font-body text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}


