'use client'

import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const totalItems = useCartStore((s) => s.totalItems)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-paper border-twine-light w-full sm:max-w-sm flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="font-[family-name:var(--font-fraunces)] text-ink">
            Your cart
          </SheetTitle>
          <SheetDescription className="text-ink-soft">
            {totalItems()} {totalItems() === 1 ? 'item' : 'items'}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-ink-soft gap-4">
            <ShoppingBag size={48} strokeWidth={1.2} className="text-twine" />
            <p className="text-center">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-1 px-1">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start gap-3 py-4 border-b border-twine-light last:border-b-0"
                >
                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm m-0 leading-tight truncate">
                      {item.product.title}
                    </h4>
                    <p className="font-[family-name:var(--font-space-mono)] text-berry-deep text-sm mt-1 m-0">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      className="w-7 h-7 rounded-full border border-twine bg-white flex items-center justify-center cursor-pointer text-xs hover:bg-paper-warm transition-colors"
                      onClick={() =>
                        updateQty(item.product.id, item.qty - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-[family-name:var(--font-space-mono)] text-sm w-5 text-center">
                      {item.qty}
                    </span>
                    <button
                      className="w-7 h-7 rounded-full border border-twine bg-white flex items-center justify-center cursor-pointer text-xs hover:bg-paper-warm transition-colors"
                      onClick={() =>
                        updateQty(item.product.id, item.qty + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      className="w-7 h-7 rounded-full border-none bg-transparent flex items-center justify-center cursor-pointer text-xs text-ink-soft hover:text-berry transition-colors ml-1"
                      onClick={() => removeItem(item.product.id)}
                      aria-label={`Remove ${item.product.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t border-twine-light pt-4">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-medium text-ink-soft">Total</span>
                <span className="font-[family-name:var(--font-space-mono)] font-bold text-berry-deep text-lg">
                  {formatPrice(totalPrice())}
                </span>
              </div>
              <button
                className="w-full inline-flex items-center justify-center gap-2 font-bold text-[0.95rem] px-7 py-3.5 rounded-full bg-berry text-white border-none cursor-pointer shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-berry-deep hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-8px_rgba(178,58,82,0.55)] active:translate-y-0"
              >
                Proceed to checkout
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}