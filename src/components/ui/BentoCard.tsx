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

  // mouse only: a tap on a touch screen would leave the card tilted with no leave event
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    parallaxHandlers.onMouseMove(e)
    spotHandlers.onMouseMove(e)
  }

  const onPointerLeave = () => {
    parallaxHandlers.onMouseLeave()
    spotHandlers.onMouseLeave()
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-card p-6 glass cursor-default ${className}`}
      style={{ ...style, transition: 'transform 0.1s ease' }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* spotlight overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-card" style={spotStyle} />

      {/* accent border glow */}
      {accent && (
        <div
          className="absolute inset-0 rounded-card pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(138,43,226,0.3)' }}
        />
      )}

      <div className="relative z-10">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-display font-semibold text-lg mb-1" style={{ color: 'var(--c-text)' }}>{title}</h3>
        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--c-text-50)' }}>{description}</p>
      </div>
    </div>
  )
}
