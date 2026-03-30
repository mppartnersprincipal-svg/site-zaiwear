import { useState } from 'react'
import { ShoppingBag, X, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import type { Product, ProductColor, ProductSize } from '@/types/product'

interface Props {
  product: Product
}

function isLightColor(hex: string) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 180
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const colors: ProductColor[] = product.product_colors ?? []
  const sizes: ProductSize[] = product.product_sizes ?? []

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(colors[0] ?? null)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [added, setAdded] = useState(false)

  const currentImage = selectedColor?.image ?? product.image
  const currentPrice = selectedSize?.price ?? (sizes[0]?.price ?? 0)

  function handleAddToCart() {
    if (!selectedSize) return
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: currentImage,
      colorName: selectedColor?.name ?? '',
      colorHex: selectedColor?.hex ?? '#000000',
      colorImage: selectedColor?.image ?? null,
      sizeName: selectedSize.size,
      price: selectedSize.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <article className="card-product flex flex-col group">

        {/* ── Image ── */}
        <div
          className="relative overflow-hidden bg-muted cursor-zoom-in"
          style={{ aspectRatio: '3/4' }}
          onClick={() => currentImage && setZoomOpen(true)}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted">
              <ShoppingBag size={36} className="text-muted-foreground/20" />
              <span className="text-[11px] text-muted-foreground/40">Sem imagem</span>
            </div>
          )}

          {/* Category badge */}
          {product.categories?.name && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded-full text-foreground">
              {product.categories.name}
            </span>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col gap-2.5 p-3.5">

          {/* Name */}
          <h3 className="font-sans text-[13px] font-semibold text-foreground leading-snug line-clamp-2 uppercase tracking-wide">
            {product.name}
          </h3>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {colors.map(color => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className="color-swatch touch-manipulation"
                  style={{
                    backgroundColor: color.hex,
                    outline: selectedColor?.id === color.id
                      ? `2px solid var(--color-primary)`
                      : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                  title={color.name}
                  aria-label={`Cor ${color.name}`}
                >
                  {selectedColor?.id === color.id && (
                    <Check
                      size={9}
                      className="mx-auto"
                      style={{ color: isLightColor(color.hex) ? '#111' : '#fff' }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="grid grid-cols-4 gap-1">
              {sizes.map(size => (
                <button
                  key={size.id}
                  onClick={() => size.available ? setSelectedSize(size) : null}
                  disabled={!size.available}
                  className={`badge-size touch-manipulation ${
                    selectedSize?.id === size.id ? 'badge-size-active' : ''
                  } ${!size.available ? 'opacity-25 cursor-not-allowed line-through' : ''}`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className="text-[15px] font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              {formatPrice(currentPrice)}
            </span>
            {!selectedSize && sizes.length > 0 && (
              <span className="text-[10px] text-muted-foreground">a partir de</span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 touch-manipulation ${
              added ? 'bg-emerald-600 text-white' : ''
            }`}
            style={!added ? {
              backgroundColor: selectedSize ? 'var(--color-primary)' : 'var(--color-muted)',
              color: selectedSize ? 'white' : 'var(--color-muted-foreground)',
              cursor: selectedSize ? 'pointer' : 'not-allowed',
            } : {}}
          >
            {added ? (
              <>
                <Check size={13} />
                Adicionado!
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                {selectedSize ? 'Adicionar' : 'Selecione o tamanho'}
              </>
            )}
          </button>
        </div>
      </article>

      {/* ── Zoom Modal ── */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in"
          onClick={() => setZoomOpen(false)}
        >
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
          <img
            src={currentImage ?? ''}
            alt={product.name}
            className="max-w-full max-h-[88vh] rounded-2xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
