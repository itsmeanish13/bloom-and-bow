'use client'

interface HeroProps {
  onBrowseShop: () => void
  onBuildBouquet: () => void
}

export default function Hero({ onBrowseShop, onBuildBouquet }: HeroProps) {
  return (
    <header className="grid grid-cols-[1.05fr_0.95fr] max-[900px]:grid-cols-1 items-center gap-[5.5rem] max-[900px]:gap-8 py-12 pb-[5.5rem] max-[900px]:pb-12">
      {/* Left column — text */}
      <div className="max-[900px]:order-last">
        {/* Eyebrow tag */}
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.06em] uppercase text-berry-deep bg-white border border-dashed border-twine px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          Today&apos;s pick — No. 014
        </span>

        {/* H1 */}
        <h1
          className="font-[family-name:var(--font-fraunces)] font-semibold leading-[1.06] tracking-[-0.015em] mb-6 m-0"
          style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)' }}
        >
          Say it with
          <br />
          something{' '}
          <em className="font-medium text-berry" style={{ fontStyle: 'italic' }}>
            small
          </em>
          <br />
          and alive.
        </h1>

        {/* Subtitle */}
        <p className="text-[1.08rem] text-ink-soft max-w-[42ch] mb-12 mt-0">
          Hand-tied bouquets and pocket-sized gifts, wrapped the same
          afternoon they&apos;re cut. Same-day delivery across the valley.
        </p>

        {/* CTA buttons */}
        <div className="flex gap-4 items-center flex-wrap">
          <button
            onClick={onBrowseShop}
            className="inline-flex items-center gap-2 font-bold text-[0.95rem] px-7 py-3.5 rounded-full bg-berry text-white no-underline shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-berry-deep hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-8px_rgba(178,58,82,0.55)] active:translate-y-0 cursor-pointer border-none"
          >
            Browse the shop &rarr;
          </button>
          <button
            onClick={onBuildBouquet}
            className="inline-flex items-center gap-2 font-bold text-[0.95rem] px-7 py-3.5 rounded-full bg-transparent text-ink border-[1.5px] border-twine cursor-pointer transition-all duration-200 hover:border-ink hover:bg-paper-warm"
          >
            Build a bouquet
          </button>
        </div>
      </div>

      {/* Right column — art (reorder on mobile, goes first) */}
      <div className="max-[900px]:order-first relative bg-paper-warm rounded-[28px] p-12 flex items-center justify-center min-h-[380px] max-[900px]:min-h-[260px] max-[900px]:p-8">
        {/* Bouquet SVG */}
        <svg
          width="220"
          height="240"
          viewBox="0 0 220 240"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M110 240V120"
            stroke="#7C9473"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <ellipse cx="110" cy="70" rx="46" ry="52" fill="#B23A52" />
          <ellipse cx="70" cy="95" rx="34" ry="40" fill="#EFB94A" />
          <ellipse cx="150" cy="95" rx="34" ry="40" fill="#5E7355" />
          <circle cx="110" cy="80" r="14" fill="#FAF6F0" />
          <path
            d="M60 150c30-14 70-14 100 0v18c-30 14-70 14-100 0v-18z"
            fill="#F3ECDF"
            stroke="#C9BBA1"
            strokeWidth="1.5"
          />
        </svg>

        {/* Price tag */}
        <div className="absolute top-5 -right-3.5 bg-white border-[1.5px] border-ink rounded-[10px] px-4 py-2.5 font-[family-name:var(--font-space-mono)] text-[0.8rem] rotate-[6deg] shadow-[3px_4px_0_#C9BBA1]">
          <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-paper border-[1.5px] border-ink" />
          from <span className="text-berry-deep font-bold">Rs 650</span>
        </div>
      </div>
    </header>
  )
}