import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7F5F2]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[440px] md:min-h-[520px]">

          {/* ── Text side ── */}
          <div className="flex flex-col justify-center py-14 md:py-20 pr-0 lg:pr-12 animate-slide-up">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 self-start">
              <span
                className="inline-block w-8 h-[2px] rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              <span
                className="text-[11px] font-bold tracking-[0.12em] uppercase"
                style={{ color: 'var(--color-accent)' }}
              >
                Nova Coleção
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.2rem] font-bold text-foreground leading-[1.15] mb-5">
              Estilo e Conforto{' '}
              <span className="block">
                em{' '}
                <span
                  className="italic"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Todos
                </span>{' '}
                os Tamanhos
              </span>
            </h1>

            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 max-w-md">
              Peças pensadas para você — cuecas, bermudas, camisetas e muito mais,
              com qualidade premium e tamanhos para todos os corpos.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/categorias" className="btn-primary">
                Ver Coleção
                <ArrowRight size={14} />
              </Link>
              <Link to="/categorias" className="btn-secondary">
                Novidades
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-border/60">
              {[
                { label: 'Produtos', value: '100+' },
                { label: 'Categorias', value: '5+' },
                { label: 'Tamanhos', value: 'XG–EXG' },
              ].map(stat => (
                <div key={stat.label}>
                  <div
                    className="font-display text-2xl font-bold"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Image side ── */}
          <div className="hidden lg:flex items-stretch relative overflow-hidden">
            {/* Gradient overlay left edge */}
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#F7F5F2] to-transparent pointer-events-none" />

            {/* Promo badge */}
            <div className="absolute top-8 right-8 z-20 bg-foreground text-white rounded-2xl px-5 py-4 text-center shadow-xl">
              <div className="font-display text-3xl font-bold leading-none">20%</div>
              <div className="text-[10px] font-semibold tracking-wider mt-1 uppercase opacity-80">Off Hoje</div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=85&fit=crop"
              alt="ZaiWear — Moda Plus Size"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Mobile image strip */}
      <div className="lg:hidden relative h-56 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80&fit=crop"
          alt="ZaiWear"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F5F2] to-transparent" />
      </div>
    </section>
  )
}
