import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useCategories } from '@/hooks/useCategories'

export function Header() {
  const { getCartCount, openCart } = useCart()
  const { data: categories = [] } = useCategories()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const cartCount = getCartCount()

  const visibleCategories = categories.slice(0, 5)
  const hasMore = categories.length > 5

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-2xl font-bold text-foreground tracking-tight">
              Zai<span style={{ color: 'var(--color-primary)' }}>Wear</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location.pathname === '/' ? 'text-foreground font-semibold' : 'text-muted-foreground'
              }`}
            >
              Início
            </Link>
            {visibleCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  location.pathname === `/categoria/${cat.slug}`
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                {cat.name}
              </Link>
            ))}
            {hasMore && (
              <Link
                to="/categorias"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver Todas
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
              aria-label="Carrinho de compras"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-fade-in">
          <div className="container-custom py-4 flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              Início
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                {cat.name}
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
