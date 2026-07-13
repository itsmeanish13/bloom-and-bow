'use client'

import { Flower2 } from 'lucide-react'
import type { Product } from '@/lib/types'
import ProductCard from './product-card'

interface ProductGridProps {
  products: Product[]
  onAdd: (product: Product) => void
}

export default function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <section aria-label="Featured products" id="products">
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="font-[family-name:var(--font-fraunces)] font-semibold m-0"
          style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}
        >
          Fresh this week
        </h2>
        <span className="text-ink-soft text-[0.85rem] font-[family-name:var(--font-karla)]">
          {products.length} {products.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Flower2 className="w-14 h-14 text-twine/40 mb-4" />
          <p className="text-ink-soft font-[family-name:var(--font-karla)] text-lg mb-1">No products found</p>
          <p className="text-ink-soft/60 font-[family-name:var(--font-karla)] text-sm">Try selecting a different category or occasion</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 gap-6 pb-[5.5rem]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      )}
    </section>
  )
}