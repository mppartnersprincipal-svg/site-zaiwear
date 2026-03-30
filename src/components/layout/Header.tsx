import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useCategories } from '@/hooks/useCategories'

export function Header() {
  const { getCartCount, openCart } = useCart()
  const { data: categories = [] } = useCategories()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const cartCount = getCartCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // fecha dropdown ao navegar
  useEffect(() => {
    setShopOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => location.pathname === path

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_12px_rgba(0,0,0,0.07)]' : 'border-b border-border'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-[70px]">

          {/* ── Left Nav (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              to="/"
              className={`text-[13px] font-medium tracking-wide transition-colors ${
                isActive('/') ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              INÍCIO
            </Link>

            {/* Shop dropdown */}
            <div className="relative" onMouseLeave={() => setShopOpen(false)}>
              <button
                onMouseEnter={() => setShopOpen(true)}
                className={`flex items-center gap-1 text-[13px] font-medium tracking-wide transition-colors ${
                  location.pathname.startsWith('/categoria') || location.pathname === '/categorias'
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                LOJA
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {shopOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-border rounded-xl shadow-lg py-2 animate-fade-in">
                  <Link
                    to="/categorias"
                    className="flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Todas as Categorias
                  </Link>
                  <hr className="my-1 border-border" />
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/categoria/${cat.slug}`}
                      className="flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* ── Logo (center) ── */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 shrink-0"
          >
            <span className="font-display text-[1.6rem] font-bold tracking-tight text-foreground">
              Zai<span style={{ color: 'var(--color-accent)' }}>Wear</span>
            </span>
          </Link>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1">
            {/* Search (placeholder) */}
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative hidden sm:flex items-center gap-2 border border-border hover:border-foreground text-foreground px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ml-1"
              aria-label="Carrinho"
            >
              <ShoppingBag size={15} />
              MEU CARRINHO
              {cartCount > 0 && (
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Cart icon (mobile) */}
            <button
              onClick={openCart}
              className="relative sm:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 rounded-full text-white text-[9px] font-bold"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-fade-in">
          <div className="container-custom py-4 flex flex-col gap-0.5">
            <Link
              to="/"
              className="py-3 px-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
            >
              Início
            </Link>
            <Link
              to="/categorias"
              className="py-3 px-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors"
              style={{ color: 'var(--color-accent)' }}
            >
              Todas as Categorias
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="py-2.5 px-3 text-sm text-muted-foreground font-medium rounded-lg hover:bg-muted hover:text-foreground transition-colors pl-6"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
