'use client'

import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

export default function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return
    setSending(true)
    // Simulate send
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Message sent! We\'ll get back to you soon.')
    setName('')
    setEmail('')
    setMessage('')
    setSending(false)
  }

  return (
    <section id="contact" className="mb-[5.5rem]">
      <p className="font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.08em] uppercase text-ink-soft mb-4 mt-0">
        Get in touch
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div>
          <h2
            className="font-[family-name:var(--font-fraunces)] font-semibold m-0 mb-6"
            style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.1rem)' }}
          >
            We&apos;d love to hear from you
          </h2>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-paper-warm flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={16} className="text-sage" />
              </div>
              <div>
                <p className="font-bold text-sm m-0">Call or WhatsApp</p>
                <p className="text-ink-soft text-sm m-0 mt-0.5">+977 9801-234567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-paper-warm flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={16} className="text-berry" />
              </div>
              <div>
                <p className="font-bold text-sm m-0">Email</p>
                <p className="text-ink-soft text-sm m-0 mt-0.5">hello@bloomandbow.np</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-paper-warm flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={16} className="text-butter" />
              </div>
              <div>
                <p className="font-bold text-sm m-0">Visit the studio</p>
                <p className="text-ink-soft text-sm m-0 mt-0.5">
                  Jawalakhel, Lalitpur<br />
                  Open daily 9 AM – 7 PM
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-paper-warm flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={16} className="text-sage-deep" />
              </div>
              <div>
                <p className="font-bold text-sm m-0">Same-day delivery</p>
                <p className="text-ink-soft text-sm m-0 mt-0.5">
                  Order before 11 AM for same-day delivery across the valley
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[18px] border border-twine-light p-6 md:p-8 flex flex-col gap-4"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-bold mb-1.5">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full font-[family-name:var(--font-karla)] px-4 py-3 rounded-xl border border-twine bg-paper text-sm focus:border-ink focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-bold mb-1.5">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full font-[family-name:var(--font-karla)] px-4 py-3 rounded-xl border border-twine bg-paper text-sm focus:border-ink focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-bold mb-1.5">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you need..."
              className="w-full font-[family-name:var(--font-karla)] px-4 py-3 rounded-xl border border-twine bg-paper text-sm focus:border-ink focus:outline-none transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 font-bold text-[0.95rem] px-7 py-3.5 rounded-full bg-berry text-white border-none shadow-[0_1px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-berry-deep hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-8px_rgba(178,58,82,0.55)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer self-end"
          >
            <Send size={16} />
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}