import { useState, useEffect } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import Preloader from './components/ui/Preloader'
import HeroSection from './components/sections/HeroSection'
import HowItWorks from './components/sections/HowItWorks'
import BentoGrid from './components/sections/BentoGrid'
import ShopCarousel from './components/sections/ShopCarousel'
import Footer from './components/sections/Footer'

function Header() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-4 flex items-center justify-between"
      style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.95), transparent)', backdropFilter: 'blur(8px)' }}>
      <div className="font-display font-bold text-white text-lg">TapFlow</div>
      <nav className="hidden md:flex gap-6">
        {[['how-it-works', 'How it works'], ['features', 'Features'], ['shop', 'Shop']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200"
          >
            {label}
          </button>
        ))}
      </nav>
      <button
        onClick={() => scrollTo('footer')}
        className="font-body text-sm px-4 py-2 rounded border border-primary/60 text-white transition-all duration-300 hover:bg-primary/10 hover:shadow-glow"
      >
        Download
      </button>
    </header>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <Preloader visible={loading} />
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <BentoGrid />
        <ShopCarousel />
        <Footer />
      </main>
    </LazyMotion>
  )
}
