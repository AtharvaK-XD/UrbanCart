# 🛒 UrbanCart — Premium Curated E-Commerce Ecosystem

[![Live Site](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel&logoColor=white&color=1B7A5E)](https://urban-cart-sage.vercel.app/)
[![React Version](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-yellow?style=for-the-badge&logo=vite&logoColor=white&color=646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css&logoColor=white&color=06B6D4)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=for-the-badge&logo=supabase&logoColor=white&color=3ECF8E)](https://supabase.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-BaaS-red?style=for-the-badge&logo=appwrite&logoColor=white&color=FD366E)](https://appwrite.io/)

**UrbanCart** is a modern, premium e-commerce ecosystem built from the ground up to offer an elegant, visually captivating, and fluid shopping experience. Designed with a sleek aesthetic featuring glassmorphic layouts, deep dark branding accents, premium jade-green branding (`#1B7A5E`), and smooth animations, it caters to both retail buyers and merchants looking for a robust storefront.

🔗 **Explore the Live Application**: [https://urban-cart-sage.vercel.app/](https://urban-cart-sage.vercel.app/)

---

## 🌟 Core Idea & Product Vision

UrbanCart is built on the philosophy of **premium curation**. Instead of overwhelming consumers with standard, cluttered grid designs, UrbanCart presents a high-end, visual-first space for high-quality goods, designer apparel, and home essentials. 

To bridge the gap between traditional online catalogs and interactive retail assistance, UrbanCart integrates an **AI-driven Intelligent Shopping Companion (Chatbot)** directly into the user experience. Furthermore, it implements a dual-sided marketplace workflow:
1. **For Buyers**: A frictionless checkout journey, real-time order tracking steps, interactive return handling, and direct-to-seller messaging.
2. **For Sellers**: A complete, command-center style admin panel featuring responsive analytics charts, inventory controllers, kanban board order fulfillment, wallet payout ledger settlements, and direct buyer CRM chats.

---

## 🛠️ Tech Stack & Architecture

UrbanCart uses a cutting-edge client-centric architecture to maintain fast load times and fluid page transitions.

### Frontend & Core Utilities
* **React 19**: Powered by React's latest fiber architecture, enabling concurrent rendering features and optimized component lifecycles.
* **Vite 8**: Serving as the next-generation bundler for rapid development server startup and optimized production code splitting.
* **React Router DOM v7**: Seamless single-page app (SPA) routing, handling nested layouts and route protection constraints based on user roles.
* **Zustand v5**: A lightweight, fast, and scalable state-management solution used for tracking active user sessions and checkout cart actions.
* **Framer Motion v12**: Driving high-performance declarative UI animations, grid staggers, fade-ins, and slider transitions.
* **Tailwind CSS v3**: Clean, utility-first styling with custom configurations for branding tokens (Jade `#1B7A5E`, Ink `#15171C`, Amber `#E8A33D`).
* **Lucide React**: Crisp, modern icon pack.

### Backend-as-a-Service (BaaS) & Persistence
* **Supabase**: Handles main user authentication, session verification, and Google OAuth redirection. Additionally stores customizable user metadata (such as the `'BUYER'` or `'SELLER'` authorization role).
* **Appwrite**: Integrated client libraries configured for auxiliary services.
* **Local Storage / Session Storage**: Maintains persistent seller dashboards, catalog updates, payout ledgers, order states, and customer CRM chats locally, making the demo immediate and interactive.
* **Static Databases**: Custom JSON indexes hosting 500KB+ product items and 270KB+ customer review records for search mockups.

---

## 🚀 Key Features

### 🛍️ 1. Buyer Experience
* **Dynamic Collections Hub**: Filter through products by category department, price range, brand, or customer rating with live results.
* **Detailed Product Showcase**: Dynamic page layouts featuring image zooms, product size configurations, and live review displays.
* **Frictionless Shopping Cart & Drawer**: Slide-out cart drawer supporting real-time quantity adjustments, size selectors, and subtotal updates.
* **Multi-Step Checkout**: Visual, validated billing form verifying card/UPI details and producing a post-purchase printable invoice.
* **Interactive Shipping Tracker**: Interactive tracker illustrating shipping milestones (Placed ➔ Processing ➔ Shipped ➔ Delivered) with custom tracking codes.
* **Return & Exchange Portal**: Digital return registration allowing buyers to exchange products within a 30-day warranty period.

### 🏪 2. Seller Command Center (Dashboard)
* **Analytics Hub**: Curved SVG graphs charting revenue and visitor trends. Displays real-time rolling figures for sales, conversion rate, and average order value.
* **Catalog & Inventory Controller**: Master table/grid listing allowing merchants to add new listings (with auto-generated SKU identifiers), edit prices inline, and trigger instant stock adjustments.
* **Order Fulfillment Kanban**: A responsive board separating orders into processing lanes. Supports transition updates, printing invoices, and tracking code registrations.
* **Ledger Settlements**: Wallet balance viewer showing pending payouts with interactive loading steps simulating HDFC Bank/UPI transfers.
* **Customer CRM Chats**: Direct communication interface containing mock dialog histories and dynamic responses inspired by *The Office* characters (Michael, Dwight, Jim, Pam).

### 🤖 3. Intelligent Shopping Companion
* **Keyword Token Weighting**: Powered by a custom string-matching scoring algorithm that filters stop words and ranks brand, category, tags, and description matches.
* **Quick Navigation Triggers**: Provides one-click action replies redirecting users to specific products, categories, return forms, or shipping trackers.

---

## 📁 Repository Structure

```
UrbanCart/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI elements (Navbar, CartDrawer, Chatbot, ProductCard, Toast, etc.)
│   │   ├── pages/            # Core views (Home, Category, ProductDetail, Checkout, SellerDashboard, etc.)
│   │   ├── lib/              # Client initializations (supabase.js, appwrite.js)
│   │   ├── store/            # Zustand global stores (useAuthStore.js, useCartStore.js)
│   │   ├── data/             # JSON mock databases (products, reviews, sellerOrders)
│   │   ├── assets/           # Media resources
│   │   ├── App.jsx           # Main routing configuration
│   │   └── index.css         # Styling system & custom utility animations
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Design system token configuration
│   └── vite.config.js        # Vite build configurations
├── backend/                  # Reserved for future server extensions
└── database/                 # Database schema templates and configurations
```

---

## ⚡ Getting Started

Follow these steps to run the application locally:

### 1. Clone the project and enter the directory
```bash
<<<<<<< HEAD
git clone https://github.com/your-username/UrbanCart.git
=======
git clone https://github.com/AtharvaK-XD/UrbanCart.git
>>>>>>> 8cdeb420f03dbf1d0d42cc47885f930b5bb35918
cd UrbanCart/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the `frontend` folder and specify your Supabase and Appwrite credentials:
```env
# Appwrite Configuration
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id_here
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1

# Supabase Configuration
VITE_SUPABASE_URL=https://your_supabase_url_here.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---
