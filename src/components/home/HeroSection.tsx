import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
      {/* Background decorative */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 50%, hsl(220 52% 42% / 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="container-custom relative">
        <div className="max-w-2xl animate-slide-up">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6"
            style={{
              backgroundColor: 'hsl(220 52% 42% / 0.1)',
              color: 'var(--color-primary)',
            }}
          >
            <Sparkles size={12} />
            Nova Coleção Disponível
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Estilo e Conforto{' '}
            <span style={{ color: 'var(--color-primary)' }}>em Todos</span>{' '}
            os Tamanhos
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
            Peças pensadas para você. Cuecas, bermudas, camisetas e muito mais,
            com qualidade premium e tamanhos para todos.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/categorias"
              className="btn-primary"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Ver Coleção
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/categoria/100-algodao"
              className="btn-secondary"
            >
              Novidades
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12">
            {[
              { label: 'Produtos', value: '100+' },
              { label: 'Categorias', value: '5+' },
              { label: 'Tamanhos', value: 'XG–EXG' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
