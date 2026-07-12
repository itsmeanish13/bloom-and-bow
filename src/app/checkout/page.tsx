'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Truck, Gift, CheckCircle2, ShoppingBag, MapPin, Phone, User, FileText } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { formatPrice, type Product } from '@/lib/types'
import { toast } from 'sonner'

const DELIVERY_SLOTS = [
  { value: 'same_day', label: 'Same Day', desc: 'Order before 2 PM' },
  { value: 'next_day', label: 'Next Day', desc: 'Delivered tomorrow' },
  { value: 'scheduled', label: 'Schedule', desc: 'Pick a date' },
] as const

type OrderStep = 'form' | 'success'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice)
  const totalItems = useCartStore((s) => s.totalItems)
  const clearCart = useCartStore((s) => s.clearCart)

  const [step, setStep] = useState<OrderStep>('form')
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')

  // Form state
  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '',
    address: '',
    city: 'Kathmandu',
    landmark: '',
    giftNote: '',
    deliverySlot: 'same_day',
    paymentMethod: 'cod',
  })

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function getDeliveryFee() {
    if (totalPrice() >= 200000) return 0 // Free delivery over Rs 2,000
    return 5000 // Rs 50 delivery
  }

  function getGrandTotal() {
    return totalPrice() + getDeliveryFee()
  }

  async function handlePlaceOrder() {
    // Validate
    if (!form.recipientName.trim()) {
      toast.error('Please enter the recipient name')
      return
    }
    if (!form.recipientPhone.trim() || form.recipientPhone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    if (!form.address.trim()) {
      toast.error('Please enter the delivery address')
      return
    }
    if (form.deliverySlot === 'scheduled' && !scheduledDate) {
      toast.error('Please select a delivery date')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          qty: item.qty,
        })),
        recipientName: form.recipientName.trim(),
        recipientPhone: form.recipientPhone.trim(),
        address: form.address.trim(),
        city: form.city,
        landmark: form.landmark.trim() || null,
        giftNote: form.giftNote.trim() || null,
        deliverySlot: form.deliverySlot === 'scheduled' ? `scheduled:${scheduledDate}` : form.deliverySlot,
        paymentMethod: form.paymentMethod,
        totalAmount: getGrandTotal(),
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Order failed')
      }

      const data = await res.json()
      setOrderNumber(data.orderNumber)
      clearCart()
      setStep('success')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Success state
  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-sage" />
          </div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-ink m-0 mb-2">
            Order placed!
          </h1>
          <p className="text-ink-soft mb-2">
            Your order <span className="font-[family-name:var(--font-space-mono)] font-bold text-ink">{orderNumber}</span> has been confirmed.
          </p>
          <p className="text-ink-soft text-sm mb-8">
            We&apos;ll send a confirmation to the phone number provided. 
            {form.paymentMethod === 'cod' && ' Please keep cash ready for delivery.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="font-bold text-[0.95rem] px-7 py-3 rounded-full bg-berry text-white border-none cursor-pointer hover:bg-berry-deep transition-colors"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper gap-6 px-6">
        <ShoppingBag size={56} strokeWidth={1.2} className="text-twine" />
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink m-0">
          Your cart is empty
        </h1>
        <button
          onClick={() => router.push('/')}
          className="font-bold text-[0.95rem] px-7 py-3 rounded-full bg-ink text-paper border-none cursor-pointer hover:bg-ink/90 transition-colors"
        >
          Browse the shop
        </button>
      </div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-twine bg-white text-[0.92rem] focus:border-ink focus:outline-none transition-colors font-[family-name:var(--font-karla)] placeholder:text-ink-soft/60'
  const labelClass = 'text-sm font-bold text-ink mb-1.5 block'

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {/* Top bar */}
      <div className="max-w-[1180px] mx-auto px-6 w-full py-5">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors bg-transparent border-none cursor-pointer text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to shop
        </button>
      </div>

      <main className="max-w-[1180px] mx-auto px-6 w-full flex-1 pb-20">
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-ink m-0 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form - 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            {/* Recipient info */}
            <section className="bg-white rounded-2xl border border-twine-light p-6">
              <h2 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink m-0 mb-5 flex items-center gap-2">
                <User size={18} className="text-berry" />
                Recipient details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Ram Bahadur"
                    value={form.recipientName}
                    onChange={(e) => updateField('recipientName', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. 98XXXXXXXX"
                    value={form.recipientPhone}
                    onChange={(e) => updateField('recipientPhone', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Delivery address */}
            <section className="bg-white rounded-2xl border border-twine-light p-6">
              <h2 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink m-0 mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-berry" />
                Delivery address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full address *</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. House #12, Street Name, Ward #5, Lalitpur"
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className={inputClass + ' resize-none'}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <select
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className={inputClass}
                    >
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Pokhara">Pokhara</option>
                      <option value="Chitwan">Chitwan</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Bhatbhateni"
                      value={form.landmark}
                      onChange={(e) => updateField('landmark', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery slot */}
            <section className="bg-white rounded-2xl border border-twine-light p-6">
              <h2 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink m-0 mb-5 flex items-center gap-2">
                <Truck size={18} className="text-berry" />
                Delivery slot
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {DELIVERY_SLOTS.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => updateField('deliverySlot', slot.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      form.deliverySlot === slot.value
                        ? 'border-ink bg-paper-warm'
                        : 'border-twine-light bg-white hover:border-twine'
                    }`}
                  >
                    <p className="font-bold text-sm m-0 text-ink">{slot.label}</p>
                    <p className="text-xs text-ink-soft m-0 mt-0.5">{slot.desc}</p>
                  </button>
                ))}
              </div>

              {form.deliverySlot === 'scheduled' && (
                <div className="mt-4">
                  <label className={labelClass}>Delivery date</label>
                  <input
                    type="date"
                    min={new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </section>

            {/* Gift note */}
            <section className="bg-white rounded-2xl border border-twine-light p-6">
              <h2 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink m-0 mb-5 flex items-center gap-2">
                <FileText size={18} className="text-berry" />
                Gift note
                <span className="text-xs text-ink-soft font-normal">(optional)</span>
              </h2>
              <textarea
                rows={3}
                placeholder="Write a heartfelt message for the recipient..."
                value={form.giftNote}
                onChange={(e) => updateField('giftNote', e.target.value)}
                className={inputClass + ' resize-none'}
              />
            </section>
          </div>

          {/* Order summary - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-twine-light p-6 sticky top-6">
              <h2 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-ink m-0 mb-5">
                Order summary
              </h2>

              {/* Items */}
              <div className="max-h-64 overflow-y-auto custom-scrollbar -mx-1 px-1">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between py-3 border-b border-twine-light last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm m-0 leading-tight truncate">
                        {item.product.title}
                      </p>
                      <p className="text-ink-soft text-xs m-0 mt-0.5">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <span className="font-[family-name:var(--font-space-mono)] text-sm font-bold text-ink shrink-0 ml-3">
                      {formatPrice(item.product.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-twine-light mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-soft">Subtotal ({totalItems()} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-soft">Delivery</span>
                  <span className="font-medium">
                    {getDeliveryFee() === 0 ? (
                      <span className="text-sage">Free</span>
                    ) : (
                      formatPrice(getDeliveryFee())
                    )}
                  </span>
                </div>
                {getDeliveryFee() > 0 && (
                  <p className="text-xs text-ink-soft m-0">
                    Free delivery on orders above {formatPrice(200000)}
                  </p>
                )}
                <div className="flex justify-between pt-2 border-t border-twine-light">
                  <span className="font-bold">Total</span>
                  <span className="font-[family-name:var(--font-space-mono)] font-bold text-berry-deep text-lg">
                    {formatPrice(getGrandTotal())}
                  </span>
                </div>
              </div>

              {/* Payment method */}
              <div className="mt-5 p-4 rounded-xl bg-paper-warm border border-twine-light">
                <p className="text-sm font-bold text-ink m-0 mb-2">Payment method</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ink text-paper flex items-center justify-center">
                    <span className="font-[family-name:var(--font-space-mono)] text-xs font-bold">COD</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold m-0 text-ink">Cash on Delivery</p>
                    <p className="text-xs text-ink-soft m-0">Pay when you receive</p>
                  </div>
                </div>
              </div>

              {/* Place order button */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full mt-5 inline-flex items-center justify-center gap-2 font-bold text-[0.95rem] px-7 py-3.5 rounded-full bg-berry text-white border-none cursor-pointer shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-berry-deep hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-8px_rgba(178,58,82,0.55)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing order…
                  </>
                ) : (
                  <>
                    <Gift size={18} />
                    Place order &middot; {formatPrice(getGrandTotal())}
                  </>
                )}
              </button>

              <p className="text-xs text-ink-soft text-center mt-3 m-0">
                By placing this order, you agree to our delivery terms.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}