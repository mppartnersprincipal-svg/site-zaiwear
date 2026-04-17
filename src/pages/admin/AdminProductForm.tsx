import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import { useCreateProduct, useUpdateProduct, useProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { ImageUpload } from '@/components/admin/ImageUpload'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Selecione uma categoria'),
  image: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  colors: z.array(z.object({
    name: z.string().min(1, 'Nome obrigatório'),
    hex: z.string().min(4, 'Cor obrigatória'),
    image: z.string().nullable().optional(),
  })).min(1, 'Adicione pelo menos uma cor'),
  sizes: z.array(z.object({
    size: z.string().min(1, 'Tamanho obrigatório'),
    price: z.number({ error: 'Preço obrigatório' }).positive('Preço deve ser maior que 0'),
    available: z.boolean(),
  })).min(1, 'Adicione pelo menos um tamanho'),
})

type FormData = z.infer<typeof schema>

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const { data: product, isLoading: productLoading } = useProduct(id)
  const { data: categories = [] } = useCategories()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const formInitialized = useRef(false)

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      image: null,
      featured: false,
      colors: [{ name: '', hex: '#000000', image: null }],
      sizes: [{ size: '', price: 0, available: true }],
    },
  })

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control, name: 'colors' })
  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({ control, name: 'sizes' })

  const imageValue = watch('image')

  useEffect(() => {
    if (product && isEditing && !formInitialized.current) {
      formInitialized.current = true
      setValue('name', product.name)
      setValue('description', product.description ?? '')
      setValue('category_id', product.category_id)
      setValue('image', product.image ?? null)
      setValue('featured', product.featured)
      if (product.product_colors?.length) {
        setValue('colors', product.product_colors.map(c => ({ name: c.name, hex: c.hex, image: c.image ?? null })))
      }
      if (product.product_sizes?.length) {
        setValue('sizes', product.product_sizes.map(s => ({ size: s.size, price: s.price, available: s.available })))
      }
    }
  }, [product, isEditing, setValue])

  async function onSubmit(data: FormData) {
    setSaving(true)
    setSaveError('')
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({
          id,
          name: data.name,
          description: data.description ?? null,
          category_id: data.category_id,
          image: data.image ?? null,
          featured: data.featured ?? false,
          colors: data.colors.map(c => ({ name: c.name, hex: c.hex, image: c.image ?? null })),
          sizes: data.sizes.map(s => ({ size: s.size, price: s.price, available: s.available })),
        })
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description ?? null,
          category_id: data.category_id,
          image: data.image ?? null,
          featured: data.featured ?? false,
          colors: data.colors.map(c => ({ name: c.name, hex: c.hex, image: c.image ?? null })),
          sizes: data.sizes.map(s => ({ size: s.size, price: s.price, available: s.available })),
        })
      }
      navigate('/admin/produtos')
    } catch (err) {
      console.error(err)
      setSaveError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (isEditing && productLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('/admin/produtos')} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditing ? 'Atualize as informações do produto' : 'Preencha as informações do novo produto'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main info + Colors + Sizes */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-display font-semibold text-base text-foreground mb-4">Informações Básicas</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nome do Produto *</label>
                  <input {...register('name')} className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ex: Camiseta Polo Premium" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Categoria *</label>
                  <select {...register('category_id')} className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-white focus:outline-none">
                    <option value="">Selecione uma categoria</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-xs text-destructive mt-1">{errors.category_id.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
                  <textarea {...register('description')} rows={3} className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-white focus:outline-none resize-none" placeholder="Descrição do produto..." />
                </div>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded" />
                  Produto em destaque
                </label>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-base text-foreground">Cores</h2>
                <button
                  type="button"
                  onClick={() => appendColor({ name: '', hex: '#000000', image: null })}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <Plus size={13} />
                  Adicionar Cor
                </button>
              </div>
              {errors.colors?.root && <p className="text-xs text-destructive mb-3">{errors.colors.root.message}</p>}
              <div className="flex flex-col gap-4">
                {colorFields.map((field, i) => (
                  <div key={field.id} className="flex gap-3 items-start p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Nome da Cor</label>
                        <input {...register(`colors.${i}.name`)} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none" placeholder="Ex: Preto" />
                        {errors.colors?.[i]?.name && <p className="text-xs text-destructive mt-0.5">{errors.colors[i]?.name?.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Cor (Hex)</label>
                        <div className="flex gap-2">
                          <input type="color" {...register(`colors.${i}.hex`)} className="w-10 h-9 rounded-lg border border-border cursor-pointer" />
                          <input {...register(`colors.${i}.hex`)} className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none" placeholder="#000000" />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-foreground mb-1">Imagem desta cor (opcional)</label>
                        <ImageUpload
                          value={watch(`colors.${i}.image`) ?? null}
                          onChange={url => setValue(`colors.${i}.image`, url)}
                          folder="product-colors"
                        />
                      </div>
                    </div>
                    {colorFields.length > 1 && (
                      <button type="button" onClick={() => removeColor(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-destructive transition-colors mt-5">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-base text-foreground">Tamanhos e Preços</h2>
                <button
                  type="button"
                  onClick={() => appendSize({ size: '', price: 0, available: true })}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <Plus size={13} />
                  Adicionar Tamanho
                </button>
              </div>
              {errors.sizes?.root && <p className="text-xs text-destructive mb-3">{errors.sizes.root.message}</p>}
              <div className="flex flex-col gap-3">
                {sizeFields.map((field, i) => (
                  <div key={field.id} className="flex gap-3 items-center p-3 rounded-xl bg-muted/30 border border-border">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Tamanho</label>
                        <input {...register(`sizes.${i}.size`)} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none" placeholder="Ex: XG" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Preço (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`sizes.${i}.price`, { valueAsNumber: true })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none"
                          placeholder="0.00"
                        />
                        {errors.sizes?.[i]?.price && <p className="text-xs text-destructive mt-0.5">{errors.sizes[i]?.price?.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1">Disponível</label>
                        <label className="flex items-center gap-2 h-9 cursor-pointer">
                          <input type="checkbox" {...register(`sizes.${i}.available`)} className="w-4 h-4 rounded" defaultChecked />
                          <span className="text-sm">Sim</span>
                        </label>
                      </div>
                    </div>
                    {sizeFields.length > 1 && (
                      <button type="button" onClick={() => removeSize(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Image + Actions */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-display font-semibold text-base text-foreground mb-4">Imagem Principal</h2>
              <ImageUpload
                value={imageValue ?? null}
                onChange={url => setValue('image', url)}
                folder="products"
              />
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3">
              {saveError && (
                <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{saveError}</p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/produtos')}
                className="w-full py-3 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
