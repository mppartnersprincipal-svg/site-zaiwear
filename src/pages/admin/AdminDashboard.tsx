import { Link } from 'react-router-dom'
import { Package, Tags, Palette, Ruler, Plus } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

export default function AdminDashboard() {
  const { data: products = [] } = useProducts()
  const { data: categories = [] } = useCategories()

  const colorCount = products.reduce((sum, p) => sum + (p.product_colors?.length ?? 0), 0)
  const sizeCount = products.reduce((sum, p) => sum + (p.product_sizes?.length ?? 0), 0)

  const stats = [
    { label: 'Produtos', value: products.length, icon: Package, to: '/admin/produtos', color: 'hsl(220 52% 42%)' },
    { label: 'Categorias', value: categories.length, icon: Tags, to: '/admin/categorias', color: 'hsl(15 31% 41%)' },
    { label: 'Variações de Cor', value: colorCount, icon: Palette, to: '/admin/produtos', color: 'hsl(280 50% 50%)' },
    { label: 'Variações de Tamanho', value: sizeCount, icon: Ruler, to: '/admin/produtos', color: 'hsl(160 60% 40%)' },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do catálogo ZaiWear</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, to, color }) => (
          <Link
            key={label}
            to={to}
            className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl mb-3"
              style={{ backgroundColor: color + '20' }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div className="font-display text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <h2 className="font-display font-semibold text-base text-foreground mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/produtos/novo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus size={16} />
            Novo Produto
          </Link>
          <Link
            to="/admin/categorias/nova"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors"
          >
            <Plus size={16} />
            Nova Categoria
          </Link>
        </div>
      </div>

      {/* Recent products */}
      {products.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base text-foreground">Produtos Recentes</h2>
            <Link to="/admin/produtos" className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
              Ver todos →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {products.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.categories?.name}</p>
                </div>
                <Link to={`/admin/produtos/${p.id}`} className="text-xs font-medium shrink-0" style={{ color: 'var(--color-primary)' }}>
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
