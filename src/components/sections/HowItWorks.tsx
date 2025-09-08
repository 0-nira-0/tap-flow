import { useRef } from 'react'
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

export default function HowItWorks() {
  const { ref, progress } = useScrollProgress()

  const step = Math.min(2, Math.floor(progress * 3))
  const stepProgress = (progress * 3) % 1

  return (
    <section
      ref={ref}
      id="how-it-works"
      style={{ height: '300vh' }}
    >
      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: '#050505' }}
      >
        {/* ambient */}
        <div className="absolute top-1/3 left-0 w-80 h-80 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.08), transparent 70%)', filter: 'blur(80px)' }} />

        {/* header */}
        <div className="text-center mb-10 px-6">
          <p className="font-body text-xs text-secondary/70 uppercase tracking-widest mb-2">How It Works</p>
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            Your world, automated
          </h2>
        </div>

        {/* step indicators */}
        <div className="flex gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full transition-all duration-500"
                style={{ background: i === step ? s.color : 'rgba(255,255,255,0.15)', transform: i === step ? 'scale(1.5)' : 'scale(1)' }}
              />
              {i < steps.length - 1 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* main content */}
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
          {/* left — tag + text */}
          <div className="flex-1 flex flex-col items-start gap-6 max-w-sm">
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
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl glass"
                  style={{ boxShadow: `0 0 20px ${steps[step].color}33` }}
                >
                  {steps[step].icon}
                </div>
                <div>
                  <div className="font-body text-xs text-white/40 uppercase tracking-wider">{steps[step].label}</div>
                  <div className="font-display font-semibold text-white text-sm mt-0.5">NFC Tag</div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* SVG wave line to phone */}
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
                  className="font-display font-bold text-white mb-2"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 28px)' }}
                >
                  {steps[step].title}
                </h3>
                <p className="font-body text-white/50 text-sm leading-relaxed">
                  {steps[step].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* progress bar */}
            <div className="w-full h-px bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: steps[step].color }}
                initial={{ width: '0%' }}
                animate={{ width: `${((step + stepProgress) / 3) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* right — phone */}
          <div className="relative">
            <div
              className="absolute -inset-8 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${steps[step].color}15, transparent 70%)`,
                filter: 'blur(30px)',
                transition: 'background 0.5s',
              }}
            />
            <PhoneScreen step={step} />
          </div>
        </div>
      </div>
    </section>
  )
}





