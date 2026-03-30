import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Star, Package } from 'lucide-react'
import { useProducts, useDeleteProduct, useToggleFeatured } from '@/hooks/useProducts'
import { formatPrice } from '@/lib/utils'

export default function AdminProducts() {
  const { data: products = [], isLoading } = useProducts()
  const deleteMutation = useDeleteProduct()
  const toggleFeatured = useToggleFeatured()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function handleDelete(id: string) {
    await deleteMutation.mutateAsync(id)
    setConfirmDelete(null)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} produtos cadastrados</p>
        </div>
        <Link
          to="/admin/produtos/novo"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus size={16} />
          Novo Produto
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted animate-pulse h-64" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={48} className="text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-sm mb-4">Nenhum produto cadastrado ainda.</p>
          <Link to="/admin/produtos/novo" className="btn-primary" style={{ backgroundColor: 'var(--color-primary)' }}>
            Criar Primeiro Produto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="aspect-square bg-muted relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={40} className="text-muted-foreground/30" />
                  </div>
                )}
                {/* Featured badge */}
                <button
                  onClick={() => toggleFeatured.mutate({ id: product.id, featured: !product.featured })}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors"
                  title={product.featured ? 'Remover destaque' : 'Adicionar destaque'}
                >
                  <Star
                    size={16}
                    className={product.featured ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-semibold text-sm text-foreground line-clamp-1">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{product.categories?.name}</p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    {product.product_colors?.slice(0, 4).map(c => (
                      <span key={c.id} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} title={c.name} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {product.product_sizes?.length ?? 0} tamanhos
                  </span>
                  {product.product_sizes && product.product_sizes.length > 0 && (
                    <span className="text-xs font-medium ml-auto" style={{ color: 'var(--color-primary)' }}>
                      a partir de {formatPrice(Math.min(...product.product_sizes.map(s => s.price)))}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/admin/produtos/${product.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <Edit2 size={13} />
                    Editar
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(product.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium text-destructive hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-scale-in">
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Excluir produto?</h3>
              <p className="text-sm text-muted-foreground mb-6">Esta ação não pode ser desfeita. Cores e tamanhos também serão excluídos.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-destructive hover:opacity-90 transition-opacity"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
