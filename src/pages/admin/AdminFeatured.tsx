import { useState, useEffect } from 'react'
import { GripVertical, X, Package } from 'lucide-react'
import { useFeaturedProducts, useToggleFeatured, useUpdateFeaturedOrder } from '@/hooks/useProducts'
import type { Product } from '@/types/product'

export default function AdminFeatured() {
  const { data: products = [], isLoading } = useFeaturedProducts()
  const toggleFeatured = useToggleFeatured()
  const updateOrder = useUpdateFeaturedOrder()
  const [items, setItems] = useState<Product[]>([])
  const [dragging, setDragging] = useState<number | null>(null)

  useEffect(() => {
    setItems(products)
  }, [products])

  function handleDragStart(i: number) {
    setDragging(i)
  }

  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragging === null || dragging === i) return
    const newItems = [...items]
    const [moved] = newItems.splice(dragging, 1)
    newItems.splice(i, 0, moved)
    setItems(newItems)
    setDragging(i)
  }

  async function handleDragEnd() {
    setDragging(null)
    await updateOrder.mutateAsync(items.map((p, i) => ({ id: p.id, featured_order: i })))
  }

  async function handleRemove(id: string) {
    await toggleFeatured.mutateAsync({ id, featured: false })
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Produtos em Destaque</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Arraste para reordenar. Os destaques aparecem na página inicial.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package size={40} className="text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhum produto em destaque. Ative a estrela nos produtos para adicioná-los aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((product, i) => (
              <div
                key={product.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                  dragging === i ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <GripVertical size={18} className="text-muted-foreground shrink-0" />
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={18} className="text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.categories?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors"
                    title="Remover dos destaques"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
