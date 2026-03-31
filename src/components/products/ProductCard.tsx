import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'
import type { Product, ProductColor, ProductSize } from '@/types/product'
import { SIZE_CHARTS } from '@/data/sizeCharts'
import { SizeChartModal } from './SizeChartModal'

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
  const [chartOpen, setChartOpen] = useState(false)

  const sizeChart = SIZE_CHARTS[product.id] ?? null

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

        {/* Image */}
        <div
          className="relative overflow-hidden bg-[#edeeef] cursor-zoom-in"
          style={{ aspectRatio: '3/4' }}
          onClick={() => currentImage && setZoomOpen(true)}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#edeeef]">
              <span className="material-symbols-outlined text-[#444650]/20" style={{ fontSize: '3rem' }}>
                shopping_bag
              </span>
              <span className="text-[11px] text-[#444650]/40 font-body">Sem imagem</span>
            </div>
          )}

          {/* Category badge */}
          {product.categories?.name && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-widest uppercase px-2 py-1 text-[#00113a] font-headline">
              {product.categories.name}
            </span>
          )}

          {/* Slide-up add button */}
          <button
            onClick={e => { e.stopPropagation(); handleAddToCart() }}
            disabled={!selectedSize}
            className={`absolute bottom-0 left-0 w-full py-4 font-headline text-sm font-bold tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 active:scale-95 ${
              added
                ? 'bg-emerald-600 text-white'
                : selectedSize
                  ? 'secondary-gradient text-white'
                  : 'bg-[#444650] text-white cursor-not-allowed'
            }`}
          >
            {added ? '✓ ADICIONADO!' : selectedSize ? 'ADICIONAR' : 'SELECIONE O TAMANHO'}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2.5 p-4">

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-body text-base font-semibold text-[#00113a]/70">
              {formatPrice(currentPrice)}
            </span>
            {!selectedSize && sizes.length > 0 && (
              <span className="text-[10px] text-[#444650] font-body">a partir de</span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-headline text-sm font-bold text-[#00113a] leading-snug line-clamp-2 tracking-tight group-hover:text-[#a43c12] transition-colors">
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
                      ? '2px solid #a43c12'
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
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-body text-[10px] text-[#444650]/70 uppercase tracking-wide">Tamanho:</span>
                {sizeChart && (
                  <button
                    onClick={() => setChartOpen(true)}
                    className="flex items-center gap-1 font-body text-[10px] text-[#1d4ed8] hover:underline"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>straighten</span>
                    Tabela de medidas
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {sizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => size.available ? setSelectedSize(size) : undefined}
                    disabled={!size.available}
                    className={`badge-size touch-manipulation ${
                      selectedSize?.id === size.id ? 'badge-size-active' : ''
                    } ${!size.available ? 'opacity-25 cursor-not-allowed line-through' : ''}`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
              <p className="text-[9px] font-body text-[#a43c12] font-semibold text-center leading-snug pt-0.5">
                ⚡ Clique no tamanho e confira o valor do tamanho selecionado
              </p>
            </div>
          )}

          {/* Explicit add button (always visible) */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full flex items-center justify-center gap-2 py-3 font-headline text-[11px] font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 touch-manipulation mt-1 ${
              added
                ? 'bg-emerald-600 text-white'
                : selectedSize
                  ? 'secondary-gradient text-white'
                  : 'bg-[#edeeef] text-[#444650] cursor-not-allowed'
            }`}
          >
            {added ? (
              <>
                <Check size={13} />
                Adicionado!
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>shopping_bag</span>
                {selectedSize ? 'Adicionar' : 'Selecione o tamanho'}
              </>
            )}
          </button>
        </div>
      </article>

      {/* Size Chart Modal */}
      {chartOpen && sizeChart && (
        <SizeChartModal chart={sizeChart} onClose={() => setChartOpen(false)} />
      )}

      {/* Zoom Modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in"
          onClick={() => setZoomOpen(false)}
        >
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-white/15 text-white hover:bg-white/25 transition-colors"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
          <img
            src={currentImage ?? ''}
            alt={product.name}
            className="max-w-full max-h-[88vh] object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
