import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'

// Placeholder images for when category has no image
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
    <section className="py-16 bg-white">
      <div className="container-custom">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Explorar</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Nossas Categorias
            </h2>
          </div>
          <Link
            to="/categorias"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            Ver todas
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden block animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Image */}
                <img
                  src={cat.image ?? PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  style={{ '--tw-scale-x': '1.08', '--tw-scale-y': '1.08' } as React.CSSProperties}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-sans text-white text-[13px] font-semibold leading-snug">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white/80 text-[11px]">Ver produtos</span>
                    <ArrowUpRight size={11} className="text-white/80" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden text-center">
          <Link
            to="/categorias"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: 'var(--color-accent)' }}
          >
            Ver todas as categorias
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
