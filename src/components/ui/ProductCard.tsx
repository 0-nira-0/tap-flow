import { useState } from 'react'

interface Product {
  name: string
  material: string
  price: string
  color: string
  emoji: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [orderHovered, setOrderHovered] = useState(false)

  return (
    <div
      className="relative flex-shrink-0 w-64 rounded-card glass overflow-hidden cursor-pointer"
      style={{ perspective: '800px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* layer 3 — base chip */}
      <div
        className="absolute inset-0 rounded-card"
        style={{
          background: `linear-gradient(135deg, ${product.color}22, #050505)`,
          transform: hovered ? 'translateZ(0px)' : 'translateZ(0px)',
          transition: 'transform 0.4s ease',
          transformStyle: 'preserve-3d',
        }}
      />

      {/* layer 2 — antenna pattern */}
      <div
        className="absolute inset-2 rounded-card overflow-hidden"
        style={{
          transform: hovered ? 'translateZ(15px)' : 'translateZ(0px)',
          transition: 'transform 0.4s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        <svg className="w-full h-24 opacity-20" viewBox="0 0 200 80">
          <circle cx="100" cy="40" r="30" stroke={product.color} strokeWidth="1.5" fill="none"/>
          <circle cx="100" cy="40" r="20" stroke={product.color} strokeWidth="1" fill="none"/>
          <circle cx="100" cy="40" r="8" stroke={product.color} strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* layer 1 — decorative surface */}
      <div
        className="relative p-5 flex flex-col gap-4"
        style={{
          transform: hovered ? 'translateZ(30px)' : 'translateZ(0px)',
          transition: 'transform 0.4s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* tag visual */}
        <div
          className="w-full h-32 rounded-lg flex items-center justify-center text-5xl"
          style={{ background: `linear-gradient(135deg, ${product.color}33, ${product.color}11)` }}
        >
          {product.emoji}
        </div>

        <div>
          <h3 className="font-display font-semibold text-white text-base">{product.name}</h3>
          <p className="font-body text-white/40 text-xs mt-0.5">{product.material}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-white text-xl">{product.price}</span>
          <button
            className="font-body text-sm px-4 py-2 rounded border transition-all duration-300"
            style={{
              borderColor: orderHovered ? '#00FFFF' : '#8A2BE2',
              color: orderHovered ? '#00FFFF' : '#ffffff',
              boxShadow: orderHovered ? '0 0 12px rgba(0,255,255,0.3)' : 'none',
            }}
            onMouseEnter={() => setOrderHovered(true)}
            onMouseLeave={() => setOrderHovered(false)}
          >
            Order
          </button>
        </div>
      </div>
    </div>
  )
}

export type { Product }

