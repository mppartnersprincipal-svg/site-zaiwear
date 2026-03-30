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
    description: 'Suporte dedicado via WhatsApp para tirar todas as suas dúvidas.',
  },
]

export function BrandValues() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-xl border border-border hover:shadow-md transition-shadow"
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ backgroundColor: 'hsl(220 52% 42% / 0.1)' }}
              >
                <Icon size={22} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
