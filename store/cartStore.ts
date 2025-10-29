import { create } from "zustand"

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
}

export interface Receipt {
  id: string
  items: CartItem[]
  total: number
  customerName: string
  customerEmail: string
  timestamp: string
}

interface CartStore {
  cart: CartItem[]
  products: Product[]
  receipt: Receipt | null
  loading: boolean
  error: string | null

  // Actions
  setCart: (cart: CartItem[]) => void
  setProducts: (products: Product[]) => void
  setReceipt: (receipt: Receipt | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addToCart: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  fetchCart: () => Promise<void>
  fetchProducts: () => Promise<void>
  checkout: (items: CartItem[], name: string, email: string) => Promise<void>
  clearReceipt: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  products: [],
  receipt: null,
  loading: false,
  error: null,

  setCart: (cart) => set({ cart }),
  setProducts: (products) => set({ products }),
  setReceipt: (receipt) => set({ receipt }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/api/products`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const products = await response.json()
      set({ products, loading: false })
    } catch (error) {
      set({ error: "Failed to load products", loading: false })
      console.error("Error fetching products:", error)
    }
  },

  fetchCart: async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart`)
      if (!response.ok) throw new Error("Failed to fetch cart")
      const data = await response.json()
      set({ cart: data.items || [] })
    } catch (error) {
      set({ error: "Failed to load cart" })
      console.error("Error fetching cart:", error)
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })
      if (!response.ok) throw new Error("Failed to add item")
      const data = await response.json()
      set({ cart: data.items || [], loading: false })
    } catch (error) {
      set({ error: "Failed to add item to cart", loading: false })
      console.error("Error adding to cart:", error)
    }
  },

  removeFromCart: async (productId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to remove item")
      const data = await response.json()
      set({ cart: data.items || [], loading: false })
    } catch (error) {
      set({ error: "Failed to remove item from cart", loading: false })
      console.error("Error removing from cart:", error)
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await get().removeFromCart(productId)
      return
    }

    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: quantity - (get().cart.find((i) => i.productId === productId)?.quantity || 0),
        }),
      })
      if (!response.ok) throw new Error("Failed to update quantity")
      const data = await response.json()
      set({ cart: data.items || [], loading: false })
    } catch (error) {
      set({ error: "Failed to update quantity", loading: false })
      console.error("Error updating quantity:", error)
    }
  },

  checkout: async (items: CartItem[], name: string, email: string) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: items, customerName: name, customerEmail: email }),
      })
      if (!response.ok) throw new Error("Checkout failed")
      const data = await response.json()

      const receipt: Receipt = {
        id: data.receipt.id,
        items: data.receipt.items,
        total: data.receipt.total,
        customerName: data.receipt.customerName,
        customerEmail: data.receipt.customerEmail,
        timestamp: data.receipt.timestamp,
      }

      set({ receipt, cart: [], loading: false })
    } catch (error) {
      set({ error: "Checkout failed", loading: false })
      console.error("Error during checkout:", error)
    }
  },

  clearReceipt: () => set({ receipt: null }),
}))
