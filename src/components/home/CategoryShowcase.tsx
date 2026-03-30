import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'

export function CategoryShowcase() {
  const { data: categories = [], isLoading } = useCategories()

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>
              Explore
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Nossas Categorias
            </h2>
          </div>
          <Link
            to="/categorias"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Ver todas
            <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden block"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{ background: `hsl(${220 + i * 20} 52% ${60 + i * 5}%)` }}
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-white text-sm font-semibold leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-white/60 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Ver produtos →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 sm:hidden text-center">
          <Link
            to="/categorias"
            className="inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            Ver todas as categorias
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
