'use client'

import { useState } from 'react'
import { Search, Package } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const MOCK_ORDER = {
  orderNumber: 'BB-2026-0042',
  status: 'out_for_delivery',
  statusHistory: [
    { status: 'Order Placed', time: 'Today, 9:15 AM', icon: '🛒' },
    { status: 'Being Arranged', time: 'Today, 10:02 AM', icon: '✂️' },
    { status: 'Out for Delivery', time: 'Today, 1:30 PM', icon: '🚲' },
  ],
  items: [
    { title: 'The Tuesday Bunch', qty: 1 },
    { title: 'Tiny Gift Box, Sunshine', qty: 1 },
  ],
  rider: 'Ram K.',
  eta: '30–45 min',
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  placed: { label: 'Placed', color: 'bg-twine' },
  confirmed: { label: 'Confirmed', color: 'bg-butter' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-sage' },
  delivered: { label: 'Delivered', color: 'bg-sage' },
  cancelled: { label: 'Cancelled', color: 'bg-berry' },
}

interface TrackOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TrackOrderDialog({
  open,
  onOpenChange,
}: TrackOrderDialogProps) {
  const [orderNumber, setOrderNumber] = useState('')
  const [tracking, setTracking] = useState(false)
  const [found, setFound] = useState(false)

  function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setTracking(true)
    // Simulate lookup — accept any input for demo
    setTimeout(() => {
      setTracking(false)
      setFound(true)
    }, 800)
  }

  function handleReset() {
    setOrderNumber('')
    setFound(false)
  }

  const statusInfo = STATUS_LABELS[MOCK_ORDER.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-paper border-twine-light rounded-2xl p-0 overflow-hidden max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-[family-name:var(--font-fraunces)] text-ink">
            Track your order
          </DialogTitle>
          <DialogDescription className="text-ink-soft">
            Enter your order number to see where your gift is.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          {!found ? (
            <form onSubmit={handleTrack} className="flex gap-2.5">
              <input
                type="text"
                placeholder="BB-2026-0042"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1 font-[family-name:var(--font-karla)] px-4 py-3 rounded-xl border border-twine bg-white text-sm focus:border-ink focus:outline-none transition-colors font-[family-name:var(--font-space-mono)]"
                autoFocus
              />
              <button
                type="submit"
                disabled={tracking || !orderNumber.trim()}
                className="inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-xl bg-ink text-paper border-none transition-all duration-200 hover:bg-ink/80 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {tracking ? (
                  <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                Track
              </button>
            </form>
          ) : (
            <div>
              {/* Order header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-[family-name:var(--font-space-mono)] text-sm text-ink-soft m-0">
                    Order
                  </p>
                  <p className="font-[family-name:var(--font-space-mono)] text-sm font-bold text-ink m-0">
                    {MOCK_ORDER.orderNumber}
                  </p>
                </div>
                <span className={`${statusInfo.color} text-white font-[family-name:var(--font-space-mono)] text-[0.65rem] px-3 py-1.5 rounded-full uppercase tracking-[0.04em]`}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Items */}
              <div className="bg-paper-warm rounded-xl p-4 mb-5">
                <p className="font-bold text-sm m-0 mb-2">Items</p>
                {MOCK_ORDER.items.map((item) => (
                  <div key={item.title} className="flex justify-between text-sm">
                    <span className="text-ink-soft">{item.title} ×{item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="flex flex-col gap-0 mb-5">
                {MOCK_ORDER.statusHistory.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    {i < MOCK_ORDER.statusHistory.length - 1 && (
                      <div className="absolute left-[15px] top-8 w-px h-6 bg-twine-light" />
                    )}
                    <div className="w-8 h-8 rounded-full bg-white border border-twine-light flex items-center justify-center shrink-0 text-sm">
                      {step.icon}
                    </div>
                    <div className="pt-1">
                      <p className="font-bold text-sm m-0">{step.status}</p>
                      <p className="text-ink-soft text-xs m-0">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rider info */}
              <div className="flex items-center gap-3 bg-sage/10 rounded-xl p-4">
                <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center">
                  <Package size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm m-0">Rider: {MOCK_ORDER.rider}</p>
                  <p className="text-ink-soft text-xs m-0">ETA: {MOCK_ORDER.eta}</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 text-sm text-ink-soft hover:text-ink transition-colors cursor-pointer bg-transparent border-none font-medium underline"
              >
                Track another order
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}