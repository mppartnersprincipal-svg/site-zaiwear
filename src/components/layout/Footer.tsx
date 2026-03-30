import { Link } from 'react-router-dom'
import { Camera, MessageCircle, Mail } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { useCategories } from '@/hooks/useCategories'

const WHATSAPP_NUMBER = '5562999404998'

export function Footer() {
  const { data: categories = [] } = useCategories()

  return (
    <footer style={{ backgroundColor: 'var(--color-charcoal)' }} className="text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold">
                Zai<span style={{ color: 'hsl(220 52% 65%)' }}>Wear</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Moda Plus Size com estilo, conforto e qualidade para todos os tamanhos.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Camera"
              >
                <Camera size={16} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Produtos</h4>
            <ul className="flex flex-col gap-2">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link
                    to={`/categoria/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/categorias" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Ver todas as categorias
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Atendimento</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Preciso de ajuda.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <span className="text-sm text-gray-400">Como Comprar</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Trocas e Devoluções</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Tabela de Medidas</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Contato</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MessageCircle size={15} className="shrink-0" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +55 62 99940-4998
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Camera size={15} className="shrink-0" />
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @zaiwear
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={15} className="shrink-0" />
                <span>contato@zaiwear.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ZaiWear — Globo Confecções. Todos os direitos reservados.
          </p>
          <Link to="/admin/login" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
            ADM
          </Link>
        </div>
      </div>
    </footer>
  )
}
