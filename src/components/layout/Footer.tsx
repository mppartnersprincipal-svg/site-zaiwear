import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'

const WHATSAPP_NUMBER = '5562999404998'

export function Footer() {
  const { data: categories = [] } = useCategories()

  return (
    <footer className="bg-[#00113a] text-white w-full">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 max-w-7xl mx-auto">

        {/* Brand + copyright */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link to="/" className="font-headline text-lg font-bold text-white">
            ZaiWear
          </Link>
          <p className="font-body text-xs font-light tracking-wide text-white/60 max-w-xs text-center md:text-left">
            Moda Plus Size com estilo, conforto e qualidade premium.
          </p>
          <div className="font-body text-[10px] tracking-wide text-white/40 uppercase">
            © {new Date().getFullYear()} ZaiWear — Globo Confecções. Todos os direitos reservados.
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-8 font-body text-xs font-light tracking-wide">
          {categories.slice(0, 4).map(cat => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.slug}`}
              className="text-white/60 hover:text-white transition-opacity"
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/categorias" className="text-white/60 hover:text-white transition-opacity">
            Ver tudo
          </Link>
          <a href="#" className="text-white/60 hover:text-white transition-opacity">
            Sobre Nós
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-opacity"
          >
            Contato
          </a>
          <Link to="/admin/login" className="text-white/60 hover:text-white transition-opacity">
            Admin
          </Link>
        </nav>

        {/* Social icons */}
        <div className="flex gap-6">
          <a
            href="https://instagram.com/zaiwear"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <span className="material-symbols-outlined cursor-pointer opacity-60 hover:opacity-100 hover:text-[#fe7e4f] transition-all">
              camera
            </span>
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <span className="material-symbols-outlined cursor-pointer opacity-60 hover:opacity-100 hover:text-[#fe7e4f] transition-all">
              chat
            </span>
          </a>
          <a href="mailto:contato@zaiwear.com" aria-label="Email">
            <span className="material-symbols-outlined cursor-pointer opacity-60 hover:opacity-100 hover:text-[#fe7e4f] transition-all">
              mail
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
