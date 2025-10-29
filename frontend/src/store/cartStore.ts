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

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

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
      if (!response.ok) throw new Error("Failed to add to cart")
      const data = await response.json()
      set({ cart: data.items || [], loading: false })
    } catch (error) {
      set({ error: "Failed to add item to cart", loading: false })
    }
  },

  removeFromCart: async (productId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to remove from cart")
      const data = await response.json()
      set({ cart: data.items || [], loading: false })
    } catch (error) {
      set({ error: "Failed to remove item from cart", loading: false })
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await get().removeFromCart(productId)
      return
    }

    set({ loading: true, error: null })
    try {
      const currentCart = get().cart
      const item = currentCart.find((i) => i.productId === productId)
      if (!item) throw new Error("Item not found")

      const quantityDiff = quantity - item.quantity
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: quantityDiff }),
      })
      if (!response.ok) throw new Error("Failed to update quantity")
      const data = await response.json()
      set({ cart: data.items || [], loading: false })
    } catch (error) {
      set({ error: "Failed to update quantity", loading: false })
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
      set({ receipt: data.receipt, cart: [], loading: false })
    } catch (error) {
      set({ error: "Checkout failed", loading: false })
    }
  },

  clearReceipt: () => set({ receipt: null }),
}))
