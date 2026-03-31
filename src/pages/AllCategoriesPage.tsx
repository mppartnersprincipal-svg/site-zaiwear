import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
  'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
]

export default function AllCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()

  return (
    <div className="bg-[#f8f9fa]">

      {/* Banner */}
      <div
        className="relative py-16 md:py-24 flex items-end overflow-hidden"
        style={{
          background:
            'linear-gradient(rgba(0,17,58,0.65), rgba(0,17,58,0.65)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80") center/cover',
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
          <nav className="flex items-center gap-1.5 text-white/60 text-[11px] font-headline font-medium mb-4 uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white">Coleções</span>
          </nav>
          <span className="inline-block font-headline text-sm uppercase tracking-[0.2em] text-[#fe7e4f] mb-4">
            Explorar
          </span>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
            Todas as Categorias
          </h1>
          <p className="text-white/60 mt-3 text-base font-body font-light max-w-md">
            Explore nossa coleção completa de moda Plus Size
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#edeeef] animate-pulse" style={{ height: 320 }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="aspect-[4/3] bg-[#edeeef] overflow-hidden mb-6">
                  <img
                    src={cat.image ?? PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#a43c12] font-bold font-headline">
                    ZaiWear
                  </p>
                  <h2 className="font-headline text-lg font-bold text-[#00113a] group-hover:text-[#a43c12] transition-colors tracking-tight">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-[#444650] text-sm font-body font-light line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 font-headline text-xs font-bold uppercase tracking-widest text-[#00113a] border-b border-[#00113a] pb-0.5 group-hover:text-[#a43c12] group-hover:border-[#a43c12] transition-colors">
                    Ver produtos
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
