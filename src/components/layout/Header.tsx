import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useCategories } from '@/hooks/useCategories'

export function Header() {
  const { getCartCount, openCart } = useCart()
  const { data: categories = [] } = useCategories()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const location = useLocation()
  const cartCount = getCartCount()

  useEffect(() => {
    setShopOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  const isCollections =
    location.pathname.startsWith('/categoria') || location.pathname === '/categorias'

  return (
    <header className="sticky top-0 w-full z-50 bg-[#f8f9fa]/80 backdrop-blur-md shadow-[0px_20px_40px_rgba(0,11,58,0.06)]">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tighter text-[#00113a] font-headline"
        >
          ZaiWear
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 font-headline font-medium tracking-tight">
          <Link
            to="/"
            className={`transition-colors duration-300 ${
              location.pathname === '/'
                ? 'text-[#00113a] font-bold'
                : 'text-[#00113a]/60 hover:text-[#00113a]'
            }`}
          >
            Início
          </Link>

          {/* Collections dropdown */}
          <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
            <button
              className={`transition-colors duration-300 pb-4 ${
                isCollections
                  ? 'text-[#a43c12] font-bold border-b-2 border-[#a43c12]'
                  : 'text-[#00113a]/60 hover:text-[#00113a]'
              }`}
            >
              Coleções
            </button>

            {shopOpen && (
              <div className="absolute top-full left-0 w-56 bg-white border border-[#c5c6d2]/30 shadow-lg py-2 animate-fade-in">
                <Link
                  to="/categorias"
                  className="flex items-center px-4 py-2.5 text-sm text-[#444650] hover:text-[#00113a] hover:bg-[#f3f4f5] transition-colors"
                >
                  Todas as Categorias
                </Link>
                <hr className="my-1 border-[#c5c6d2]/40" />
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/categoria/${cat.slug}`}
                    className="flex items-center px-4 py-2.5 text-sm text-[#444650] hover:text-[#00113a] hover:bg-[#f3f4f5] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex items-center justify-center active:scale-95 transition-transform duration-200"
            aria-label="Carrinho"
          >
            <span className="material-symbols-outlined text-[#00113a]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#a43c12] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-[#00113a]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#c5c6d2]/30 bg-[#f8f9fa] animate-fade-in">
          <div className="flex flex-col px-6 py-4 gap-0.5">
            <Link
              to="/"
              className="py-3 text-sm font-headline text-[#00113a]/60 hover:text-[#00113a] transition-colors"
            >
              Início
            </Link>
            <Link
              to="/categorias"
              className="py-3 text-sm font-headline font-bold text-[#a43c12]"
            >
              Todas as Categorias
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="py-2.5 pl-4 text-sm text-[#444650] hover:text-[#00113a] transition-colors"
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
