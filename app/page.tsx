"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cartStore"
import { ProductGrid } from "@/components/ProductGrid"
import { Cart } from "@/components/Cart"
import { CheckoutForm } from "@/components/CheckoutForm"
import { ReceiptModal } from "@/components/ReceiptModal"
import { ShoppingCart, Package } from "lucide-react"

type View = "products" | "cart" | "checkout"

export default function Page() {
  const { cart, receipt, fetchProducts, fetchCart, clearReceipt } = useCartStore()
  const [view, setView] = useState<View>("products")
  const [showReceipt, setShowReceipt] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [fetchProducts, fetchCart])

  useEffect(() => {
    if (receipt) {
      setShowReceipt(true)
    }
  }, [receipt])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckoutSuccess = () => {
    setShowReceipt(true)
  }

  const handleCloseReceipt = () => {
    setShowReceipt(false)
    clearReceipt()
    setView("products")
  }

  const handleCheckoutClick = () => {
    setView("checkout")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Vibe Commerce</h1>
            </div>
            <button
              onClick={() => setView("cart")}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setView("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                view === "products"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setView("cart")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                view === "cart"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>
            {cart.length > 0 && (
              <button
                onClick={() => setView("checkout")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  view === "checkout"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "products" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
            <ProductGrid />
          </div>
        )}

        {view === "cart" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h2>
            <Cart onCheckout={handleCheckoutClick} />
          </div>
        )}

        {view === "checkout" && (
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h2>
            <CheckoutForm onSuccess={handleCheckoutSuccess} />
          </div>
        )}
      </main>

      {/* Receipt Modal */}
      {showReceipt && receipt && <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">© 2025 Vibe Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
