'use client'

import { useState } from 'react'
import { Check, Minus, Plus, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/types'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const BOUQUET_ADDONS = [
  { id: 'wrap-kraft', name: 'Kraft Paper Wrap', desc: 'Classic brown kraft, naturally beautiful', price: 0 },
  { id: 'wrap-linen', name: 'Linen Wrap', desc: 'Soft cream linen with a twine bow', price: 5000 },
  { id: 'note-handwritten', name: 'Handwritten Note', desc: 'We write your message by hand', price: 0 },
  { id: 'ribbon-sage', name: 'Sage Green Ribbon', desc: 'A touch of velvet ribbon', price: 3000 },
  { id: 'chocolate', name: 'Tiny Chocolate Bar', desc: 'Local bean-to-bar, tucked inside', price: 4500 },
  { id: 'spray-lavender', name: 'Lavender Mist', desc: 'A gentle spray before wrapping', price: 2000 },
]

interface BuildBouquetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: Product[]
}

export default function BuildBouquetDialog({
  open,
  onOpenChange,
  products,
}: BuildBouquetDialogProps) {
  const [selectedStems, setSelectedStems] = useState<string[]>([])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const flowerProducts = products.filter((p) => p.category === 'flowers')

  function toggleStem(id: string) {
    setSelectedStems((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
    setAdded(false)
  }

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
    setAdded(false)
  }

  const stemsTotal = flowerProducts
    .filter((p) => selectedStems.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0)

  const addonsTotal = BOUQUET_ADDONS
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0)

  const bouquetTotal = stemsTotal + addonsTotal

  function handleAddToCart() {
    if (selectedStems.length === 0) return
    addItem({
      id: 'custom-bouquet',
      slug: 'custom-bouquet',
      title: 'Your Custom Bouquet',
      description: `Hand-tied with ${selectedStems.length} stem${selectedStems.length > 1 ? 's' : ''} and ${selectedAddons.length} addon${selectedAddons.length > 1 ? 's' : ''}.`,
      category: 'flowers',
      occasions: [],
      price: bouquetTotal,
      imageUrl: null,
      stockStatus: 'made_to_order',
      badges: ['Custom'],
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setAdded(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-paper border-twine-light rounded-2xl p-0 overflow-hidden max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
          <DialogTitle className="font-[family-name:var(--font-fraunces)] text-ink flex items-center gap-2">
            <Sparkles size={20} className="text-butter" />
            Build a Bouquet
          </DialogTitle>
          <DialogDescription className="text-ink-soft">
            Pick your stems and add-ons. We&apos;ll tie it all up beautifully.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {/* Stems */}
          <p className="font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.06em] uppercase text-ink-soft mb-3 mt-0">
            Choose your stems
          </p>
          {selectedStems.length === 0 && (
            <p className="text-ink-soft text-sm mb-4">Pick at least one flower to start.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {flowerProducts.map((product) => {
              const isSelected = selectedStems.includes(product.id)
              return (
                <button
                  key={product.id}
                  onClick={() => toggleStem(product.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-sage bg-sage/5'
                      : 'border-twine-light bg-white hover:border-sage-deep'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-sage bg-sage' : 'border-twine'
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm m-0 truncate">{product.title}</p>
                    <p className="text-ink-soft text-xs m-0 truncate">{product.description}</p>
                  </div>
                  <span className="font-[family-name:var(--font-space-mono)] text-berry-deep text-xs font-bold shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Add-ons */}
          <p className="font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.06em] uppercase text-ink-soft mb-3 mt-0">
            Add-ons
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BOUQUET_ADDONS.map((addon) => {
              const isSelected = selectedAddons.includes(addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-berry bg-berry/5'
                      : 'border-twine-light bg-white hover:border-berry'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-berry bg-berry' : 'border-twine'
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm m-0">{addon.name}</p>
                    <p className="text-ink-soft text-xs m-0">{addon.desc}</p>
                  </div>
                  {addon.price > 0 && (
                    <span className="font-[family-name:var(--font-space-mono)] text-ink-soft text-xs shrink-0">
                      +{formatPrice(addon.price)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-twine-light px-6 py-4 shrink-0 flex items-center justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-space-mono)] text-sm text-ink-soft m-0">
              {selectedStems.length} stem{selectedStems.length !== 1 ? 's' : ''}
              {selectedAddons.length > 0 && ` + ${selectedAddons.length} add-on${selectedAddons.length !== 1 ? 's' : ''}`}
            </p>
            <p className="font-[family-name:var(--font-space-mono)] text-berry-deep font-bold text-lg m-0">
              {bouquetTotal > 0 ? formatPrice(bouquetTotal) : 'Rs 0'}
            </p>
          </div>
          <button
            disabled={selectedStems.length === 0 || added}
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 font-bold text-[0.95rem] px-7 py-3.5 rounded-full bg-berry text-white border-none shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-berry-deep hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-8px_rgba(178,58,82,0.55)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {added ? (
              <>
                <Check size={16} />
                Added!
              </>
            ) : (
              <>
                Add bouquet to cart
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}