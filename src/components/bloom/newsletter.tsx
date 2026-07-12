'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        toast.success("You're in! Check your inbox Friday.")
        setEmail('')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="border-[1.5px] border-dashed border-twine rounded-3xl p-12 max-[640px]:p-6 flex items-center justify-between gap-6 flex-wrap mb-[5.5rem]">
      <div className="min-w-[200px]">
        <h3 className="font-[family-name:var(--font-fraunces)] font-semibold text-[1.4rem] mb-1 mt-0">
          What&apos;s blooming this week
        </h3>
        <p className="text-ink-soft text-[0.92rem] m-0">
          One short note, every Friday. No spam, just flowers.
        </p>
      </div>

      <form
        className="flex gap-2.5 max-[640px]:w-full max-[640px]:flex-col"
        onSubmit={handleSubmit}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="font-[family-name:var(--font-karla)] px-4 py-3 rounded-full border-[1.5px] border-twine bg-white text-[0.92rem] min-w-[220px] max-[640px]:min-w-0 max-[640px]:flex-1 focus:border-ink focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 font-bold text-[0.95rem] px-7 py-3 rounded-full bg-berry text-white no-underline shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-berry-deep hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-8px_rgba(178,58,82,0.55)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer border-none"
        >
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
    </section>
  )
}