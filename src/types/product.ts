export interface ProductColor {
  id: string
  product_id: string
  name: string
  hex: string
  image: string | null
  created_at: string
}

export interface ProductSize {
  id: string
  product_id: string
  size: string
  price: number
  available: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  category_id: string
  image: string | null
  featured: boolean
  featured_order: number
  created_at: string
  updated_at: string
  categories?: Category
  product_colors?: ProductColor[]
  product_sizes?: ProductSize[]
}

export interface CartItem {
  productId: string
  productName: string
  productImage: string | null
  colorName: string
  colorHex: string
  colorImage: string | null
  sizeName: string
  price: number
  quantity: number
}
