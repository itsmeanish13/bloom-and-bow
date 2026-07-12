'use client'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper-warm pt-[5.5rem] pb-12">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] max-[780px]:grid-cols-2 gap-12 pb-12">
          {/* Brand column */}
          <div>
            <div className="font-[family-name:var(--font-fraunces)] text-[1.25rem] mb-4">
              Bloom &amp; Bow
            </div>
            <p className="text-[0.88rem] max-w-[30ch] m-0" style={{ color: '#A7AD9C' }}>
              Small bouquets and smaller gifts, delivered the same day, wrapped
              like they matter.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="font-[family-name:var(--font-space-mono)] text-[0.7rem] uppercase tracking-[0.08em] mb-4 mt-0"
              style={{ color: '#A7AD9C' }}
            >
              Shop
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Flowers</a></li>
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Gift Boxes</a></li>
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Occasions</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4
              className="font-[family-name:var(--font-space-mono)] text-[0.7rem] uppercase tracking-[0.08em] mb-4 mt-0"
              style={{ color: '#A7AD9C' }}
            >
              Help
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Delivery Areas</a></li>
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Track Order</a></li>
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h4
              className="font-[family-name:var(--font-space-mono)] text-[0.7rem] uppercase tracking-[0.08em] mb-4 mt-0"
              style={{ color: '#A7AD9C' }}
            >
              Studio
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Our Story</a></li>
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Careers</a></li>
              <li><a href="#" className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex justify-between flex-wrap gap-2.5 text-[0.8rem]"
          style={{ borderColor: '#3A4235', color: '#7D8471' }}
        >
          <span>&copy; 2026 Bloom &amp; Bow</span>
          <span>Made with care in the valley</span>
        </div>
      </div>
    </footer>
  )
}