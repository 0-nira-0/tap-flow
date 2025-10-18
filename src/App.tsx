import { useState, useEffect } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import Preloader from './components/ui/Preloader'
import HeroSection from './components/sections/HeroSection'
import HowItWorks from './components/sections/HowItWorks'
import BentoGrid from './components/sections/BentoGrid'
import ShopCarousel from './components/sections/ShopCarousel'
import Footer from './components/sections/Footer'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor" aria-hidden>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
      style={{
        background: isDark ? 'rgba(138,43,226,0.3)' : 'rgba(138,43,226,0.15)',
        border: '1px solid rgba(138,43,226,0.4)',
      }}
    >
      {/* 18px knob in a 46x22 track: 2px gap on every side */}
      <span
        className="absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          transform: isDark ? 'translateX(0)' : 'translateX(24px)',
          background: isDark ? '#8A2BE2' : '#ffffff',
          color: isDark ? '#ffffff' : '#8A2BE2',
          boxShadow: isDark ? '0 0 8px rgba(138,43,226,0.6)' : '0 1px 4px rgba(0,0,0,0.15)',
        }}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  )
}

function Header({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-4 flex items-center justify-between"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, rgba(5,5,5,0.95), transparent)'
          : 'linear-gradient(to bottom, rgba(242,242,245,0.95), transparent)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>TapFlow</div>

      <nav className="hidden md:flex gap-6">
        {[['how-it-works', 'How it works'], ['features', 'Features'], ['shop', 'Shop']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="font-body text-sm transition-colors duration-200 text-[color:var(--c-text-50)] hover:text-[color:var(--c-text)]"
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle isDark={isDark} onToggle={onToggle} />
        <button
          onClick={() => scrollTo('footer')}
          className="font-body text-sm px-4 py-2 rounded border border-primary/60 transition-all duration-300 hover:bg-primary/10 hover:shadow-glow"
          style={{ color: 'var(--c-text)' }}
        >
          Download
        </button>
      </div>
    </header>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <LazyMotion features={domAnimation}>
      <Preloader visible={loading} />
      <Header isDark={isDark} onToggle={() => setIsDark(v => !v)} />
      <main>
        <HeroSection isDark={isDark} />
        <HowItWorks />
        <BentoGrid />
        <ShopCarousel />
        <Footer />
      </main>
    </LazyMotion>
  )
}
