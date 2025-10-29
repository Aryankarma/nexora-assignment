"use client"

import type React from "react"
import { useCartStore } from "@/store/cartStore"
import { Trash2, Plus, Minus, AlertCircle } from "lucide-react"

interface CartProps {
  onCheckout?: () => void
}

export const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const { cart, loading, error, removeFromCart, updateQuantity } = useCartStore()

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg">Your cart is empty</p>
        <p className="text-gray-500 text-sm mt-2">Add items from the products grid to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <div key={item.productId} className="bg-white rounded-lg shadow-sm p-4 flex gap-4 items-start">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg bg-gray-100"
          />
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1">${item.price.toFixed(2)} each</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              disabled={loading}
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={loading}
              className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
            <button
              onClick={() => removeFromCart(item.productId)}
              disabled={loading}
              className="text-red-600 hover:text-red-700 text-sm mt-2 transition-colors disabled:opacity-50"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      <div className="bg-white rounded-lg shadow-sm p-4 border-t-2 border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={loading || cart.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  )
}
