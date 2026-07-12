'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Minus, Plus, Truck, Gift, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatPrice, OCCASIONS, type Product } from '@/lib/types'
import { toast } from 'sonner'

/* ---------- SVG art (same logic as product-card, but bigger) ---------- */
function ProductArt({ slug }: { slug: string }) {
  const size = 200
  const vb = "0 0 200 200"
  if (slug.includes('dried') || slug.includes('everlasting') || slug.includes('jar')) {
    return (
      <svg width={size} height={size} viewBox={vb} aria-hidden="true">
        <ellipse cx="100" cy="100" rx="65" ry="45" fill="#5E7355" opacity="0.15" />
        <ellipse cx="100" cy="100" rx="65" ry="45" fill="none" stroke="#5E7355" strokeWidth="2" />
        <circle cx="70" cy="85" r="16" fill="#B23A52" />
        <circle cx="130" cy="85" r="16" fill="#EFB94A" />
        <circle cx="100" cy="110" r="12" fill="#7C9473" />
        <line x1="70" y1="101" x2="70" y2="140" stroke="#5E7355" strokeWidth="2.5" />
        <line x1="130" y1="101" x2="130" y2="140" stroke="#5E7355" strokeWidth="2.5" />
        <ellipse cx="60" cy="130" rx="15" ry="8" fill="#5E7355" transform="rotate(-20 60 130)" opacity="0.7" />
        <ellipse cx="140" cy="130" rx="15" ry="8" fill="#5E7355" transform="rotate(20 140 130)" opacity="0.7" />
      </svg>
    )
  }
  if (slug.includes('gift') || slug.includes('box') || slug.includes('sunshine')) {
    return (
      <svg width={size} height={size} viewBox={vb} aria-hidden="true">
        <rect x="50" y="75" width="100" height="75" rx="10" fill="#EFB94A" opacity="0.15" />
        <rect x="50" y="75" width="100" height="75" rx="10" fill="none" stroke="#EFB94A" strokeWidth="2" />
        <rect x="50" y="75" width="100" height="22" rx="10" fill="#B23A52" />
        <rect x="95" y="75" width="10" height="75" fill="#B23A52" rx="2" />
        <path d="M85 75 Q100 55 115 75" fill="none" stroke="#B23A52" strokeWidth="3" />
        <circle cx="100" cy="60" r="5" fill="#B23A52" />
      </svg>
    )
  }
  if (slug.includes('rose') || slug.includes('red')) {
    return (
      <svg width={size} height={size} viewBox={vb} aria-hidden="true">
        <circle cx="100" cy="80" r="40" fill="#B23A52" opacity="0.12" />
        <circle cx="100" cy="80" r="40" fill="none" stroke="#B23A52" strokeWidth="2" />
        <circle cx="100" cy="80" r="28" fill="#B23A52" opacity="0.3" />
        <path d="M100 120V175" stroke="#7C9473" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="80" cy="155" rx="20" ry="12" fill="#5E7355" transform="rotate(-25 80 155)" opacity="0.7" />
        <ellipse cx="120" cy="150" rx="18" ry="10" fill="#5E7355" transform="rotate(25 120 150)" opacity="0.7" />
        <ellipse cx="75" cy="130" rx="16" ry="9" fill="#7C9473" transform="rotate(-35 75 130)" opacity="0.5" />
      </svg>
    )
  }
  if (slug.includes('sunflower') || slug.includes('bright')) {
    return (
      <svg width={size} height={size} viewBox={vb} aria-hidden="true">
        <circle cx="100" cy="88" r="20" fill="#7C9473" />
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * 36 * Math.PI) / 180
          const cx = 100 + Math.cos(angle) * 42
          const cy = 88 + Math.sin(angle) * 42
          return <ellipse key={i} cx={cx} cy={cy} rx="14" ry="24" fill="#EFB94A" transform={`rotate(${i * 36} ${cx} ${cy})`} opacity="0.8" />
        })}
        <path d="M100 108V170" stroke="#7C9473" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="80" cy="150" rx="18" ry="10" fill="#5E7355" transform="rotate(-30 80 150)" opacity="0.6" />
      </svg>
    )
  }
  if (slug.includes('lavender') || slug.includes('purple')) {
    return (
      <svg width={size} height={size} viewBox={vb} aria-hidden="true">
        <path d="M100 180V70" stroke="#7C9473" strokeWidth="3" strokeLinecap="round" />
        {[
          { cx: 100, cy: 55, r: 8 },
          { cx: 92, cy: 65, r: 7 },
          { cx: 108, cy: 65, r: 7 },
          { cx: 88, cy: 78, r: 6 },
          { cx: 112, cy: 78, r: 6 },
        ].map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#B23A52" opacity={0.6 + i * 0.08} />
        ))}
        <ellipse cx="78" cy="130" rx="18" ry="10" fill="#5E7355" transform="rotate(-25 78 130)" opacity="0.7" />
        <ellipse cx="122" cy="140" rx="18" ry="10" fill="#5E7355" transform="rotate(25 122 140)" opacity="0.7" />
      </svg>
    )
  }
  if (slug.includes('wreath') || slug.includes('circle')) {
    return (
      <svg width={size} height={size} viewBox={vb} aria-hidden="true">
        <circle cx="100" cy="100" r="60" fill="none" stroke="#5E7355" strokeWidth="18" opacity="0.15" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#5E7355" strokeWidth="18" />
        <circle cx="100" cy="45" r="10" fill="#EFB94A" />
        <circle cx="148" cy="80" r="8" fill="#B23A52" />
        <circle cx="148" cy="120" r="9" fill="#EFB94A" />
        <circle cx="100" cy="155" r="10" fill="#B23A52" />
        <circle cx="52" cy="120" r="8" fill="#EFB94A" />
        <circle cx="52" cy="80" r="9" fill="#B23A52" />
      </svg>
    )
  }
  if (slug.includes('pouch') || slug.includes('wild')) {
    return (
      <svg width={size} height={size} viewBox={vb} aria-hidden="true">
        <rect x="55" y="60" width="90" height="80" rx="12" fill="#C9BBA1" opacity="0.2" />
        <rect x="55" y="60" width="90" height="80" rx="12" fill="none" stroke="#C9BBA1" strokeWidth="2" />
        <path d="M60 60 Q100 35 140 60" fill="none" stroke="#C9BBA1" strokeWidth="2.5" />
        <circle cx="85" cy="95" r="8" fill="#B23A52" opacity="0.7" />
        <circle cx="100" cy="105" r="6" fill="#EFB94A" opacity="0.7" />
        <circle cx="115" cy="95" r="8" fill="#5E7355" opacity="0.7" />
        <circle cx="92" cy="115" r="5" fill="#7C9473" opacity="0.6" />
        <circle cx="108" cy="118" r="5" fill="#B23A52" opacity="0.5" />
      </svg>
    )
  }
  if (slug.includes('basket') || slug.includes('garden') || slug.includes('party')) {
    return (
      <svg width={size} height={size} viewBox={vb} aria-hidden="true">
        <path d="M45 100 Q100 170 155 100" fill="none" stroke="#C9BBA1" strokeWidth="3" />
        <rect x="40" y="95" width="120" height="60" rx="6" fill="#EFB94A" opacity="0.15" />
        <rect x="40" y="95" width="120" height="60" rx="6" fill="none" stroke="#C9BBA1" strokeWidth="2" />
        <circle cx="70" cy="80" r="12" fill="#B23A52" opacity="0.7" />
        <circle cx="100" cy="75" r="14" fill="#EFB94A" opacity="0.7" />
        <circle cx="130" cy="80" r="12" fill="#5E7355" opacity="0.7" />
        <circle cx="85" cy="68" r="9" fill="#7C9473" opacity="0.6" />
        <circle cx="115" cy="70" r="10" fill="#B23A52" opacity="0.5" />
        <path d="M60 95 Q100 55 140 95" fill="none" stroke="#5E7355" strokeWidth="2" opacity="0.5" />
      </svg>
    )
  }
  // Default
  return (
    <svg width={size} height={size} viewBox={vb} aria-hidden="true">
      <circle cx="100" cy="100" r="40" fill="#B23A52" />
      <circle cx="60" cy="125" r="28" fill="#EFB94A" />
      <circle cx="140" cy="125" r="28" fill="#5E7355" />
    </svg>
  )
}

