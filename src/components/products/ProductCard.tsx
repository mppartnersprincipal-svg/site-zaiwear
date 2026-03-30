import { useState } from 'react'
import { ShoppingBag, ZoomIn, Check } from 'lucide-react'
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
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const colors: ProductColor[] = product.product_colors ?? []
  const sizes: ProductSize[] = product.product_sizes ?? []

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(colors[0] ?? null)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [zoomOpen, setZoomOpen] = useState(false)

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
  }

  return (
    <>
      <div className="card-product flex flex-col">
        {/* Image */}
        <div
          className="relative aspect-square bg-muted overflow-hidden cursor-zoom-in group"
          onClick={() => setZoomOpen(true)}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ShoppingBag size={40} className="text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-3">
          {/* Name */}
          <h3 className="font-display text-sm font-semibold text-foreground leading-snug line-clamp-2">
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
                    boxShadow: selectedColor?.id === color.id
                      ? `0 0 0 2px var(--color-primary)`
                      : undefined,
                    borderColor: selectedColor?.id === color.id ? 'white' : 'transparent',
                  }}
                  title={color.name}
                  aria-label={`Cor ${color.name}`}
                >
                  {selectedColor?.id === color.id && (
                    <Check
                      size={10}
                      className="mx-auto"
                      style={{ color: isLightColor(color.hex) ? '#000' : '#fff' }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-4 gap-1">
                {sizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => size.available ? setSelectedSize(size) : null}
                    disabled={!size.available}
                    className={`badge-size touch-manipulation relative ${
                      selectedSize?.id === size.id ? 'badge-size-active' : ''
                    } ${!size.available ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-[10px] text-muted-foreground">
                  ⚡ Selecione o tamanho para ver o preço
                </p>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
              {formatPrice(currentPrice)}
            </span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 touch-manipulation"
            style={{
              backgroundColor: selectedSize ? 'var(--color-primary)' : 'var(--color-muted)',
              color: selectedSize ? 'white' : 'var(--color-muted-foreground)',
              cursor: selectedSize ? 'pointer' : 'not-allowed',
            }}
          >
            <ShoppingBag size={14} />
            {selectedSize ? 'Adicionar ao Carrinho' : 'Selecione o tamanho'}
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
          onClick={() => setZoomOpen(false)}
        >
          <img
            src={currentImage ?? ''}
            alt={product.name}
            className="max-w-full max-h-full rounded-xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
