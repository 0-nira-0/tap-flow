import useEmblaCarousel from 'embla-carousel-react'
import ProductCard, { type Product } from '../ui/ProductCard'

const products: Product[] = [
  { name: 'Carbon', material: 'Carbon fiber composite', price: '$24', color: '#1a1a1a', emoji: '⬛' },
  { name: 'Matte Metal', material: 'Brushed aluminium alloy', price: '$29', color: '#8A8A8A', emoji: '🔘' },
  { name: 'Light Wood', material: 'Maple veneer', price: '$22', color: '#C8A96E', emoji: '🟫' },
  { name: 'Dark Wood', material: 'Walnut veneer', price: '$22', color: '#5C3A1E', emoji: '🪵' },
  { name: 'Leather Keychain', material: 'Full-grain leather', price: '$19', color: '#8B4513', emoji: '🔑' },
  { name: 'Transparent', material: 'Polycarbonate clear', price: '$16', color: '#00FFFF', emoji: '💎' },
]

export default function ShopCarousel() {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  })

  return (
    <section id="shop" className="py-24 overflow-hidden" style={{ background: '#050505' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 mb-12">
        <p className="font-body text-xs text-secondary/70 uppercase tracking-widest mb-2">Physical Tags</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
            Pick your style
          </h2>
          <p className="font-body text-white/40 text-sm max-w-xs">
            Every tag works with any phone. Ships worldwide in 3–5 days.
          </p>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 px-6 lg:px-12">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
          {/* spacer */}
          <div className="flex-shrink-0 w-6" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-8 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="font-body text-xs text-white/30">Drag to explore</span>
      </div>
    </section>
  )
}

