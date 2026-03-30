import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
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
    <div>
      {/* ── Banner ── */}
      <div
        className="relative py-16 md:py-20 text-center overflow-hidden"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80") center/cover',
        }}
      >
        <div className="container-custom relative z-10">
          <p
            className="section-label mb-3"
            style={{ color: 'var(--color-accent)' }}
          >
            Explorar
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            Todas as Categorias
          </h1>
          <p className="text-white/60 mt-2 text-[14px]">
            Explore nossa coleção completa de moda Plus Size
          </p>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="container-custom py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden block animate-slide-up"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <img
                  src={cat.image ?? PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-white">{cat.name}</h2>
                      {cat.description && (
                        <p className="text-white/60 text-[13px] mt-1 line-clamp-1">{cat.description}</p>
                      )}
                    </div>
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shrink-0 ml-3"
                    >
                      <ArrowUpRight size={16} className="text-foreground" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
