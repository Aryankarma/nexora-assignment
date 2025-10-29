# Vibe Commerce - Full Stack E-Commerce Cart

A complete full-stack e-commerce shopping cart application built with React, Node.js/Express, and MongoDB.

## Features

- ✅ Product grid with 8 mock items
- ✅ Add/remove items from cart
- ✅ Update item quantities
- ✅ Real-time cart totals
- ✅ Checkout form with validation
- ✅ Mock receipt generation
- ✅ MongoDB persistence
- ✅ Error handling
- ✅ Responsive design
- ✅ Zustand state management
- ✅ TypeScript throughout
- ✅ Clean, modern UI

## Tech Stack

### Frontend
- React 18
- TypeScript
- Zustand (state management)
- Tailwind CSS
- Vite
- Lucide React (icons)

### Backend
- Node.js
- Express
- MongoDB
- TypeScript
- Mongoose

## Setup Instructions

### Backend Setup

1. Install dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

2. Create `.env` file:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/ecom-cart
PORT=5000
\`\`\`

3. Start MongoDB (if running locally):
\`\`\`bash
mongod
\`\`\`

4. Run the backend:
\`\`\`bash
npm run dev
\`\`\`

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

2. Create `.env` file:
\`\`\`
REACT_APP_API_URL=http://localhost:5000
\`\`\`

3. Run the frontend:
\`\`\`bash
npm run dev
\`\`\`

The frontend will start on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products

### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart` - Add item to cart
  - Body: `{ productId: string, quantity: number }`
- `DELETE /api/cart/:id` - Remove item from cart

### Checkout
- `POST /api/checkout` - Complete checkout
  - Body: `{ cartItems: CartItem[], customerName: string, customerEmail: string }`

## Project Structure

\`\`\`
ecom-cart-app/
├── backend/
│   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProductGrid.tsx
    │   │   ├── Cart.tsx
    │   │   ├── CheckoutForm.tsx
    │   │   └── ReceiptModal.tsx
    │   ├── store/
    │   │   └── cartStore.ts
    │   ├── App.tsx
    │   ├── index.tsx
    │   └── index.css
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── .env.example
\`\`\`

## Features Breakdown

### Core Features
1. **Product Grid** - Displays 8 mock products with images, descriptions, and prices
2. **Add to Cart** - Add products with quantity selection
3. **Cart Management** - View, update quantities, and remove items
4. **Checkout** - Form validation and mock receipt generation
5. **Receipt Modal** - Shows order confirmation with download option

### Bonus Features
1. **MongoDB Persistence** - All cart and receipt data persisted to database
2. **Error Handling** - Comprehensive error messages and validation
3. **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
4. **State Management** - Zustand for clean, efficient state handling
5. **TypeScript** - Full type safety throughout the application

## Usage

1. Browse products on the Products tab
2. Click the shopping cart icon to add items
3. View your cart on the Cart tab
4. Proceed to Checkout tab
5. Enter your name and email
6. Click "Complete Purchase"
7. View and download your receipt

## Deployment

### GitHub
Push your code to GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
\`\`\`

### Hosting Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, Render, Vercel Functions
- **Database**: MongoDB Atlas (cloud)

## Notes

- This is a mock e-commerce application for screening purposes
- No real payments are processed
- All data is stored in MongoDB
- Cart data persists per user session
- Receipts are stored in the database for reference
