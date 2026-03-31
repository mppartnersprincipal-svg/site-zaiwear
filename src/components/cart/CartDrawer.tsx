import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart } from '@/contexts/CartContext'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { formatPrice } from '@/lib/utils'

const WHATSAPP_NUMBER = '5562999404998'

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().min(10, 'Endereço muito curto'),
  notes: z.string().max(500).optional(),
})

type FormData = z.infer<typeof schema>

export function CartDrawer() {
  const {
    items, isCartOpen, closeCart,
    removeFromCart, updateQuantity, clearCart,
    getCartTotal, getCartCount,
  } = useCart()
  const navigate = useNavigate()
  const drawerRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const total = getCartTotal()
  const count = getCartCount()

  function onSubmit(data: FormData) {
    const itemsText = items.map((item, i) =>
      `${i + 1}. *${item.productName}*\n   Cor: ${item.colorName}\n   Tamanho: ${item.sizeName}\n   Qtd: ${item.quantity} x ${formatPrice(item.price)}\n   Subtotal: ${formatPrice(item.price * item.quantity)}`
    ).join('\n\n')

    const message =
      `🛒 *Novo Pedido — ZaiWear*\n\n` +
      `👤 *Cliente:* ${data.name}\n` +
      `📱 *Telefone:* ${data.phone}\n` +
      `📍 *Endereço:* ${data.address}` +
      (data.notes ? `\n📝 *Observações:* ${data.notes}` : '') +
      `\n\n━━━━━━━━━━━━━━━━━\n📦 *Itens do Pedido:*\n\n${itemsText}` +
      `\n\n━━━━━━━━━━━━━━━━━\n💰 *Total: ${formatPrice(total)}*`

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
    clearCart()
    closeCart()
  }

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 bottom-0 z-50 w-[92vw] max-w-md bg-[#f8f9fa] flex flex-col shadow-2xl"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#c5c6d2]/30 bg-[#00113a]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white">shopping_bag</span>
            <span className="font-headline font-bold text-white tracking-tight">
              Carrinho
              {count > 0 && (
                <span className="ml-2 text-sm font-normal text-white/60">
                  ({count} {count === 1 ? 'item' : 'itens'})
                </span>
              )}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="flex items-center justify-center w-8 h-8 text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-[#edeeef]">
                <span className="material-symbols-outlined text-[#444650]/40" style={{ fontSize: '2.5rem' }}>
                  shopping_bag
                </span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-[#00113a] text-lg tracking-tight">
                  Seu carrinho está vazio
                </h3>
                <p className="text-sm text-[#444650] font-body mt-1">
                  Explore nossos produtos e adicione ao carrinho
                </p>
              </div>
              <button
                onClick={() => { closeCart(); navigate('/categorias') }}
                className="secondary-gradient text-white px-8 py-4 font-headline font-bold text-sm tracking-widest uppercase active:scale-95 transition-transform"
              >
                Explorar Produtos
              </button>
            </div>
          ) : (
            <div className="flex flex-col">

              {/* Items */}
              <div className="flex flex-col gap-3 p-5">
                {items.map(item => (
                  <div
                    key={`${item.productId}-${item.colorName}-${item.sizeName}`}
                    className="flex gap-3 p-4 bg-white border border-[#c5c6d2]/20"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 bg-[#edeeef] shrink-0 overflow-hidden">
                      {item.colorImage ?? item.productImage ? (
                        <img
                          src={(item.colorImage ?? item.productImage)!}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#444650]/30" style={{ fontSize: '1.5rem' }}>
                            shopping_bag
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-headline text-xs font-bold text-[#00113a] uppercase tracking-wide truncate">
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className="w-3 h-3 rounded-full border border-[#c5c6d2]/50 shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <p className="text-xs text-[#444650] font-body">
                          {item.colorName} · Tam. {item.sizeName}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#00113a] mt-1.5 font-headline">
                        {formatPrice(item.price * item.quantity)}
                      </p>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border border-[#c5c6d2]/40">
                          <button
                            onClick={() => updateQuantity(item.productId, item.colorName, item.sizeName, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#f3f4f5] transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-headline font-bold w-5 text-center text-[#00113a]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.colorName, item.sizeName, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-[#f3f4f5] transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.colorName, item.sizeName)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmit(onSubmit)} id="cart-form" className="px-5 pb-5 flex flex-col gap-4">
                <div className="border-t border-[#c5c6d2]/30 pt-5">
                  <h4 className="font-headline font-bold text-sm text-[#00113a] uppercase tracking-widest mb-4">
                    Dados para Entrega
                  </h4>
                </div>

                {[
                  { name: 'name' as const,    label: 'Nome completo',          placeholder: 'Seu nome',                        type: 'text' },
                  { name: 'phone' as const,   label: 'Telefone / WhatsApp',    placeholder: '(62) 99999-9999',                 type: 'tel'  },
                  { name: 'address' as const, label: 'Endereço para entrega',  placeholder: 'Rua, número, bairro, cidade - UF', type: 'text' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-[11px] font-headline font-bold uppercase tracking-widest text-[#444650] mb-1.5">
                      {field.label}
                    </label>
                    <input
                      {...register(field.name)}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#c5c6d2]/40 focus:outline-none focus:border-[#00113a] placeholder:text-[#444650]/40 font-body transition-colors"
                    />
                    {errors[field.name] && (
                      <p className="text-xs text-red-500 mt-1 font-body">{errors[field.name]?.message}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-[11px] font-headline font-bold uppercase tracking-widest text-[#444650] mb-1.5">
                    Observações (opcional)
                  </label>
                  <textarea
                    {...register('notes')}
                    placeholder="Ex: cor preferida, urgência..."
                    rows={2}
                    className="w-full px-4 py-3 text-sm bg-white border border-[#c5c6d2]/40 focus:outline-none focus:border-[#00113a] resize-none placeholder:text-[#444650]/40 font-body transition-colors"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-[#c5c6d2]/30 flex flex-col gap-3 bg-white safe-area-inset">
            <div className="flex items-center justify-between py-2">
              <span className="font-body text-sm text-[#444650]">Total estimado</span>
              <span className="font-headline text-xl font-extrabold text-[#00113a]">
                {formatPrice(total)}
              </span>
            </div>
            <button
              type="submit"
              form="cart-form"
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-headline font-bold uppercase tracking-widest text-white transition-all active:scale-95 touch-manipulation"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsAppIcon className="w-5 h-5" />
              Finalizar Pedido via WhatsApp
            </button>
            <button
              onClick={() => { closeCart(); navigate('/categorias') }}
              className="w-full py-3 text-sm font-headline font-bold uppercase tracking-widest border border-[#c5c6d2]/40 text-[#00113a] hover:bg-[#f3f4f5] transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}
