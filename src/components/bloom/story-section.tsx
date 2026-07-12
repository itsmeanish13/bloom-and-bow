'use client'

export default function StorySection() {
  return (
    <section className="bg-sage rounded-[28px] px-12 py-[5.5rem] grid grid-cols-[0.7fr_1.3fr] max-[780px]:grid-cols-1 gap-12 max-[780px]:gap-8 items-center text-white mb-[5.5rem]">
      {/* Seal */}
      <div
        className="rounded-full bg-berry flex items-center justify-center font-[family-name:var(--font-fraunces)] text-[1.6rem] shrink-0 max-[780px]:mx-auto"
        style={{
          width: 84,
          height: 84,
          fontStyle: 'italic',
          boxShadow: '0 10px 24px -10px rgba(0,0,0,0.35)',
        }}
      >
        B&amp;B
      </div>

      {/* Quote */}
      <div>
        <blockquote
          className="font-[family-name:var(--font-fraunces)] m-0 mb-4"
          style={{
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
            lineHeight: 1.35,
          }}
        >
          &ldquo;We started in a kitchen with three buckets and a bike. The
          bike&apos;s still how most orders leave the shop.&rdquo;
        </blockquote>
        <cite className="font-[family-name:var(--font-space-mono)] text-[0.8rem] not-italic opacity-85">
          — Nirmala, founder, Bloom &amp; Bow
        </cite>
      </div>
    </section>
  )
}