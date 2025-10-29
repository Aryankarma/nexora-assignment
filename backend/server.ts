import express, { type Express, type Request, type Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecom-cart"

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Schemas
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
})

const cartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
})

const cartSchema = new mongoose.Schema({
  userId: { type: String, default: "mock-user" },
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const receiptSchema = new mongoose.Schema({
  userId: { type: String, default: "mock-user" },
  items: [cartItemSchema],
  total: Number,
  customerName: String,
  customerEmail: String,
  timestamp: { type: Date, default: Date.now },
})

const Product = mongoose.model("Product", productSchema)
const Cart = mongoose.model("Cart", cartSchema)
const Receipt = mongoose.model("Receipt", receiptSchema)

// Initialize mock products
const initializeProducts = async () => {
  const count = await Product.countDocuments()
  if (count === 0) {
    const mockProducts = [
      {
        id: "1",
        name: "Wireless Headphones",
        price: 79.99,
        description: "Premium noise-cancelling headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        category: "Electronics",
      },
      {
        id: "2",
        name: "Smart Watch",
        price: 199.99,
        description: "Advanced fitness tracking smartwatch",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        category: "Electronics",
      },
      {
        id: "3",
        name: "Portable Speaker",
        price: 49.99,
        description: "Waterproof Bluetooth speaker",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
        category: "Audio",
      },
      {
        id: "4",
        name: "USB-C Cable",
        price: 12.99,
        description: "Fast charging USB-C cable",
        image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop",
        category: "Accessories",
      },
      {
        id: "5",
        name: "Phone Stand",
        price: 19.99,
        description: "Adjustable phone stand for desk",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
        category: "Accessories",
      },
      {
        id: "6",
        name: "Wireless Charger",
        price: 34.99,
        description: "Fast wireless charging pad",
        image: "https://images.unsplash.com/photo-1591290619762-8b0a3e2f0e3e?w=500&h=500&fit=crop",
        category: "Accessories",
      },
      {
        id: "7",
        name: "Screen Protector",
        price: 9.99,
        description: "Tempered glass screen protector",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop",
        category: "Accessories",
      },
      {
        id: "8",
        name: "Phone Case",
        price: 24.99,
        description: "Durable protective phone case",
        image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&h=500&fit=crop",
        category: "Accessories",
      },
    ]
    await Product.insertMany(mockProducts)
    console.log("Mock products initialized")
  }
}

initializeProducts()

// Routes

// GET /api/products
app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// GET /api/cart
app.get("/api/cart", async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ userId: "mock-user" })
    if (!cart) {
      cart = new Cart({ userId: "mock-user", items: [] })
      await cart.save()
    }
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    res.json({ ...cart.toObject(), total: Number.parseFloat(total.toFixed(2)) })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" })
  }
})

// POST /api/cart
app.post("/api/cart", async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid product ID or quantity" })
    }

    const product = await Product.findOne({ id: productId })
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    let cart = await Cart.findOne({ userId: "mock-user" })
    if (!cart) {
      cart = new Cart({ userId: "mock-user", items: [] })
    }

    const existingItem = cart.items.find((item) => item.productId === productId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      })
    }

    cart.updatedAt = new Date()
    await cart.save()

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    res.json({ ...cart.toObject(), total: Number.parseFloat(total.toFixed(2)) })
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" })
  }
})

// DELETE /api/cart/:id
app.delete("/api/cart/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const cart = await Cart.findOne({ userId: "mock-user" })
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item.productId !== id)
    cart.updatedAt = new Date()
    await cart.save()

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    res.json({ ...cart.toObject(), total: Number.parseFloat(total.toFixed(2)) })
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" })
  }
})

// POST /api/checkout
app.post("/api/checkout", async (req: Request, res: Response) => {
  try {
    const { cartItems, customerName, customerEmail } = req.body

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" })
    }

    if (!customerName || !customerEmail) {
      return res.status(400).json({ error: "Customer name and email are required" })
    }

    const total = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const receipt = new Receipt({
      userId: "mock-user",
      items: cartItems,
      total: Number.parseFloat(total.toFixed(2)),
      customerName,
      customerEmail,
    })

    await receipt.save()

    // Clear cart after checkout
    await Cart.updateOne({ userId: "mock-user" }, { items: [], updatedAt: new Date() })

    res.json({
      success: true,
      receipt: {
        id: receipt._id,
        items: cartItems,
        total: Number.parseFloat(total.toFixed(2)),
        customerName,
        customerEmail,
        timestamp: receipt.timestamp,
      },
    })
  } catch (error) {
    res.status(500).json({ error: "Checkout failed" })
  }
})

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
