export default function ShopCarousel() {
  return (
    <section id="shop" className="py-24 overflow-hidden" style={{ background: 'var(--c-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <p className="font-body text-xs text-secondary/70 uppercase tracking-widest mb-2">Physical Tags</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--c-text)' }}
          >
            Pick your style
          </h2>
          <p className="font-body text-sm max-w-xs" style={{ color: 'var(--c-text-40)' }}>
            Every tag works with any phone. Ships worldwide in 3–5 days.
          </p>
        </div>

        {/* unavailable */}
        <div
          className="flex flex-col items-center justify-center gap-6 py-20 rounded-card border"
          style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'rgba(138,43,226,0.12)', boxShadow: '0 0 32px rgba(138,43,226,0.2)' }}
          >
            🏷️
          </div>

          <div className="text-center">
            <h3
              className="font-display font-semibold mb-2"
              style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', color: 'var(--c-text)' }}
            >
              Products coming soon
            </h3>
            <p className="font-body text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--c-text-50)' }}>
              Our physical NFC tags are currently unavailable. Leave your email and we'll notify you when they're in stock.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 font-body text-sm px-4 py-3 rounded outline-none border transition-colors duration-200"
              style={{
                background: 'var(--c-surface)',
                borderColor: 'var(--c-border)',
                color: 'var(--c-text)',
              }}
            />
            <button
              className="font-body font-medium text-sm px-6 py-3 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,43,226,0.4)] whitespace-nowrap"
              style={{ background: '#8A2BE2', color: '#fff' }}
            >
              Notify me
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(138,43,226,0.5)' }} />
            <span className="font-body text-xs" style={{ color: 'var(--c-text-30)' }}>No spam · Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
