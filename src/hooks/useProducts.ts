import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Product, ProductColor, ProductSize } from '@/types/product'

const PRODUCT_SELECT = `
  *,
  categories(*),
  product_colors(*),
  product_sizes(*)
`

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Product[]
    },
  })
}

export function useProductsByCategory(slug: string | undefined) {
  return useQuery({
    queryKey: ['products', 'category', slug],
    queryFn: async () => {
      const { data: cat, error: catErr } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug!)
        .single()
      if (catErr) throw catErr

      const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('category_id', cat.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Product[]
    },
    enabled: !!slug,
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Product
    },
    enabled: !!id,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('featured', true)
        .order('featured_order')
      if (error) throw error
      return data as Product[]
    },
  })
}

interface CreateProductPayload {
  name: string
  description?: string | null
  category_id: string
  image?: string | null
  featured?: boolean
  colors: Omit<ProductColor, 'id' | 'product_id' | 'created_at'>[]
  sizes: Omit<ProductSize, 'id' | 'product_id' | 'created_at'>[]
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const { colors, sizes, ...productData } = payload
      const { data: product, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()
      if (error) throw error

      if (colors.length > 0) {
        const { error: colorErr } = await supabase
          .from('product_colors')
          .insert(colors.map(c => ({ ...c, product_id: product.id })))
        if (colorErr) throw colorErr
      }

      if (sizes.length > 0) {
        const { error: sizeErr } = await supabase
          .from('product_sizes')
          .insert(sizes.map(s => ({ ...s, product_id: product.id })))
        if (sizeErr) throw sizeErr
      }

      return product
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, colors, sizes, ...payload }: CreateProductPayload & { id: string }) => {
      const { error } = await supabase.from('products').update(payload).eq('id', id)
      if (error) throw error

      await supabase.from('product_colors').delete().eq('product_id', id)
      await supabase.from('product_sizes').delete().eq('product_id', id)

      if (colors.length > 0) {
        await supabase.from('product_colors').insert(colors.map(c => ({ ...c, product_id: id })))
      }
      if (sizes.length > 0) {
        await supabase.from('product_sizes').insert(sizes.map(s => ({ ...s, product_id: id })))
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useToggleFeatured() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase.from('products').update({ featured }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUpdateFeaturedOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (items: { id: string; featured_order: number }[]) => {
      const updates = items.map(i =>
        supabase.from('products').update({ featured_order: i.featured_order }).eq('id', i.id)
      )
      await Promise.all(updates)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}
