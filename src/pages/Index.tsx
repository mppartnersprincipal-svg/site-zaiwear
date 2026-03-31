import { Link } from 'react-router-dom'
import { HeroSection } from '@/components/home/HeroSection'
import { BrandValues } from '@/components/home/BrandValues'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'

export default function Index() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <BrandValues />

      {/* Catálogo CTA */}
      <section className="relative py-24 text-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(rgba(0,17,58,0.75), rgba(0,17,58,0.75)), url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80") center/cover',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="inline-block font-headline text-sm uppercase tracking-[0.2em] text-[#fe7e4f] mb-4">
            Catálogo Completo
          </span>
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
            EXPLORE NOSSA COLEÇÃO
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto mb-10 leading-relaxed font-body">
            Navegue pelo catálogo para encontrar uma ampla variedade de roupas estilosas.
            Do clássico ao moderno, tem algo para todos os gostos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/categorias"
              className="secondary-gradient text-white px-8 py-4 font-headline font-bold text-sm tracking-widest uppercase hover:shadow-xl transition-all active:scale-95"
            >
              Ver Coleção
            </Link>
            <a
              href="https://instagram.com/zaiwear"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white/90 font-headline font-bold text-sm tracking-widest uppercase px-8 py-4 hover:bg-white/10 transition-all"
            >
              Nosso Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
