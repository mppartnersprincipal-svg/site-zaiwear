import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'

export default function AllCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()

  return (
    <div>
      {/* Banner */}
      <div className="gradient-warm py-14 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Todas as Categorias</h1>
        <p className="text-white/70 mt-2 text-sm">Explore nossa coleção completa de moda Plus Size</p>
      </div>

      <div className="container-custom py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden block animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 gradient-warm" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="font-display text-xl font-bold text-white">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">{cat.description}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 mt-3 text-white text-xs font-semibold border border-white/40 rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Explorar Produtos →
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
