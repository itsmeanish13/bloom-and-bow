'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '@/components/bloom/navbar'
import Hero from '@/components/bloom/hero'
import VineDivider from '@/components/bloom/vine-divider'
import Occasions from '@/components/bloom/occasions'
import ProductGrid from '@/components/bloom/product-grid'
import StorySection from '@/components/bloom/story-section'
import HowItWorks from '@/components/bloom/how-it-works'
import DeliverySection from '@/components/bloom/delivery-section'
import ContactSection from '@/components/bloom/contact-section'
import CareersSection from '@/components/bloom/careers-section'
import Newsletter from '@/components/bloom/newsletter'
import Footer from '@/components/bloom/footer'
import CartDrawer from '@/components/bloom/cart-drawer'
import SearchDialog from '@/components/bloom/search-dialog'
import BuildBouquetDialog from '@/components/bloom/build-bouquet-dialog'
import TrackOrderDialog from '@/components/bloom/track-order-dialog'
import AdminPanel from '@/components/bloom/admin-panel'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/lib/types'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bouquetOpen, setBouquetOpen] = useState(false)
  const [trackOrderOpen, setTrackOrderOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const addItem = useCartStore((s) => s.addItem)

  // Section refs for scrolling
  const refTop = useRef<HTMLDivElement>(null)
  const refProducts = useRef<HTMLDivElement>(null)
  const refOccasions = useRef<HTMLDivElement>(null)
  const refStory = useRef<HTMLDivElement>(null)
  const refDelivery = useRef<HTMLDivElement>(null)
  const refContact = useRef<HTMLDivElement>(null)
  const refCareers = useRef<HTMLDivElement>(null)

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch {
        // Silently fail — fall back to no category tabs
      }
    }
    fetchCategories()
  }, [])

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedOccasion) params.set('occasion', selectedOccasion)
        if (selectedCategoryId) params.set('categoryId', selectedCategoryId)
        const query = params.toString()
        const url = `/api/products${query ? `?${query}` : ''}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedOccasion, selectedCategoryId])

  // Smooth scroll helper
  function scrollToRef(ref: React.RefObject<HTMLDivElement | null>) {
    if (ref.current) {
      const offset = 80 // account for sticky nav
      const y = ref.current.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // Master navigation handler — called by Navbar, Footer, etc.
  const handleNavigate = useCallback(
    (action: string) => {
      switch (action) {
        case 'top':
          scrollToRef(refTop)
          break
        case 'flowers': {
          const flowersCat = categories.find(c => c.slug === 'flowers')
          if (flowersCat) {
            setSelectedCategoryId(flowersCat.id)
          }
          setSelectedOccasion(null)
          setTimeout(() => scrollToRef(refProducts), 100)
          break
        }
        case 'gifts': {
          const giftsCat = categories.find(c => c.slug === 'gifts')
          if (giftsCat) {
            setSelectedCategoryId(giftsCat.id)
          }
          setSelectedOccasion(null)
          setTimeout(() => scrollToRef(refProducts), 100)
          break
        }
        case 'occasions':
          setSelectedCategoryId(null)
          setSelectedOccasion(null)
          scrollToRef(refOccasions)
          break
        case 'story':
          scrollToRef(refStory)
          break
        case 'delivery':
          scrollToRef(refDelivery)
          break
        case 'contact':
          scrollToRef(refContact)
          break
        case 'careers':
          scrollToRef(refCareers)
          break
        case 'track-order':
          setTrackOrderOpen(true)
          break
        case 'build-bouquet':
          setBouquetOpen(true)
          break
        case 'admin':
          setAdminOpen(true)
          break
        default:
          break
      }
    },
    [categories]
  )

  const handleAdd = useCallback(
    (product: Product) => {
      addItem(product)
      toast.success(`${product.title} added to cart`)
    },
    [addItem]
  )

  const handleOccasionSelect = useCallback((occasion: string | null) => {
    setSelectedOccasion(occasion)
    setSelectedCategoryId(null)
  }, [])

  const handleBrowseShop = useCallback(() => {
    setSelectedCategoryId(null)
    setSelectedOccasion(null)
    setTimeout(() => scrollToRef(refProducts), 50)
  }, [])

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId)
    setSelectedOccasion(null)
  }, [])

  return (
    <div className="min-h-screen flex flex-col" ref={refTop}>
      <div className="max-w-[1180px] mx-auto px-6 w-full">
        <Navbar
          onCartOpen={() => setCartOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
          onNavigate={handleNavigate}
        />
      </div>

      <main className="max-w-[1180px] mx-auto px-6 w-full">
        <Hero
          onBrowseShop={handleBrowseShop}
          onBuildBouquet={() => setBouquetOpen(true)}
        />
        <VineDivider />

        {/* How It Works */}
        <HowItWorks />

        <VineDivider />

        {/* Dynamic Category filter tabs + Occasions */}
        <div ref={refProducts}>
          {categories.length > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.06em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                  !selectedCategoryId
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-transparent text-ink-soft border-twine hover:border-ink'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.06em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                    selectedCategoryId === cat.id
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-transparent text-ink-soft border-twine hover:border-ink'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <div ref={refOccasions}>
            <Occasions
              selected={selectedOccasion}
              onSelect={handleOccasionSelect}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-twine border-t-berry rounded-full animate-spin" />
            </div>
          ) : (
            <ProductGrid products={products} onAdd={handleAdd} />
          )}
        </div>

        {/* Story */}
        <div ref={refStory}>
          <StorySection />
        </div>

        {/* Delivery Areas */}
        <div ref={refDelivery}>
          <DeliverySection />
        </div>

        {/* Contact */}
        <div ref={refContact}>
          <ContactSection />
        </div>

        {/* Careers */}
        <div ref={refCareers}>
          <CareersSection />
        </div>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <div className="mt-auto">
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Dialogs / Drawers */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        products={products}
      />
      <BuildBouquetDialog
        open={bouquetOpen}
        onOpenChange={setBouquetOpen}
        products={products}
      />
      <TrackOrderDialog
        open={trackOrderOpen}
        onOpenChange={setTrackOrderOpen}
      />

      {/* Admin Panel Overlay */}
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  )
}