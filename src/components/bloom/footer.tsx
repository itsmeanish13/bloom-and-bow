'use client'

interface FooterProps {
  onNavigate: (action: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  function handleLink(action: string) {
    onNavigate(action)
  }

  return (
    <footer className="bg-ink text-paper-warm pt-[5.5rem] pb-12">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] max-[780px]:grid-cols-2 gap-12 pb-12">
          {/* Brand column */}
          <div>
            <button
              onClick={() => handleLink('top')}
              className="font-[family-name:var(--font-fraunces)] text-[1.25rem] mb-4 bg-transparent border-none cursor-pointer p-0 text-paper-warm hover:text-butter transition-colors text-left"
            >
              Bloom &amp; Bow
            </button>
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
              <li>
                <button
                  onClick={() => handleLink('flowers')}
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors bg-transparent border-none cursor-pointer p-0 font-normal"
                >
                  Flowers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('gifts')}
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors bg-transparent border-none cursor-pointer p-0 font-normal"
                >
                  Gift Boxes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('occasions')}
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors bg-transparent border-none cursor-pointer p-0 font-normal"
                >
                  Occasions
                </button>
              </li>
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
              <li>
                <button
                  onClick={() => handleLink('delivery')}
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors bg-transparent border-none cursor-pointer p-0 font-normal"
                >
                  Delivery Areas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('track-order')}
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors bg-transparent border-none cursor-pointer p-0 font-normal"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact')}
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors bg-transparent border-none cursor-pointer p-0 font-normal"
                >
                  Contact
                </button>
              </li>
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
              <li>
                <button
                  onClick={() => handleLink('story')}
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors bg-transparent border-none cursor-pointer p-0 font-normal"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('careers')}
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors bg-transparent border-none cursor-pointer p-0 font-normal"
                >
                  Careers
                </button>
              </li>
              <li>
                <a
                  href="https://instagram.com/bloomandbow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper-warm text-[0.92rem] no-underline hover:text-butter transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex justify-between flex-wrap gap-2.5 text-[0.8rem]"
          style={{ borderColor: '#3A4235', color: '#7D8471' }}
        >
          <span>&copy; 2026 Bloom &amp; Bow</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="text-[0.8rem] bg-transparent border-none cursor-pointer p-0 hover:text-butter transition-colors"
              style={{ color: '#7D8471' }}
            >
              Admin
            </button>
            <span>Made with care in the valley</span>
          </div>
        </div>
      </div>
    </footer>
  )
}