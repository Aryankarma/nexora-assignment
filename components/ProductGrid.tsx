"use client"

import React from "react"
import { useCartStore } from "@/store/cartStore"
import { ShoppingCart, AlertCircle } from "lucide-react"

export const ProductGrid: React.FC = () => {
  const { products, loading, error, addToCart } = useCartStore()
  const [addingId, setAddingId] = React.useState<string | null>(null)

  const handleAddToCart = async (productId: string) => {
    setAddingId(productId)
    await addToCart(productId, 1)
    setAddingId(null)
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
        >
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={addingId === product.id}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
