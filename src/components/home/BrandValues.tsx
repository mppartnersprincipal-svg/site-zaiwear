/**
 * Journal / Editorial Bento — replaces old BrandValues section.
 * Follows the GALLERY design system with 3 editorial story cards.
 */
export function BrandValues() {
  return (
    <section className="py-24 px-6 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-12">
          <span className="inline-block font-headline text-sm uppercase tracking-[0.2em] text-[#a43c12] mb-3">
            Sobre a ZaiWear
          </span>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-[#00113a]">
            Nossa História
          </h2>
        </div>

        {/* Editorial bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[560px]">

          {/* Main large card */}
          <div className="md:col-span-8 relative group overflow-hidden cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
              alt="Atelier ZaiWear"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 min-h-[300px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00113a]/80 to-transparent flex flex-col justify-end p-12">
              <span className="text-[#fe7e4f] font-headline text-xs uppercase tracking-[0.2em] mb-4">
                Nossa Missão
              </span>
              <h3 className="text-white font-headline text-4xl font-extrabold tracking-tight max-w-lg mb-6">
                Moda que Celebra Todos os Corpos
              </h3>
              <span className="w-fit text-white font-headline text-xs font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-[#fe7e4f] transition-colors cursor-pointer">
                Conheça nossa história
              </span>
            </div>
          </div>

          {/* Side cards */}
          <div className="md:col-span-4 grid grid-rows-2 gap-6">
            <div className="relative group overflow-hidden cursor-pointer min-h-[200px] md:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Qualidade Premium"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/35 flex flex-col justify-end p-6">
                <h4 className="text-white font-headline font-bold text-xl tracking-tight">
                  Qualidade Premium
                </h4>
              </div>
            </div>
            <div className="relative group overflow-hidden cursor-pointer min-h-[200px] md:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"
                alt="Tamanhos Inclusivos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/35 flex flex-col justify-end p-6">
                <h4 className="text-white font-headline font-bold text-xl tracking-tight">
                  Tamanhos Inclusivos
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
