export default function ShopCarousel() {
  return (
    <section id="shop" className="py-24 overflow-hidden" style={{ background: 'var(--c-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <p className="font-body text-xs text-secondary/70 uppercase tracking-widest mb-2">Physical Tags</p>
        <h2
          className="font-display font-bold mb-16"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--c-text)' }}
        >
          Pick your style
        </h2>

        {/* unavailable */}
        <div
          className="flex flex-col items-center justify-center gap-6 py-20 px-6 rounded-card border"
          style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'rgba(138,43,226,0.12)', boxShadow: '0 0 32px rgba(138,43,226,0.2)' }}
          >
            🏷️
          </div>

          <h3
            className="font-display font-semibold text-center"
            style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', color: 'var(--c-text)' }}
          >
            Coming soon
          </h3>
        </div>
      </div>
    </section>
  )
}
