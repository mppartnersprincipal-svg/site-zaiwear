import { Heart, Shield, Truck, MessageCircle } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Feito Para Você',
    description: 'Peças desenvolvidas pensando no conforto e estilo de quem usa.',
  },
  {
    icon: Shield,
    title: 'Qualidade Premium',
    description: 'Tecidos selecionados com acabamento de alta qualidade.',
  },
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description: 'Seu pedido com agilidade e segurança até a sua porta.',
  },
  {
    icon: MessageCircle,
    title: 'Atendimento',
    description: 'Suporte via WhatsApp para tirar todas as suas dúvidas.',
  },
]

export function BrandValues() {
  return (
    <section className="py-10 border-b border-border bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden shadow-sm">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-5 md:p-6 bg-white hover:bg-muted/40 transition-colors"
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                style={{ backgroundColor: 'hsl(33 42% 58% / 0.12)' }}
              >
                <Icon size={18} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-sans text-[13px] font-700 text-foreground leading-snug font-semibold">
                  {title}
                </h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed mt-0.5 hidden md:block">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
