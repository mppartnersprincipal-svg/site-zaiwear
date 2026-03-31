import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 bg-[#f8f9fa]">
      <span className="font-headline text-[8rem] font-extrabold leading-none text-[#00113a]/10 select-none">
        404
      </span>
      <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[#00113a] -mt-4 mb-3">
        Página não encontrada
      </h1>
      <p className="font-body text-[#444650] text-sm max-w-sm mb-10 leading-relaxed">
        A página que você está procurando não existe ou foi movida.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="secondary-gradient text-white px-8 py-4 font-headline font-bold text-sm tracking-widest uppercase active:scale-95 transition-transform"
        >
          Voltar para o Início
        </Link>
        <Link
          to="/categorias"
          className="border border-[#c5c6d2]/30 text-[#00113a] px-8 py-4 font-headline font-bold text-sm tracking-widest uppercase hover:bg-[#f3f4f5] transition-colors"
        >
          Ver Coleções
        </Link>
      </div>
    </div>
  )
}
