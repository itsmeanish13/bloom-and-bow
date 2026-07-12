'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
}

export default function SearchDialog({
  open,
  onOpenChange,
  products,
}: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.includes(q)
    )
  }, [query, products])

  function handleSelect(product: Product) {
    onOpenChange(false)
    setQuery('')
    router.push(`/product/${product.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-paper border-twine-light rounded-2xl p-0 overflow-hidden max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-[family-name:var(--font-fraunces)] text-ink">
            Search
          </DialogTitle>
          <DialogDescription className="text-ink-soft">
            Find flowers and gifts
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
            />
            <input
              type="text"
              placeholder="Search bouquets, gifts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-twine bg-white text-[0.92rem] focus:border-ink focus:outline-none transition-colors font-[family-name:var(--font-karla)]"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto custom-scrollbar px-3 pb-3">
          {query.trim() && results.length === 0 && (
            <p className="text-ink-soft text-sm text-center py-8">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {results.map((product) => (
            <button
              key={product.id}
              className="w-full flex items-center gap-4 p-3 rounded-xl text-left hover:bg-paper-warm transition-colors cursor-pointer border-none bg-transparent"
              onClick={() => handleSelect(product)}
            >
              {/* Mini SVG art */}
              <div className="w-12 h-12 rounded-lg bg-paper-warm flex items-center justify-center shrink-0 overflow-hidden">
                <svg width="36" height="36" viewBox="0 0 90 90" aria-hidden="true">
                  <circle cx="45" cy="45" r="18" fill="#B23A52" />
                  <circle cx="26" cy="55" r="13" fill="#EFB94A" />
                  <circle cx="64" cy="55" r="13" fill="#5E7355" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm m-0 leading-tight truncate text-ink">
                  {product.title}
                </p>
                <p className="text-ink-soft text-xs m-0 mt-0.5 truncate">
                  {product.description}
                </p>
              </div>
              <span className="font-[family-name:var(--font-space-mono)] text-berry-deep text-sm font-bold shrink-0">
                {formatPrice(product.price)}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}