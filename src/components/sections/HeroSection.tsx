import { Component, Suspense, lazy, type ReactNode } from 'react'
import ComingSoon from '../ui/ComingSoon'

const TapScene = lazy(() => import('../ui/TapScene'))

// shown while three.js loads, and instead of the scene when WebGL is missing or fails
function TagFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-48 h-48 animate-float" aria-hidden>
        <circle cx="100" cy="100" r="90" fill="#3D1070" stroke="#8A2BE2" strokeWidth="2"/>
        <circle cx="100" cy="100" r="60" fill="none" stroke="#00FFFF" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="100" cy="100" r="30" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.4"/>
        <circle cx="100" cy="100" r="8" fill="#8A2BE2"/>
      </svg>
    </div>
  )
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? <TagFallback /> : this.props.children
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

interface HeroSectionProps {
  isDark: boolean
}

export default function HeroSection({ isDark }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen-safe flex items-center overflow-hidden py-24"
      style={{ background: 'var(--c-bg)' }}
    >
      {/* ambient background blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.15), transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.10), transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(circle, #8A2BE2, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        {/* text block */}
        <div className="flex-1 lg:pr-12">
          <div
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded border border-primary/30 bg-primary/5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: 'var(--c-text-60)' }}>
              NFC Automation
            </span>
          </div>

          <h1
            className="font-display font-bold leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(40px, 7vw, 80px)', color: 'var(--c-text)' }}
          >
            Touch your world.<br />
            <span style={{ color: '#8A2BE2' }}>Control</span> your life.
          </h1>

          <p
            className="font-body mb-10 max-w-lg leading-relaxed"
            style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--c-text-60)' }}
          >
            Physical objects as buttons for your digital life. One tap launches automations, controls your smart home, and shapes your day.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView()}
              className="font-body font-medium px-6 py-3 rounded border border-primary transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(138,43,226,0.4)]"
              style={{ color: 'var(--c-text)' }}
            >
              See how it works
            </button>
            <ComingSoon label="Coming soon to iOS & Android" className="px-6 py-3 text-sm" />
          </div>
        </div>

        {/* 3D scene: a phone tapping an NFC tag */}
        <div className="lg:w-[45%] w-full h-80 sm:h-[420px] lg:h-[540px] relative">
          {hasWebGL() ? (
            <SceneBoundary>
              <Suspense fallback={<TagFallback />}>
                <TapScene />
              </Suspense>
            </SceneBoundary>
          ) : (
            <TagFallback />
          )}
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-body text-xs uppercase tracking-widest" style={{ color: 'var(--c-text-50)' }}>Scroll</span>
        <div
          className="w-px h-8"
          style={{ background: isDark ? 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' : 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)' }}
        />
      </div>
    </section>
  )
}
