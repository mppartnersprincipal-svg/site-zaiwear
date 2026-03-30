import { Link } from 'react-router-dom'
import { Camera, Mail } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { useCategories } from '@/hooks/useCategories'

const WHATSAPP_NUMBER = '5562999404998'

export function Footer() {
  const { data: categories = [] } = useCategories()

  return (
    <footer style={{ backgroundColor: 'var(--color-charcoal)' }} className="text-white">

      {/* ── Main footer ── */}
      <div className="container-custom py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Col 1 — General */}
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-4">
              Geral
            </h5>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Sobre Nós',     href: '#' },
                { label: 'Blog',          href: '#' },
                { label: 'Como Funciona', href: '#' },
                { label: 'Contato',       href: `https://wa.me/${WHATSAPP_NUMBER}` },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-[13px] text-white/50 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — Products */}
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-4">
              Produtos
            </h5>
            <ul className="flex flex-col gap-2.5">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/categoria/${cat.slug}`}
                    className="text-[13px] text-white/50 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/categorias"
                  className="text-[13px] text-white/50 hover:text-white transition-colors"
                >
                  Ver tudo
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Customer Service */}
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-4">
              Atendimento
            </h5>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'FAQ',                href: '#' },
                { label: 'Ajuda & Suporte',    href: `https://wa.me/${WHATSAPP_NUMBER}` },
                { label: 'Trocas e Devoluções',href: '#' },
                { label: 'Tabela de Medidas',  href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-[13px] text-white/50 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Social */}
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-4">
              Redes Sociais
            </h5>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Instagram', href: 'https://instagram.com/zaiwear' },
                { label: 'TikTok',    href: '#' },
                { label: 'Facebook',  href: '#' },
                { label: 'YouTube',   href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-white/50 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/8">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <Link to="/" className="shrink-0">
            <span className="font-display text-xl font-bold tracking-tight">
              Zai<span style={{ color: 'var(--color-accent)' }}>Wear</span>
            </span>
          </Link>

          <p className="text-[11px] text-white/30 order-last sm:order-none">
            © {new Date().getFullYear()} ZaiWear — Globo Confecções. Todos os direitos reservados.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 transition-colors"
              aria-label="Instagram"
            >
              <Camera size={14} />
            </a>
            <a
              href="mailto:contato@zaiwear.com"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 transition-colors"
              aria-label="Email"
            >
              <Mail size={14} />
            </a>
            <Link
              to="/admin/login"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 transition-colors text-[10px] font-bold text-white/30 hover:text-white/60"
              aria-label="Admin"
            >
              ADM
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
