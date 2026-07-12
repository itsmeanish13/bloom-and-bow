'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Navbar from '@/components/bloom/navbar'
import Hero from '@/components/bloom/hero'
import VineDivider from '@/components/bloom/vine-divider'
import Occasions from '@/components/bloom/occasions'
import ProductGrid from '@/components/bloom/product-grid'
import StorySection from '@/components/bloom/story-section'
import Newsletter from '@/components/bloom/newsletter'
import Footer from '@/components/bloom/footer'
import CartDrawer from '@/components/bloom/cart-drawer'
import SearchDialog from '@/components/bloom/search-dialog'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/lib/types'
import { toast } from 'sonner'

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const addItem = useCartStore((s) => s.addItem)

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams()
        if (selectedOccasion) params.set('occasion', selectedOccasion)
        if (selectedCategory) params.set('category', selectedCategory)
        const query = params.toString()
        const url = `/api/products${query ? `?${query}` : ''}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch {
        // Silently fail — products will be empty
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedOccasion, selectedCategory])

  const handleAdd = useCallback(
    (product: Product) => {
      addItem(product)
      toast.success(`${product.title} added to cart`)
    },
    [addItem]
  )

  const handleOccasionSelect = useCallback(
    (occasion: string | null) => {
      setSelectedOccasion(occasion)
      setSelectedCategory(null)
    },
    []
  )

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[1180px] mx-auto px-6 w-full">
        <Navbar
          onCartOpen={() => setCartOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
        />
      </div>

      <main className="max-w-[1180px] mx-auto px-6 w-full">
        <Hero />
        <VineDivider />

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => { setSelectedCategory(null); setSelectedOccasion(null) }}
            className={`font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.06em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
              !selectedCategory
                ? 'bg-ink text-paper border-ink'
                : 'bg-transparent text-ink-soft border-twine hover:border-ink'
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setSelectedCategory('flowers'); setSelectedOccasion(null) }}
            className={`font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.06em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
              selectedCategory === 'flowers'
                ? 'bg-ink text-paper border-ink'
                : 'bg-transparent text-ink-soft border-twine hover:border-ink'
            }`}
          >
            Flowers
          </button>
          <button
            onClick={() => { setSelectedCategory('gifts'); setSelectedOccasion(null) }}
            className={`font-[family-name:var(--font-space-mono)] text-[0.72rem] tracking-[0.06em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
              selectedCategory === 'gifts'
                ? 'bg-ink text-paper border-ink'
                : 'bg-transparent text-ink-soft border-twine hover:border-ink'
            }`}
          >
            Little Gifts
          </button>
        </div>

        <Occasions
          selected={selectedOccasion}
          onSelect={handleOccasionSelect}
        />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-twine border-t-berry rounded-full animate-spin" />
          </div>
        ) : (
          <ProductGrid products={products} onAdd={handleAdd} />
        )}

        <StorySection />
        <Newsletter />
      </main>

      <div className="mt-auto">
        <Footer />
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        products={products}
      />
    </div>
  )
}