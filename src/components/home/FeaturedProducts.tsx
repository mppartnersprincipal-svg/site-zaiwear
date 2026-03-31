import { Link } from 'react-router-dom'
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/products/ProductCard'

export function FeaturedProducts() {
  const { data: featured = [], isLoading: loadingFeatured } = useFeaturedProducts()
  const { data: allProducts = [], isLoading: loadingAll } = useProducts()

  // Fallback: if no featured products, show the first 8 from the database
  const products = featured.length > 0 ? featured : allProducts.slice(0, 8)
  const isLoading = loadingFeatured || (featured.length === 0 && loadingAll)

  return (
    <section className="py-24 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-[#00113a]">
            Mais Vendidos
          </h2>
          <div className="h-1 w-20 secondary-gradient mx-auto mt-4"></div>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#edeeef] animate-pulse" style={{ height: 360 }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
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

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/categorias"
            className="inline-flex items-center gap-2 font-headline text-sm font-bold uppercase tracking-widest text-[#00113a] border-b-2 border-[#00113a] pb-1 hover:text-[#a43c12] hover:border-[#a43c12] transition-colors"
          >
            Ver todos os produtos
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