/* ---------- Related product mini card ---------- */
function RelatedCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-twine-light p-4 text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer w-full"
    >
      <div className="flex items-center justify-center bg-paper-warm rounded-xl mb-3" style={{ aspectRatio: '4/3' }}>
        <ProductArt slug={product.slug} />
        <style>{`
          button > div > svg { width: 70px !important; height: 70px !important; }
        `}</style>
      </div>
      <p className="font-bold text-sm m-0 leading-tight truncate">{product.title}</p>
      <p className="font-[family-name:var(--font-space-mono)] text-berry-deep text-sm font-bold mt-1 m-0">
        {formatPrice(product.price)}
      </p>
    </button>
  )
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data.product)
          setRelated(data.related)
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  function handleAddToCart() {
    if (!product) return
    for (let i = 0; i < qty; i++) {
      addItem(product)
    }
    toast.success(`${qty > 1 ? qty + 'x ' : ''}${product.title} added to cart`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 border-2 border-twine border-t-berry rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper gap-6 px-6">
        <ShoppingBag size={56} strokeWidth={1.2} className="text-twine" />
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink m-0">
          Product not found
        </h1>
        <button
          onClick={() => router.push('/')}
          className="font-bold text-[0.95rem] px-7 py-3 rounded-full bg-ink text-paper border-none cursor-pointer hover:bg-ink/90 transition-colors"
        >
          Back to shop
        </button>
      </div>
    )
  }

  const stockLabel =
    product.stockStatus === 'in_stock' ? 'In stock' :
    product.stockStatus === 'made_to_order' ? 'Made to order' :
    'Sold out'
  const stockColor =
    product.stockStatus === 'in_stock' ? 'bg-sage text-white' :
    product.stockStatus === 'made_to_order' ? 'bg-butter text-ink' :
    'bg-ink-soft text-white'

  const occasionLabels = product.occasions
    .map((o) => OCCASIONS.find((occ) => occ.slug === o)?.label)
    .filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {/* Top bar */}
      <div className="max-w-[1180px] mx-auto px-6 w-full py-5">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors bg-transparent border-none cursor-pointer text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Main content */}
      <main className="max-w-[1180px] mx-auto px-6 w-full flex-1 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Art / Image */}
          <div className="flex items-center justify-center bg-paper-warm rounded-3xl border border-twine-light p-8 md:p-12">
            <ProductArt slug={product.slug} />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {/* Badges */}
            {product.badges.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="font-[family-name:var(--font-space-mono)] text-[0.65rem] bg-butter text-ink px-2.5 py-1 rounded-full uppercase tracking-[0.04em]"
                  >
                    {badge}
                  </span>
                ))}
                <span className={`font-[family-name:var(--font-space-mono)] text-[0.65rem] px-2.5 py-1 rounded-full uppercase tracking-[0.04em] ${stockColor}`}>
                  {stockLabel}
                </span>
              </div>
            )}

            <h1 className="font-[family-name:var(--font-fraunces)] font-semibold text-3xl md:text-4xl text-ink m-0 mb-2">
              {product.title}
            </h1>

            <p className="font-[family-name:var(--font-space-mono)] font-bold text-berry-deep text-2xl mb-5">
              {formatPrice(product.price)}
            </p>

            <p className="text-ink-soft text-[1.05rem] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Occasions */}
            {occasionLabels.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <Gift size={14} className="text-ink-soft" />
                <span className="text-ink-soft text-sm mr-1">Perfect for:</span>
                {occasionLabels.map((label) => (
                  <span
                    key={label}
                    className="font-[family-name:var(--font-space-mono)] text-[0.68rem] bg-paper-warm text-ink-soft px-2.5 py-1 rounded-full uppercase tracking-[0.04em] border border-twine-light"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Delivery info */}
            <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-paper-warm border border-twine-light">
              <Truck size={20} className="text-sage shrink-0" />
              <div>
                <p className="text-sm font-bold text-ink m-0">Same-day delivery</p>
                <p className="text-xs text-ink-soft m-0 mt-0.5">Order before 2 PM for same-day delivery across Kathmandu valley</p>
              </div>
            </div>

            {/* Qty + Add to cart */}
            {product.stockStatus !== 'sold_out' ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border border-twine rounded-full px-1 py-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 rounded-full bg-white border border-twine flex items-center justify-center cursor-pointer hover:bg-paper-warm transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-[family-name:var(--font-space-mono)] text-sm w-6 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-9 h-9 rounded-full bg-white border border-twine flex items-center justify-center cursor-pointer hover:bg-paper-warm transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 font-bold text-[0.95rem] px-7 py-3.5 rounded-full bg-berry text-white border-none cursor-pointer shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-berry-deep hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-8px_rgba(178,58,82,0.55)] active:translate-y-0"
                >
                  <ShoppingBag size={18} />
                  Add to cart
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full font-bold text-[0.95rem] px-7 py-3.5 rounded-full bg-ink-soft/40 text-white border-none cursor-not-allowed"
              >
                Sold out
              </button>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-3 mb-6">
              <Star size={18} className="text-butter" />
              <h2 className="font-[family-name:var(--font-fraunces)] font-semibold text-xl md:text-2xl text-ink m-0">
                You might also like
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <RelatedCard
                  key={p.id}
                  product={p}
                  onClick={() => {
                    router.push(`/product/${p.id}`)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}