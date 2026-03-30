import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/products/ProductCard'

export function FeaturedProducts() {
  const { data: products = [], isLoading } = useFeaturedProducts()

  return (
    <section className="py-16 bg-[#F7F5F2]">
      <div className="container-custom">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Selecionados para você</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Produtos em Destaque
            </h2>
          </div>
          <Link
            to="/categorias"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white animate-pulse" style={{ height: 340 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Nenhum produto em destaque no momento.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden text-center">
          <Link
            to="/categorias"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold"
            style={{ color: 'var(--color-accent)' }}
          >
            Ver todos os produtos
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
