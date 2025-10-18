import BentoCard from '../ui/BentoCard'

const cards = [
  { id: 'bg',    icon: '⚡', title: 'Works in background', description: 'Launches automations instantly, no app open needed. Tap and go.', big: true,  accent: true  },
  { id: 'tap',   icon: '👆', title: '1 tap = 7 actions',   description: 'Single touch triggers music, maps, smart lights, calendar, and more simultaneously.', big: true,  accent: false },
  { id: 'sec',   icon: '🔒', title: 'Secure',              description: 'End-to-end encrypted. Your automations are yours alone.', big: false, accent: false },
  { id: 'home',  icon: '🏠', title: 'Smart home',          description: 'HomeKit and Google Home integration out of the box.', big: false, accent: false },
  { id: 'guest', icon: '👥', title: 'Guest mode',          description: 'Share Wi-Fi and automations without revealing credentials.', big: false, accent: false },
  { id: 'cross', icon: '📱', title: 'iOS & Android',       description: 'Native integration on both platforms. One tag, any phone.', big: false, accent: false },
]

export default function BentoGrid() {
  return (
    <section id="features" className="py-24 px-6 lg:px-12" style={{ background: 'var(--c-bg)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-body text-xs text-secondary/70 uppercase tracking-widest mb-2">Features</p>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--c-text)' }}
          >
            Everything you need
          </h2>
        </div>

        {/* desktop: asymmetric grid */}
        <div
          className="hidden md:grid gap-4"
          style={{
            gridTemplateAreas: `
              "big1 big1 small1 small2"
              "big2 big2 small3 small4"
            `,
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          <div style={{ gridArea: 'big1' }}><BentoCard {...cards[0]} className="h-full min-h-[180px]" /></div>
          <div style={{ gridArea: 'big2' }}><BentoCard {...cards[1]} className="h-full min-h-[180px]" /></div>
          <div style={{ gridArea: 'small1' }}><BentoCard {...cards[2]} className="h-full min-h-[180px]" /></div>
          <div style={{ gridArea: 'small2' }}><BentoCard {...cards[3]} className="h-full min-h-[180px]" /></div>
          <div style={{ gridArea: 'small3' }}><BentoCard {...cards[4]} className="h-full min-h-[180px]" /></div>
          <div style={{ gridArea: 'small4' }}><BentoCard {...cards[5]} className="h-full min-h-[180px]" /></div>
        </div>

        {/* mobile: single column */}
        <div className="grid md:hidden grid-cols-1 gap-4">
          {cards.map(card => <BentoCard key={card.id} {...card} />)}
        </div>
      </div>
    </section>
  )
}
