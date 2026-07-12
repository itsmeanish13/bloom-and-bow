'use client'

import { OCCASIONS } from '@/lib/types'

interface OccasionsProps {
  selected: string | null
  onSelect: (occasion: string | null) => void
}

export default function Occasions({ selected, onSelect }: OccasionsProps) {
  return (
    <section aria-label="Shop by occasion">
      <p className="font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.08em] uppercase text-ink-soft mb-4 mt-0">
        Shop by occasion
      </p>
      <div className="flex gap-2.5 flex-wrap pb-[5.5rem]">
        {/* "All" chip */}
        <button
          className={`text-[0.92rem] font-medium px-[18px] py-2.5 rounded-full border-[1.5px] cursor-pointer transition-all duration-200 ${
            selected === null
              ? 'bg-sage border-sage text-white'
              : 'bg-white border-twine text-ink hover:border-sage-deep hover:bg-paper-warm'
          }`}
          aria-pressed={selected === null}
          onClick={() => onSelect(null)}
        >
          All
        </button>

        {OCCASIONS.map((o) => (
          <button
            key={o.slug}
            className={`text-[0.92rem] font-medium px-[18px] py-2.5 rounded-full border-[1.5px] cursor-pointer transition-all duration-200 ${
              selected === o.slug
                ? 'bg-sage border-sage text-white'
                : 'bg-white border-twine text-ink hover:border-sage-deep hover:bg-paper-warm'
            }`}
            aria-pressed={selected === o.slug}
            onClick={() => onSelect(selected === o.slug ? null : o.slug)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </section>
  )
}