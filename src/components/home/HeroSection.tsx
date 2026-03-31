import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="relative min-h-[870px] flex items-center overflow-hidden px-6 lg:px-12 py-12 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Text side */}
        <div className="lg:col-span-5 z-10 animate-slide-up">
          <span className="inline-block font-headline text-sm uppercase tracking-[0.2em] text-[#a43c12] mb-4">
            Nova Coleção
          </span>
          <h1 className="font-headline text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tighter text-[#00113a] mb-8">
            Estilo e<br />Conforto em{' '}
            <span className="text-[#a43c12] italic">Todos</span><br />os Tamanhos
          </h1>
          <p className="text-[#444650] text-base mb-10 max-w-md leading-relaxed font-body">
            Peças pensadas para você — cuecas, bermudas, camisetas e muito mais,
            com qualidade premium e tamanhos para todos os corpos.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/categorias"
              className="secondary-gradient text-white px-8 py-4 font-headline font-bold text-sm tracking-widest uppercase hover:shadow-xl transition-all active:scale-95"
            >
              Ver Coleção
            </Link>
            <Link
              to="/categorias"
              className="border border-[#c5c6d2]/20 text-[#00113a] px-8 py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-[#f3f4f5] transition-all"
            >
              Novidades
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-[#c5c6d2]/40">
            {[
              { label: 'Produtos', value: '100+' },
              { label: 'Categorias', value: '5+' },
              { label: 'Tamanhos', value: 'XG–G9' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-headline text-2xl font-bold text-[#a43c12]">
                  {stat.value}
                </div>
                <div className="text-xs text-[#444650] mt-0.5 font-medium font-body">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image side */}
        <div className="lg:col-span-7 relative">
          <div className="aspect-[4/5] w-full relative z-0 overflow-hidden shadow-2xl transform lg:translate-x-12">
            <img
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=85&fit=crop"
              alt="ZaiWear — Moda Plus Size"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>

          {/* Promo badge */}
          <div className="hidden lg:block absolute top-8 left-8 z-10 bg-[#00113a] text-white px-6 py-5 text-center shadow-xl">
            <div className="font-headline text-3xl font-bold leading-none">20%</div>
            <div className="text-[10px] font-semibold tracking-wider mt-1 uppercase opacity-80">
              Off Hoje
            </div>
          </div>
        </div>
      </div>

      {/* Mobile image strip */}
      <div className="lg:hidden absolute inset-0 -z-10 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  )
}
