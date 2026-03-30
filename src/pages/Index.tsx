import { HeroSection } from '@/components/home/HeroSection'
import { BrandValues } from '@/components/home/BrandValues'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'

export default function Index() {
  return (
    <>
      <HeroSection />
      <BrandValues />
      <CategoryShowcase />
      <FeaturedProducts />

      {/* Instagram CTA */}
      <section
        className="py-20 text-center"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80") center/cover',
        }}
      >
        <div className="container-custom">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            EXPLORE NOSSO CATÁLOGO DE MODA
          </h2>
          <p className="text-white/70 text-sm max-w-xl mx-auto mb-8">
            Navegue pelo catálogo para encontrar uma ampla variedade de opções de roupas estilosas.
            Do clássico ao moderno, tem algo para todos.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-foreground transition-colors"
          >
            VER NOSSO INSTAGRAM →
          </a>
        </div>
      </section>
    </>
  )
}
