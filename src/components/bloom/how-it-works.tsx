'use client'

import { Scissors, Package, Truck } from 'lucide-react'

const STEPS = [
  {
    icon: Scissors,
    title: 'You pick',
    description: 'Choose from our weekly selection of seasonal flowers and hand-crafted gifts.',
    color: 'bg-berry',
    step: '01',
  },
  {
    icon: Package,
    title: 'We wrap',
    description: 'Each bouquet is hand-tied in kraft paper with a handwritten note, the same afternoon.',
    color: 'bg-sage',
    step: '02',
  },
  {
    icon: Truck,
    title: 'Delivered today',
    description: 'Riding by bike across the valley — fast, gentle, and always with care.',
    color: 'bg-butter',
    step: '03',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mb-[5.5rem]">
      <p className="font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.08em] uppercase text-ink-soft mb-4 mt-0">
        How it works
      </p>
      <h2
        className="font-[family-name:var(--font-fraunces)] font-semibold m-0 mb-10"
        style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}
      >
        From stem to doorstep
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((s, i) => (
          <div
            key={s.step}
            className="bg-white rounded-[18px] border border-twine-light p-6 relative"
          >
            {/* Step number */}
            <span className="absolute top-4 right-5 font-[family-name:var(--font-space-mono)] text-[0.72rem] text-twine tracking-[0.06em] uppercase">
              {s.step}
            </span>

            {/* Icon */}
            <div className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center mb-5`}>
              <s.icon size={20} className="text-white" />
            </div>

            <h3 className="font-[family-name:var(--font-fraunces)] font-semibold text-lg m-0 mb-2">
              {s.title}
            </h3>
            <p className="text-ink-soft text-sm m-0 leading-relaxed">
              {s.description}
            </p>

            {/* Connector line (not on last) */}
            {i < STEPS.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-twine" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}