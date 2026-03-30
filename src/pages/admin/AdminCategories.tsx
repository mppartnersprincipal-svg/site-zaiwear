import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Tags } from 'lucide-react'
import { useCategories, useDeleteCategory } from '@/hooks/useCategories'

export default function AdminCategories() {
  const { data: categories = [], isLoading } = useCategories()
  const deleteMutation = useDeleteCategory()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function handleDelete(id: string) {
    await deleteMutation.mutateAsync(id)
    setConfirmDelete(null)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Categorias</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} categorias cadastradas</p>
        </div>
        <Link
          to="/admin/categorias/nova"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus size={16} />
          Nova Categoria
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted animate-pulse h-48" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Tags size={48} className="text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-sm mb-4">Nenhuma categoria cadastrada ainda.</p>
          <Link to="/admin/categorias/nova" className="btn-primary" style={{ backgroundColor: 'var(--color-primary)' }}>
            Criar Primeira Categoria
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-warm" />
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm text-foreground">{cat.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{cat.description ?? '—'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">slug: {cat.slug}</p>
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/admin/categorias/${cat.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                  >
                    <Edit2 size={13} />
                    Editar
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(cat.id)}
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

      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-scale-in">
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Excluir categoria?</h3>
              <p className="text-sm text-muted-foreground mb-6">Produtos associados a esta categoria serão afetados.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-destructive hover:opacity-90 transition-opacity">Excluir</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
