'use client'

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
        <a
          href="#"
          className="text-[0.9rem] font-bold no-underline border-b-[1.5px] border-berry pb-0.5"
        >
          See all &rarr;
        </a>
      </div>

      <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 gap-6 pb-[5.5rem]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}