"use client"

import type React from "react"
import type { Receipt } from "@/store/cartStore"
import { X, CheckCircle } from "lucide-react"

interface ReceiptModalProps {
  receipt: Receipt
  onClose: () => void
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  const handleDownload = () => {
    const receiptText = `
RECEIPT
Order ID: ${receipt.id}
Date: ${new Date(receipt.timestamp).toLocaleString()}

Customer: ${receipt.customerName}
Email: ${receipt.customerEmail}

Items:
${receipt.items.map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

Total: $${receipt.total.toFixed(2)}
    `.trim()

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(receiptText))
    element.setAttribute("download", `receipt-${receipt.id}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Order Confirmation</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your purchase!</h3>
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-mono font-semibold">{receipt.id}</span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Customer</p>
              <p className="font-semibold text-gray-900">{receipt.customerName}</p>
              <p className="text-sm text-gray-600">{receipt.customerEmail}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Order Date</p>
              <p className="text-sm text-gray-900">{new Date(receipt.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Items</p>
            {receipt.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} <span className="text-gray-500">x{item.quantity}</span>
                </span>
                <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
