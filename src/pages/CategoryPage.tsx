import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useProductsByCategory } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types/product'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Mais recentes',
  'price-asc': 'Menor preço',
  'price-desc': 'Maior preço',
  name: 'Nome A–Z',
}

const ITEMS_PER_PAGE = 12

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: products = [], isLoading } = useProductsByCategory(slug)
  const { data: categories = [] } = useCategories()

  const currentCategory = categories.find(c => c.slug === slug)

  // Filter state
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filtersExpanded, setFiltersExpanded] = useState({
    size: true,
    color: true,
    price: true,
  })

  // Derive all available sizes and colors from products
  const allSizes = useMemo(() => {
    const s = new Set<string>()
    products.forEach(p => p.product_sizes?.forEach(sz => s.add(sz.size)))
    return Array.from(s).sort()
  }, [products])

  const allColors = useMemo(() => {
    const map = new Map<string, string>()
    products.forEach(p => p.product_colors?.forEach(c => map.set(c.name, c.hex)))
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }))
  }, [products])

  const maxPrice = useMemo(() => {
    let max = 0
    products.forEach(p => p.product_sizes?.forEach(s => { if (s.price > max) max = s.price }))
    return Math.ceil(max / 50) * 50 || 500
  }, [products])

  // Apply filters
  const filtered = useMemo(() => {
    let result = products.filter((p: Product) => {
      const sizes = p.product_sizes ?? []
      const colors = p.product_colors ?? []

      if (selectedSizes.length > 0 && !sizes.some(s => selectedSizes.includes(s.size) && s.available)) return false
      if (selectedColors.length > 0 && !colors.some(c => selectedColors.includes(c.name))) return false

      const minPrice = Math.min(...sizes.map(s => s.price).filter(Boolean))
      if (sizes.length > 0 && (minPrice < priceRange[0] || minPrice > priceRange[1])) return false

      return true
    })

    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price-asc') {
        const pa = Math.min(...(a.product_sizes?.map(s => s.price) ?? [0]))
        const pb = Math.min(...(b.product_sizes?.map(s => s.price) ?? [0]))
        return pa - pb
      }
      if (sortBy === 'price-desc') {
        const pa = Math.min(...(a.product_sizes?.map(s => s.price) ?? [0]))
        const pb = Math.min(...(b.product_sizes?.map(s => s.price) ?? [0]))
        return pb - pa
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return result
  }, [products, selectedSizes, selectedColors, priceRange, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice

  function clearFilters() {
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, maxPrice])
    setPage(1)
  }

  function toggleSize(s: string) {
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
    setPage(1)
  }

  function toggleColor(c: string) {
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
    setPage(1)
  }

  const FiltersPanel = () => (
    <div className="flex flex-col gap-5">
      {/* Categories */}
      <div>
        <h4 className="font-semibold text-sm text-foreground mb-3">Categoria</h4>
        <div className="flex flex-col gap-1">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.slug}`}
              className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm transition-colors ${
                cat.slug === slug
                  ? 'font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              style={cat.slug === slug ? { color: 'var(--color-primary)' } : {}}
            >
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Price */}
      <div>
        <button
          className="flex items-center justify-between w-full font-semibold text-sm text-foreground mb-3"
          onClick={() => setFiltersExpanded(p => ({ ...p, price: !p.price }))}
        >
          Preço
          {filtersExpanded.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {filtersExpanded.price && (
          <div className="flex flex-col gap-3">
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={10}
              value={priceRange[1]}
              onChange={e => { setPriceRange([priceRange[0], Number(e.target.value)]); setPage(1) }}
              className="w-full accent-primary"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>R$ {priceRange[0]}</span>
              <span>R$ {priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* Colors */}
      {allColors.length > 0 && (
        <div>
          <button
            className="flex items-center justify-between w-full font-semibold text-sm text-foreground mb-3"
            onClick={() => setFiltersExpanded(p => ({ ...p, color: !p.color }))}
          >
            Cor
            {filtersExpanded.color ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {filtersExpanded.color && (
            <div className="flex flex-wrap gap-2">
              {allColors.map(({ name, hex }) => (
                <button
                  key={name}
                  onClick={() => toggleColor(name)}
                  title={name}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: hex,
                    borderColor: selectedColors.includes(name) ? 'var(--color-primary)' : 'var(--color-border)',
                    boxShadow: selectedColors.includes(name) ? `0 0 0 2px var(--color-primary)` : 'none',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sizes */}
      {allSizes.length > 0 && (
        <>
          <div className="border-t border-border" />
          <div>
            <button
              className="flex items-center justify-between w-full font-semibold text-sm text-foreground mb-3"
              onClick={() => setFiltersExpanded(p => ({ ...p, size: !p.size }))}
            >
              Tamanho
              {filtersExpanded.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {filtersExpanded.size && (
              <div className="grid grid-cols-2 gap-1.5">
                {allSizes.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`badge-size text-xs ${selectedSizes.includes(s) ? 'badge-size-active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-destructive hover:underline self-start mt-1"
        >
          Limpar todos os filtros
        </button>
      )}
    </div>
  )

  return (
    <div>
      {/* Category Banner */}
      <div
        className="relative h-40 md:h-56 flex items-end"
        style={{
          background: currentCategory?.image
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${currentCategory.image}") center/cover`
            : 'linear-gradient(135deg, hsl(220 52% 42%) 0%, hsl(15 31% 41%) 100%)',
        }}
      >
        <div className="container-custom pb-6">
          <nav className="text-white/70 text-xs mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            {' / '}
            <span className="text-white">{currentCategory?.name ?? slug}</span>
          </nav>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
            {currentCategory?.name ?? slug}
          </h1>
          {currentCategory?.description && (
            <p className="text-white/70 text-sm mt-1">{currentCategory.description}</p>
          )}
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-border p-5">
              <h3 className="font-display font-semibold text-base text-foreground mb-5">Filtrar Produtos</h3>
              <FiltersPanel />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  {isLoading ? 'Carregando...' : `${filtered.length} produtos encontrados`}
                </span>
                {/* Active filter chips */}
                {selectedSizes.map(s => (
                  <span key={s} className="filter-chip">
                    {s}
                    <button onClick={() => toggleSize(s)}><X size={12} /></button>
                  </span>
                ))}
                {selectedColors.map(c => (
                  <span key={c} className="filter-chip">
                    {c}
                    <button onClick={() => toggleColor(c)}><X size={12} /></button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  <SlidersHorizontal size={15} />
                  Filtros
                  {hasActiveFilters && (
                    <span
                      className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      {selectedSizes.length + selectedColors.length}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value as SortOption); setPage(1) }}
                  className="text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none"
                >
                  {Object.entries(SORT_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse" style={{ height: 340 }} />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-sm mb-4">Nenhum produto encontrado com esses filtros.</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-primary" style={{ backgroundColor: 'var(--color-primary)' }}>
                    Limpar Filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {paginated.map((product, i) => (
                  <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-40"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1
                    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: p === page ? 'var(--color-primary)' : 'transparent',
                            color: p === page ? 'white' : 'var(--color-foreground)',
                          }}
                        >
                          {p}
                        </button>
                      )
                    }
                    if (Math.abs(p - page) === 2) return <span key={p} className="text-muted-foreground">…</span>
                    return null
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-40"
                >
                  Próxima →
                </button>
              </div>
            )}

            {/* Other categories */}
            <section className="mt-16">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Outras Categorias</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.filter(c => c.slug !== slug).slice(0, 4).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/categoria/${cat.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full gradient-warm" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors" style={{ '--tw-text-opacity': 1 } as React.CSSProperties}>
                        {cat.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description ?? 'Explorar produtos'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto animate-slide-up safe-area-inset">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-base">Filtrar Produtos</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-lg hover:bg-muted">
                <X size={18} />
              </button>
            </div>
            <FiltersPanel />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-5 py-3.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Ver {filtered.length} produtos
            </button>
          </div>
        </>
      )}
    </div>
  )
}
