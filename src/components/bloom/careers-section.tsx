'use client'

import { Heart, Leaf, Zap } from 'lucide-react'

const ROLES = [
  {
    title: 'Bouquet Designer',
    type: 'Part-time',
    description: 'Love flowers? Join us to hand-tie beautiful bouquets every morning. No experience needed — we\'ll teach you our style.',
    icon: Leaf,
  },
  {
    title: 'Delivery Rider',
    type: 'Full-time',
    description: 'Know the valley like the back of your hand? Ride for us and deliver happiness across Kathmandu, one bouquet at a time.',
    icon: Zap,
  },
  {
    title: 'Social Media & Content',
    type: 'Part-time / Intern',
    description: 'Help us tell our story on Instagram, TikTok, and beyond. If you can make flowers look good on camera, we want you.',
    icon: Heart,
  },
]

export default function CareersSection() {
  return (
    <section id="careers" className="mb-[5.5rem]">
      <p className="font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.08em] uppercase text-ink-soft mb-4 mt-0">
        Careers
      </p>
      <div className="mb-8">
        <h2
          className="font-[family-name:var(--font-fraunces)] font-semibold m-0 mb-4"
          style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}
        >
          Come work with us
        </h2>
        <p className="text-ink-soft max-w-[50ch] m-0 leading-relaxed">
          We&apos;re a small team that believes in doing a few things really well.
          If flowers, craft, and making people smile sound like your kind of thing,
          we&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ROLES.map((role) => (
          <div
            key={role.title}
            className="bb-card bg-white rounded-[18px] border border-twine-light p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-paper-warm flex items-center justify-center">
                <role.icon size={18} className="text-sage" />
              </div>
              <span className="font-[family-name:var(--font-space-mono)] text-[0.65rem] bg-paper-warm text-ink-soft px-2.5 py-1 rounded-full uppercase tracking-[0.04em]">
                {role.type}
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-fraunces)] font-semibold text-lg m-0 mb-2">
              {role.title}
            </h3>
            <p className="text-ink-soft text-sm m-0 leading-relaxed mb-5">
              {role.description}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-1 text-berry-deep font-bold text-sm no-underline hover:gap-2 transition-all duration-200"
            >
              Apply now &rarr;
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}