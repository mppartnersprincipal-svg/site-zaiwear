import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useProductsByCategory } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types/product'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name'

const SORT_LABELS: Record<SortOption, string> = {
  newest:      'Mais recentes',
  'price-asc': 'Menor preço',
  'price-desc':'Maior preço',
  name:        'Nome A–Z',
}

const ITEMS_PER_PAGE = 12

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1400&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
]

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: products = [], isLoading } = useProductsByCategory(slug)
  const { data: categories = [] } = useCategories()

  const currentCategory = categories.find(c => c.slug === slug)

  const [selectedSizes, setSelectedSizes]   = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange]         = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy]                 = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filtersExpanded, setFiltersExpanded] = useState({ size: true, color: true, price: true })

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

  const filtered = useMemo(() => {
    let result = products.filter((p: Product) => {
      const sizes  = p.product_sizes  ?? []
      const colors = p.product_colors ?? []
      if (selectedSizes.length > 0  && !sizes.some(s => selectedSizes.includes(s.size) && s.available)) return false
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
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice

  function clearFilters() {
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, maxPrice])
    setPage(1)
  }
  function toggleSize(s: string)  { setSelectedSizes(p  => p.includes(s)  ? p.filter(x => x !== s)  : [...p, s]);  setPage(1) }
  function toggleColor(c: string) { setSelectedColors(p => p.includes(c)  ? p.filter(x => x !== c)  : [...p, c]); setPage(1) }

  // Sidebar filter panel
  const FiltersPanel = () => (
    <div className="flex flex-col gap-6">

      {/* Categories */}
      <div>
        <h4 className="font-headline text-sm uppercase tracking-widest text-[#00113a] mb-4 font-bold">
          Categorias
        </h4>
        <ul className="space-y-3">
          {categories.map(cat => (
            <li key={cat.id}>
              <Link
                to={`/categoria/${cat.slug}`}
                className={`text-sm flex justify-between transition-colors ${
                  cat.slug === slug
                    ? 'text-[#a43c12] font-semibold'
                    : 'text-[#444650] hover:text-[#a43c12]'
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <hr className="divider" />

      {/* Price */}
      <div>
        <button
          className="flex items-center justify-between w-full font-headline text-sm uppercase tracking-widest text-[#00113a] font-bold mb-4"
          onClick={() => setFiltersExpanded(p => ({ ...p, price: !p.price }))}
        >
          Preço
          {filtersExpanded.price ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
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
              className="w-full h-1 bg-[#e7e8e9] appearance-none cursor-pointer accent-[#a43c12]"
            />
            <div className="flex items-center justify-between text-xs font-label text-[#444650] tracking-wider">
              <span>R$ {priceRange[0]}</span>
              <span>R$ {priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Colors */}
      {allColors.length > 0 && (
        <>
          <hr className="divider" />
          <div>
            <button
              className="flex items-center justify-between w-full font-headline text-sm uppercase tracking-widest text-[#00113a] font-bold mb-4"
              onClick={() => setFiltersExpanded(p => ({ ...p, color: !p.color }))}
            >
              Cores
              {filtersExpanded.color ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {filtersExpanded.color && (
              <div className="flex flex-wrap gap-3">
                {allColors.map(({ name, hex }) => (
                  <button
                    key={name}
                    onClick={() => toggleColor(name)}
                    title={name}
                    className="w-6 h-6 rounded-full transition-all"
                    style={{
                      backgroundColor: hex,
                      outline: selectedColors.includes(name)
                        ? '2px solid #a43c12'
                        : '2px solid transparent',
                      outlineOffset: '2px',
                      border: '1px solid rgba(197,198,210,0.5)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Sizes */}
      {allSizes.length > 0 && (
        <>
          <hr className="divider" />
          <div>
            <button
              className="flex items-center justify-between w-full font-headline text-sm uppercase tracking-widest text-[#00113a] font-bold mb-4"
              onClick={() => setFiltersExpanded(p => ({ ...p, size: !p.size }))}
            >
              Tamanhos
              {filtersExpanded.size ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {filtersExpanded.size && (
              <div className="grid grid-cols-2 gap-2">
                {allSizes.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`border py-2 text-xs font-headline font-bold uppercase tracking-widest transition-all ${
                      selectedSizes.includes(s)
                        ? 'border-[#a43c12] text-[#a43c12]'
                        : 'border-[#c5c6d2]/30 text-[#444650] hover:border-[#a43c12] hover:text-[#a43c12]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Sustainability note */}
      <div className="bg-[#f3f4f5] p-6 space-y-3">
        <span className="material-symbols-outlined text-[#a43c12]">favorite</span>
        <p className="font-headline text-xs font-bold uppercase tracking-widest text-[#00113a]">
          Moda Para Todos
        </p>
        <p className="text-xs text-[#444650] leading-relaxed font-body font-light">
          Peças desenvolvidas com qualidade premium para todos os corpos, do XG ao G9.
        </p>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-red-600 hover:underline self-start font-headline font-bold uppercase tracking-widest"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )

  const catIndex = categories.findIndex(c => c.slug === slug)

  return (
    <div className="bg-[#f8f9fa]">

      {/* Category Banner */}
      <div
        className="relative h-36 md:h-52 flex items-end overflow-hidden"
        style={{
          backgroundImage: currentCategory?.image
            ? `url("${currentCategory.image}")`
            : `url("${BANNER_IMAGES[Math.abs(catIndex) % BANNER_IMAGES.length]}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#00113a]/70 via-[#00113a]/20 to-transparent" />
        <div className="max-w-7xl mx-auto w-full px-6 pb-6 relative z-10">
          <nav className="flex items-center gap-1.5 text-white/60 text-[11px] font-headline font-medium mb-2 uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white">{currentCategory?.name ?? slug}</span>
          </nav>
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            {currentCategory?.name ?? slug}
          </h1>
          {currentCategory?.description && (
            <p className="text-white/70 text-sm mt-1 font-body">{currentCategory.description}</p>
          )}
        </div>
      </div>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">

        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-10">
          <FiltersPanel />
        </aside>

        {/* Products area */}
        <section className="flex-1">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <div>
              <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-[#00113a] mb-1">
                {currentCategory?.name ?? 'Produtos'}
              </h2>
              <p className="text-[#444650] font-light text-sm tracking-wide font-body">
                {isLoading
                  ? 'Carregando...'
                  : `Mostrando ${paginated.length} de ${filtered.length} ${filtered.length === 1 ? 'peça' : 'peças'}`}
              </p>

              {/* Active filter chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSizes.map(s => (
                  <span key={s} className="filter-chip">
                    {s}
                    <button onClick={() => toggleSize(s)} className="hover:text-red-500 transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
                {selectedColors.map(c => (
                  <span key={c} className="filter-chip">
                    {c}
                    <button onClick={() => toggleColor(c)} className="hover:text-red-500 transition-colors">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 border border-[#c5c6d2]/30 font-headline text-xs uppercase tracking-widest font-bold text-[#00113a] hover:bg-[#f3f4f5] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                Filtros
                {hasActiveFilters && (
                  <span className="bg-[#a43c12] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {selectedSizes.length + selectedColors.length}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value as SortOption); setPage(1) }}
                  className="appearance-none bg-[#f8f9fa] border-none text-xs font-headline uppercase tracking-widest pr-8 pl-4 py-3 cursor-pointer hover:bg-[#f3f4f5] transition-colors w-full"
                >
                  {Object.entries(SORT_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#00113a] pointer-events-none text-sm">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#edeeef] animate-pulse" style={{ height: 400 }} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#444650] text-sm font-body mb-6">
                Nenhum produto encontrado com esses filtros.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="secondary-gradient text-white px-8 py-4 font-headline font-bold text-sm tracking-widest uppercase"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {paginated.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-24 flex items-center justify-center gap-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-xs uppercase tracking-widest font-headline font-bold text-[#00113a]/40 hover:text-[#a43c12] transition-colors flex items-center gap-2 disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Anterior
              </button>

              <div className="flex gap-8">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1
                  if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`font-body text-sm transition-all ${
                          p === page
                            ? 'text-[#a43c12] font-bold border-b-2 border-[#a43c12] pb-1'
                            : 'text-[#00113a]/40 hover:text-[#00113a] cursor-pointer'
                        }`}
                      >
                        {String(p).padStart(2, '0')}
                      </button>
                    )
                  }
                  if (Math.abs(p - page) === 2) return (
                    <span key={p} className="text-[#444650] text-sm">...</span>
                  )
                  return null
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-xs uppercase tracking-widest font-headline font-bold text-[#00113a] hover:text-[#a43c12] transition-colors flex items-center gap-2 disabled:opacity-30"
              >
                Próxima
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </nav>
          )}

          {/* Other categories */}
          {categories.filter(c => c.slug !== slug).length > 0 && (
            <section className="mt-24 pt-12 border-t border-[#c5c6d2]/30">
              <h2 className="font-headline text-2xl font-bold text-[#00113a] mb-8 tracking-tight">
                Outras Categorias
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.filter(c => c.slug !== slug).slice(0, 4).map(cat => (
                  <Link
                    key={cat.id}
                    to={`/categoria/${cat.slug}`}
                    className="group flex items-center gap-4 p-4 border border-[#c5c6d2]/30 hover:border-[#00113a] hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-14 h-14 overflow-hidden bg-[#edeeef] shrink-0">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full gradient-warm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold text-sm text-[#00113a] group-hover:text-[#a43c12] transition-colors">
                        {cat.name}
                      </p>
                      <p className="text-xs text-[#444650] mt-0.5 truncate font-body font-light">
                        {cat.description ?? 'Explorar produtos'}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#444650] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-sm">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 animate-fade-in"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#f8f9fa] p-6 max-h-[82vh] overflow-y-auto animate-slide-up safe-area-inset">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-[#00113a]">
                Filtrar Produtos
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex items-center justify-center w-9 h-9 hover:bg-[#edeeef] transition-colors"
              >
                <X size={17} />
              </button>
            </div>
            <FiltersPanel />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-6 py-4 font-headline text-sm font-bold uppercase tracking-widest text-white secondary-gradient"
            >
              Ver {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
