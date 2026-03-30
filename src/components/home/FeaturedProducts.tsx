import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/products/ProductCard'

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useFeaturedProducts()

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)' }}>
              Selecionados para você
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Produtos em Destaque
            </h2>
          </div>
          <Link
            to="/categorias"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted animate-pulse" style={{ height: 320 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            Nenhum produto em destaque no momento.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 sm:hidden text-center">
          <Link
            to="/categorias"
            className="inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            Ver todos os produtos
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
