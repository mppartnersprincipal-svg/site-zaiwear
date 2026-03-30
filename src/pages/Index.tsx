import { Link } from 'react-router-dom'
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

      {/* ── Instagram / Catalog CTA ── */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.60)), url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80") center/cover',
        }}
      >
        <div className="container-custom relative z-10">
          <p
            className="section-label mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Catálogo de Moda
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            EXPLORE NOSSO CATÁLOGO DE MODA
          </h2>
          <p className="text-white/60 text-[14px] max-w-xl mx-auto mb-8 leading-relaxed">
            Navegue pelo catálogo para encontrar uma ampla variedade de roupas estilosas.
            Do clássico ao moderno, tem algo para todos os gostos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/categorias"
              className="btn-primary"
              style={{ backgroundColor: 'white', color: '#111' }}
            >
              Ver Coleção →
            </Link>
            <a
              href="https://instagram.com/zaiwear"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/40 text-white/90 text-[13px] font-semibold uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              VER NOSSO INSTAGRAM →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
