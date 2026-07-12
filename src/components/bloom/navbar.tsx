'use client'

import { useState } from 'react'
import { Search, ShoppingBag, Menu } from 'lucide-react'
import BrandMark from './brand-mark'
import { useCartStore } from '@/store/cart-store'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface NavItem {
  label: string
  action: string // key for the onNavigate callback
}

const NAV_LINKS: NavItem[] = [
  { label: 'Flowers', action: 'flowers' },
  { label: 'Little Gifts', action: 'gifts' },
  { label: 'Occasions', action: 'occasions' },
  { label: 'Our Story', action: 'story' },
]

interface NavbarProps {
  onCartOpen: () => void
  onSearchOpen: () => void
  onNavigate: (action: string) => void
}

export default function Navbar({ onCartOpen, onSearchOpen, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)

  function handleNavClick(action: string) {
    setMobileOpen(false)
    onNavigate(action)
  }

  return (
    <nav className="flex items-center justify-between py-6">
      {/* Brand */}
      <button
        onClick={() => handleNavClick('top')}
        className="flex items-center gap-2.5 shrink-0 bg-transparent border-none cursor-pointer p-0"
        aria-label="Go to top"
      >
        <BrandMark className="shrink-0" />
        <span className="font-[family-name:var(--font-fraunces)] font-semibold text-[1.35rem] tracking-[-0.01em] text-ink">
          Bloom &amp; Bow
        </span>
      </button>

      {/* Desktop nav links */}
      <ul className="max-[780px]:hidden flex items-center gap-12 list-none p-0 m-0 text-[0.95rem]">
        {NAV_LINKS.map((link) => (
          <li key={link.action}>
            <button
              onClick={() => handleNavClick(link.action)}
              className="nav-link relative bg-transparent border-none cursor-pointer p-0 pb-1 text-ink font-medium text-[0.95rem]"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Desktop actions */}
      <div className="max-[780px]:hidden flex items-center gap-6">
        <button
          className="bg-transparent border-none cursor-pointer text-ink p-1.5 rounded-lg hover:bg-twine-light transition-colors"
          aria-label="Search"
          onClick={onSearchOpen}
        >
          <Search size={20} />
        </button>
        <button
          className="bg-transparent border-none cursor-pointer text-ink p-1.5 rounded-lg hover:bg-twine-light transition-colors relative"
          aria-label={`Cart, ${totalItems()} items`}
          onClick={onCartOpen}
        >
          <ShoppingBag size={20} />
          {totalItems() > 0 && (
            <span className="inline-flex items-center justify-center bg-berry text-white font-[family-name:var(--font-space-mono)] text-[0.65rem] w-4 h-4 rounded-full absolute -top-2 -left-2">
              {totalItems()}
            </span>
          )}
        </button>
      </div>

      {/* Mobile: hamburger + actions */}
      <div className="hidden max-[780px]:flex items-center gap-4">
        <button
          className="bg-transparent border-none cursor-pointer text-ink p-1.5 rounded-lg hover:bg-twine-light transition-colors"
          aria-label="Search"
          onClick={onSearchOpen}
        >
          <Search size={20} />
        </button>
        <button
          className="bg-transparent border-none cursor-pointer text-ink p-1.5 rounded-lg hover:bg-twine-light transition-colors relative"
          aria-label={`Cart, ${totalItems()} items`}
          onClick={onCartOpen}
        >
          <ShoppingBag size={20} />
          {totalItems() > 0 && (
            <span className="inline-flex items-center justify-center bg-berry text-white font-[family-name:var(--font-space-mono)] text-[0.65rem] w-4 h-4 rounded-full absolute -top-2 -left-2">
              {totalItems()}
            </span>
          )}
        </button>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className="bg-transparent border-none cursor-pointer text-ink p-1.5 rounded-lg hover:bg-twine-light transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-paper w-72 sm:max-w-xs border-twine-light">
            <SheetHeader>
              <SheetTitle className="font-[family-name:var(--font-fraunces)] text-ink">
                Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.action}
                  onClick={() => handleNavClick(link.action)}
                  className="px-3 py-2.5 rounded-lg text-ink font-medium hover:bg-paper-warm transition-colors cursor-pointer bg-transparent border-none text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}