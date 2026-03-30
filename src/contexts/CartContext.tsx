import { createContext, useContext, useState, useCallback } from 'react'
import type { CartItem } from '@/types/product'

interface CartContextValue {
  items: CartItem[]
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (productId: string, colorName: string, sizeName: string) => void
  updateQuantity: (productId: string, colorName: string, sizeName: string, qty: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const addToCart = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === newItem.productId &&
             i.colorName === newItem.colorName &&
             i.sizeName === newItem.sizeName
      )
      if (existing) {
        return prev.map(i =>
          i.productId === newItem.productId &&
          i.colorName === newItem.colorName &&
          i.sizeName === newItem.sizeName
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((productId: string, colorName: string, sizeName: string) => {
    setItems(prev =>
      prev.filter(i => !(i.productId === productId && i.colorName === colorName && i.sizeName === sizeName))
    )
  }, [])

  const updateQuantity = useCallback((productId: string, colorName: string, sizeName: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, colorName, sizeName)
      return
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.colorName === colorName && i.sizeName === sizeName
          ? { ...i, quantity: qty }
          : i
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => setItems([]), [])

  const getCartTotal = useCallback(() =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  [items])

  const getCartCount = useCallback(() =>
    items.reduce((sum, i) => sum + i.quantity, 0),
  [items])

  return (
    <CartContext.Provider value={{
      items,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
