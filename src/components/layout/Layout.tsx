import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { ScrollToTop } from '@/components/ScrollToTop'

const WHATSAPP_NUMBER = '5562999404998'
const WHATSAPP_DEFAULT_MSG = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos ZaiWear.')

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />

      {/* WhatsApp FAB */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg hover:scale-110 active:scale-95 transition-transform"
        style={{ backgroundColor: 'var(--color-whatsapp)' }}
        aria-label="Falar no WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </div>
  )
}
