import { useState, useEffect } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import Preloader from './components/ui/Preloader'
import HeroSection from './components/sections/HeroSection'
import HowItWorks from './components/sections/HowItWorks'
import BentoGrid from './components/sections/BentoGrid'
import ShopCarousel from './components/sections/ShopCarousel'
import Footer from './components/sections/Footer'

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{
        background: isDark ? 'rgba(138,43,226,0.3)' : 'rgba(138,43,226,0.15)',
        border: '1px solid rgba(138,43,226,0.4)',
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all duration-300"
        style={{
          left: isDark ? '2px' : '22px',
          background: isDark ? '#8A2BE2' : '#f2f2f5',
          boxShadow: isDark ? '0 0 8px rgba(138,43,226,0.6)' : '0 1px 4px rgba(0,0,0,0.15)',
        }}
      >
        {isDark ? '🌙' : '☀️'}
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
            className="font-body text-sm transition-colors duration-200 hover:text-white"
            style={{ color: 'var(--c-text-50)' }}
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
