import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
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
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart()
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

    const message = `🛒 *Novo Pedido - Globo/ZaiWear*\n\n👤 *Cliente:* ${data.name}\n📱 *Telefone:* ${data.phone}\n📍 *Endereço:* ${data.address}${data.notes ? `\n📝 *Observações:* ${data.notes}` : ''}\n\n━━━━━━━━━━━━━━━━━\n📦 *Itens do Pedido:*\n\n${itemsText}\n\n━━━━━━━━━━━━━━━━━\n💰 *Total: ${formatPrice(total)}*`

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
        className="fixed right-0 top-0 bottom-0 z-50 w-[92vw] max-w-md bg-white shadow-2xl flex flex-col animate-scale-in"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: 'var(--color-primary)' }} />
            <span className="font-display font-semibold text-foreground">
              Carrinho {count > 0 && <span className="text-sm font-normal text-muted-foreground">({count} {count === 1 ? 'item' : 'itens'})</span>}
            </span>
          </div>
          <button onClick={closeCart} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <div
                className="flex items-center justify-center w-20 h-20 rounded-full"
                style={{ backgroundColor: 'hsl(220 52% 42% / 0.1)' }}
              >
                <ShoppingBag size={36} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 className="font-display text-lg font-semibold">Seu carrinho está vazio</h3>
              <p className="text-sm text-muted-foreground">Explore nossos produtos e adicione ao carrinho</p>
              <button
                onClick={() => { closeCart(); navigate('/categorias') }}
                className="btn-primary mt-2"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Explorar Produtos
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-0">
              {/* Items */}
              <div className="flex flex-col gap-3 p-5">
                {items.map(item => (
                  <div
                    key={`${item.productId}-${item.colorName}-${item.sizeName}`}
                    className="flex gap-3 p-3 rounded-xl border border-border"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.colorImage ?? item.productImage ? (
                        <img
                          src={(item.colorImage ?? item.productImage)!}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={20} className="text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{item.productName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-3 h-3 rounded-full border border-border shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <p className="text-xs text-muted-foreground">
                          {item.colorName} · {item.sizeName}
                        </p>
                      </div>
                      <p className="text-xs font-bold mt-1" style={{ color: 'var(--color-primary)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.colorName, item.sizeName, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.colorName, item.sizeName, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.colorName, item.sizeName)}
                          className="p-1 rounded text-destructive hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} id="cart-form" className="px-5 pb-5 flex flex-col gap-3">
                <h4 className="font-display font-semibold text-sm text-foreground border-t border-border pt-4">
                  Seus Dados para Cotação do Frete
                </h4>

                {[
                  { name: 'name' as const, label: 'Nome completo', placeholder: 'Seu nome', type: 'text' },
                  { name: 'phone' as const, label: 'Telefone / WhatsApp', placeholder: '(62) 99999-9999', type: 'tel' },
                  { name: 'address' as const, label: 'Endereço para frete', placeholder: 'Rua, número, bairro, cidade - UF', type: 'text' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium text-foreground mb-1">{field.label}</label>
                    <input
                      {...register(field.name)}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 placeholder:text-muted-foreground"
                    />
                    {errors[field.name] && (
                      <p className="text-xs text-destructive mt-0.5">{errors[field.name]?.message}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Observações (opcional)</label>
                  <textarea
                    {...register('notes')}
                    placeholder="Ex: Cor preferida, urgência..."
                    rows={2}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 resize-none placeholder:text-muted-foreground"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-border flex flex-col gap-3 safe-area-inset">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total estimado</span>
              <span className="font-display text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                {formatPrice(total)}
              </span>
            </div>
            <button
              type="submit"
              form="cart-form"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 touch-manipulation"
              style={{ backgroundColor: 'var(--color-whatsapp)' }}
            >
              <WhatsAppIcon className="w-5 h-5" />
              Finalizar Pedido
            </button>
            <button
              onClick={() => { closeCart(); navigate('/') }}
              className="w-full py-3 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}
