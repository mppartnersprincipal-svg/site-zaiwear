import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80&fit=crop',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80&fit=crop',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80&fit=crop',
  'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80&fit=crop',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&fit=crop',
]

export function CategoryShowcase() {
  const { data: categories = [], isLoading } = useCategories()

  return (
    <section className="py-24 bg-[#f3f4f5]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-[#00113a]">
              Coleções em Destaque
            </h2>
            <p className="font-body text-[#444650] mt-2">Explore por categoria</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/categorias"
              className="p-2 border border-[#c5c6d2]/30 hover:bg-white transition-colors"
              aria-label="Ver todas as categorias"
            >
              <span className="material-symbols-outlined text-[#00113a]">chevron_right</span>
            </Link>
          </div>
        </div>

        {/* Horizontal scroll carousel */}
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex-none w-64 aspect-square bg-[#edeeef] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 no-scrollbar pb-8">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="flex-none w-64 group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="aspect-square bg-[#edeeef] overflow-hidden mb-4">
                  <img
                    src={cat.image ?? PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-headline font-bold text-[#00113a] tracking-tight">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-[#444650] uppercase tracking-widest mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/categorias"
            className="inline-flex items-center gap-1.5 font-headline text-sm font-bold text-[#a43c12] uppercase tracking-widest"
          >
            Ver todas as categorias
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
