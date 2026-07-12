'use client'

import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/types'

function ProductArt({ slug }: { slug: string }) {
  // Different SVG compositions based on product slug
  if (slug.includes('dried') || slug.includes('everlasting') || slug.includes('jar')) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
        <ellipse cx="45" cy="45" rx="30" ry="20" fill="#5E7355" />
        <circle cx="30" cy="38" r="8" fill="#B23A52" />
        <circle cx="60" cy="38" r="8" fill="#EFB94A" />
      </svg>
    )
  }

  if (slug.includes('gift') || slug.includes('box') || slug.includes('sunshine')) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
        <rect x="20" y="30" width="50" height="40" rx="6" fill="#EFB94A" />
        <rect x="20" y="30" width="50" height="10" fill="#B23A52" />
      </svg>
    )
  }

  if (slug.includes('rose') || slug.includes('red')) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
        <circle cx="45" cy="38" r="20" fill="#B23A52" />
        <path d="M45 58V78" stroke="#7C9473" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="37" cy="70" rx="10" ry="6" fill="#5E7355" transform="rotate(-20 37 70)" />
      </svg>
    )
  }

  if (slug.includes('sunflower') || slug.includes('bright')) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
        <circle cx="45" cy="40" r="10" fill="#7C9473" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const cx = 45 + Math.cos(angle) * 20
          const cy = 40 + Math.sin(angle) * 20
          return <ellipse key={i} cx={cx} cy={cy} rx="7" ry="12" fill="#EFB94A" transform={`rotate(${i * 45} ${cx} ${cy})`} />
        })}
        <path d="M45 50V75" stroke="#7C9473" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  if (slug.includes('lavender') || slug.includes('purple')) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
        <path d="M45 80V30" stroke="#7C9473" strokeWidth="3" strokeLinecap="round" />
        <circle cx="45" cy="25" r="5" fill="#B23A52" />
        <circle cx="40" cy="32" r="4" fill="#B23A52" opacity="0.8" />
        <circle cx="50" cy="32" r="4" fill="#B23A52" opacity="0.8" />
        <ellipse cx="36" cy="55" rx="8" ry="5" fill="#5E7355" transform="rotate(-25 36 55)" />
        <ellipse cx="54" cy="60" rx="8" ry="5" fill="#5E7355" transform="rotate(25 54 60)" />
      </svg>
    )
  }

  if (slug.includes('wreath') || slug.includes('circle')) {
    return (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
        <circle cx="45" cy="45" r="28" fill="none" stroke="#5E7355" strokeWidth="10" />
        <circle cx="45" cy="20" r="6" fill="#EFB94A" />
        <circle cx="65" cy="50" r="5" fill="#B23A52" />
        <circle cx="25" cy="55" r="5" fill="#B23A52" />
        <circle cx="45" cy="70" r="6" fill="#EFB94A" />
      </svg>
    )
  }

  // Default: three circles (the "Tuesday Bunch" style)
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
      <circle cx="45" cy="45" r="18" fill="#B23A52" />
      <circle cx="26" cy="55" r="13" fill="#EFB94A" />
      <circle cx="64" cy="55" r="13" fill="#5E7355" />
    </svg>
  )
}

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="bb-card bg-white rounded-[18px] border border-twine-light overflow-hidden">
      {/* Card image area */}
      <div className="relative flex items-center justify-center bg-paper-warm" style={{ aspectRatio: '4 / 3.1' }}>
        {product.badges.length > 0 && (
          <span className="absolute top-3 left-3 font-[family-name:var(--font-space-mono)] text-[0.65rem] bg-butter text-ink px-2.5 py-1 rounded-full uppercase tracking-[0.04em]">
            {product.badges[0]}
          </span>
        )}
        <ProductArt slug={product.slug} />
      </div>

      {/* Card body */}
      <div className="p-4 pb-6">
        <h3 className="font-bold text-[1.02rem] mb-1 mt-0">{product.title}</h3>
        <p className="text-ink-soft text-[0.88rem] mb-4 mt-0">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-space-mono)] font-bold text-berry-deep">
            {formatPrice(product.price)}
          </span>
          <button
            className="add-btn-rotate w-9 h-9 rounded-full border-[1.5px] border-ink bg-white cursor-pointer text-lg leading-none transition-all duration-200 hover:bg-ink hover:text-white"
            aria-label={`Add ${product.title} to cart`}
            onClick={() => onAdd(product)}
          >
            +
          </button>
        </div>
      </div>
    </article>
  )
}