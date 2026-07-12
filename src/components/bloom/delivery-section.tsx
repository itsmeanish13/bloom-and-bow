'use client'

import { Truck, Clock, MapPin } from 'lucide-react'

const AREAS = [
  { zone: 'Central Kathmandu', areas: 'Thamel, Lazimpat, Baluwatar, Sanepa, Jawalakhel, Pulchowk' },
  { zone: 'East Kathmandu', areas: 'Baneshwor, Koteshwor, Chabahil, Boudha, Gyaneshwor' },
  { zone: 'West Kathmandu', areas: 'Kalanki, Kalimati, Teku, Tripureshwor, Swoyambhu' },
  { zone: 'Lalitpur', areas: 'Patan Durbar, Lagankhel, Satdobato, Khumaltar, Godawari' },
  { zone: 'Bhaktapur', areas: 'Bhaktapur Durbar, Suryabinayak, Madhyapur Thimi' },
]

export default function DeliverySection() {
  return (
    <section id="delivery" className="mb-[5.5rem]">
      <p className="font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.08em] uppercase text-ink-soft mb-4 mt-0">
        Delivery
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2
            className="font-[family-name:var(--font-fraunces)] font-semibold m-0 mb-6"
            style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}
          >
            Same-day across the valley
          </h2>
          <p className="text-ink-soft mb-8 mt-0 leading-relaxed">
            We deliver by bike and scooter — the way flowers should travel. Fast, gentle,
            and always with a handwritten note tucked in. Orders placed before 11 AM
            arrive the same afternoon.
          </p>
        </div>

        {/* Delivery info cards */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 bg-white rounded-[18px] border border-twine-light p-5">
            <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center shrink-0">
              <Truck size={18} className="text-sage" />
            </div>
            <div>
              <p className="font-bold text-sm m-0">Free delivery over Rs 1,000</p>
              <p className="text-ink-soft text-sm m-0 mt-0.5">Flat Rs 100 for orders under that</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white rounded-[18px] border border-twine-light p-5">
            <div className="w-10 h-10 rounded-full bg-berry/10 flex items-center justify-center shrink-0">
              <Clock size={18} className="text-berry" />
            </div>
            <div>
              <p className="font-bold text-sm m-0">Same-day &amp; next-day slots</p>
              <p className="text-ink-soft text-sm m-0 mt-0.5">Order by 11 AM for afternoon delivery</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white rounded-[18px] border border-twine-light p-5">
            <div className="w-10 h-10 rounded-full bg-butter/20 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-ink-soft" />
            </div>
            <div>
              <p className="font-bold text-sm m-0">Live delivery tracking</p>
              <p className="text-ink-soft text-sm m-0 mt-0.5">Know exactly when your gift arrives</p>
            </div>
          </div>
        </div>
      </div>

      {/* Areas list */}
      <div className="bg-white rounded-[18px] border border-twine-light p-6 md:p-8">
        <h3 className="font-[family-name:var(--font-fraunces)] font-semibold text-lg m-0 mb-5">
          We deliver to these areas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AREAS.map((zone) => (
            <div key={zone.zone}>
              <p className="font-bold text-sm m-0 mb-1">{zone.zone}</p>
              <p className="text-ink-soft text-sm m-0 leading-relaxed">{zone.areas}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-soft text-sm mt-5 mb-0 border-t border-twine-light pt-4">
          Don&apos;t see your area? <span className="font-bold text-ink cursor-pointer hover:text-berry transition-colors">Get in touch</span> — we might still be able to deliver.
        </p>
      </div>
    </section>
  )
}