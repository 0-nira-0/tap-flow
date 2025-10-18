import { useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import PhoneScreen from '../ui/PhoneScreen'

const steps = [
  {
    icon: '☕',
    label: 'Coffee Tag',
    title: 'One tap for the perfect morning',
    description: 'Tap your coffee mug tag. Spotify starts, lights brighten, and your day begins.',
    color: '#8A2BE2',
  },
  {
    icon: '🚗',
    label: 'Car Tag',
    title: 'Get in and go',
    description: 'Touch the dashboard tag. Navigation launches, hands-free activates, playlist resumes.',
    color: '#00FFFF',
  },
  {
    icon: '🌙',
    label: 'Night Tag',
    title: 'Your night ritual in one tap',
    description: 'Tap the bedside tag. Lights off, Do Not Disturb on, alarm set for 7 AM.',
    color: '#8A2BE2',
  },
]

const PHONE_W = 240
const PHONE_H = 520 // 240px wide at 9:19.5

// Shrinks the phone so the whole sticky frame fits short viewports
function usePhoneScale() {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const update = () => {
      const frame = frameRef.current
      const content = contentRef.current
      const slot = slotRef.current
      if (!frame || !content || !slot) return
      const cs = getComputedStyle(frame)
      const available = frame.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      const rest = content.offsetHeight - slot.offsetHeight
      const next = Math.min(1, Math.max(0.4, (available - rest) / PHONE_H))
      setScale(prev => (Math.abs(prev - next) < 0.01 ? prev : next))
    }

    update()
    const observer = new ResizeObserver(update)
    if (frameRef.current) observer.observe(frameRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [])

  return { frameRef, contentRef, slotRef, scale }
}

export default function HowItWorks() {
  const { ref, progress } = useScrollProgress()
  const { frameRef, contentRef, slotRef, scale } = usePhoneScale()

  const step = Math.min(2, Math.floor(progress * 3))

  return (
    <section ref={ref} id="how-it-works" style={{ height: '300vh' }}>
      {/* pt-20 keeps the frame clear of the fixed header */}
      <div
        ref={frameRef}
        className="sticky top-0 h-screen-safe pt-20 pb-6 flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'var(--c-bg)' }}
      >
        {/* ambient */}
        <div
          className="absolute top-1/3 left-0 w-80 h-80 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.08), transparent 70%)', filter: 'blur(80px)' }}
        />

        <div ref={contentRef} className="w-full flex flex-col items-center">
          {/* header: hidden on small phones and landscape phones to leave room for the phone */}
          <div className="text-center mb-6 sm:mb-10 px-6 [@media(max-width:767px)_and_(max-height:720px)]:hidden">
            <p className="font-body text-xs text-secondary/70 uppercase tracking-widest mb-2">How It Works</p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--c-text)' }}
            >
              Your world, automated
            </h2>
          </div>

          {/* step indicators */}
          <div className="flex gap-3 mb-6 sm:mb-10">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full transition-all duration-500"
                  style={{ background: i === step ? s.color : 'rgba(128,128,128,0.2)', transform: i === step ? 'scale(1.5)' : 'scale(1)' }}
                />
                {i < steps.length - 1 && <div className="w-8 h-px" style={{ background: 'var(--c-border)' }} />}
              </div>
            ))}
          </div>

          {/* main content */}
          <div className="w-full max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-20">
            {/* left: tag + text */}
            <div className="flex-1 flex flex-col items-start gap-4 sm:gap-6 w-full max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 80, opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl glass"
                    style={{ boxShadow: `0 0 20px ${steps[step].color}33` }}
                  >
                    {steps[step].icon}
                  </div>
                  <div>
                    <div className="font-body text-xs uppercase tracking-wider" style={{ color: 'var(--c-text-40)' }}>
                      {steps[step].label}
                    </div>
                    <div className="font-display font-semibold text-sm mt-0.5" style={{ color: 'var(--c-text)' }}>NFC Tag</div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* SVG wave line */}
              <div className="hidden lg:block w-full">
                <svg viewBox="0 0 300 60" className="w-full" style={{ overflow: 'visible' }}>
                  <motion.path
                    key={step}
                    d="M0,30 Q75,10 150,30 Q225,50 300,30"
                    stroke={steps[step].color}
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="4 3"
                    opacity="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </svg>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${step}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h3
                    className="font-display font-bold mb-2"
                    style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', color: 'var(--c-text)' }}
                  >
                    {steps[step].title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--c-text-50)' }}>
                    {steps[step].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* progress bar uses raw progress (0 to 1) */}
              <div className="w-full h-px rounded-full overflow-hidden" style={{ background: 'var(--c-border)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: steps[step].color }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(progress * 100, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* right: phone */}
            <div
              ref={slotRef}
              className="relative flex-shrink-0"
              style={{ width: PHONE_W * scale, height: PHONE_H * scale }}
            >
              <div
                className="absolute -inset-8 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${steps[step].color}15, transparent 70%)`,
                  filter: 'blur(30px)',
                  transition: 'background 0.5s',
                }}
              />
              <div style={{ width: PHONE_W, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <PhoneScreen step={step} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
