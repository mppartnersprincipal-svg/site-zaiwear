import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useCreateCategory, useUpdateCategory, useCategory } from '@/hooks/useCategories'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { slugify } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  slug: z.string().min(2, 'Slug obrigatório'),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
})

type FormData = z.infer<typeof schema>

export default function AdminCategoryForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const { data: category } = useCategory(id)
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', description: '', image: null },
  })

  const nameValue = watch('name')
  const imageValue = watch('image')

  useEffect(() => {
    if (!isEditing) {
      setValue('slug', slugify(nameValue))
    }
  }, [nameValue, isEditing, setValue])

  useEffect(() => {
    if (category && isEditing) {
      setValue('name', category.name)
      setValue('slug', category.slug)
      setValue('description', category.description ?? '')
      setValue('image', category.image ?? null)
    }
  }, [category, isEditing, setValue])

  async function onSubmit(data: FormData) {
    setSaving(true)
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, ...data, image: data.image ?? null })
      } else {
        await createMutation.mutateAsync({ ...data, description: data.description ?? null, image: data.image ?? null })
      }
      navigate('/admin/categorias')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate('/admin/categorias')} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nome *</label>
            <input {...register('name')} className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-white focus:outline-none" placeholder="Ex: Camisetas" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Slug (URL) *</label>
            <input {...register('slug')} className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-muted focus:outline-none" />
            {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
            <textarea {...register('description')} rows={3} className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-white focus:outline-none resize-none" placeholder="Breve descrição da categoria..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Imagem da Categoria</label>
            <ImageUpload
              value={imageValue ?? null}
              onChange={url => setValue('image', url)}
              folder="categories"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar Categoria'}
          </button>
          <button type="button" onClick={() => navigate('/admin/categorias')} className="px-6 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
