# ⚙️ UrbanCart Backend — Serverless Configuration & Deployment Guide

This directory houses the backend logic for UrbanCart, built using **Supabase** (PostgreSQL database, Row Level Security policies, automatic triggers, and serverless Edge Functions).

---

## 📁 Directory Structure

```
backend/
├── database/
│   ├── schema.sql        # Database tables, relationships, and indices
│   ├── triggers.sql      # Auto-creates user profiles on Supabase Auth signup
│   ├── policies.sql      # Row Level Security (RLS) policies for security
│   └── seed.js           # CLI database seeding utility for catalog products
├── supabase/
│   └── functions/
│       ├── checkout/     # Deno serverless function handling inventory checks
│       └── payout/       # Deno serverless function handling withdrawals
└── README.md             # This deployment guide
```

---

## 🚀 Step 1: Database Schema & Migration

Copy and execute the SQL scripts directly in the **Supabase SQL Editor** in the following order:

1. **[schema.sql](database/schema.sql)**: Builds the tables for profiles, products, orders, order items, and chat logs.
2. **[triggers.sql](database/triggers.sql)**: Installs the trigger to automatically sync new registered users into the public profile records.
3. **[policies.sql](database/policies.sql)**: Activates Row Level Security (RLS) configurations to secure tables.

---

## 📦 Step 2: Seed Database Products

Load initial products from `products.json` into the postgres database using the Node.js seeding utility:

```bash
cd backend/database
node seed.js <SUPABASE_URL> <SUPABASE_SERVICE_ROLE_KEY> <SELLER_PROFILE_UUID>
```

### Argument Explanations:
* `<SUPABASE_URL>`: Found in **Supabase Dashboard ➔ Project Settings ➔ API**.
* `<SUPABASE_SERVICE_ROLE_KEY>`: Found in **Supabase Dashboard ➔ Project Settings ➔ API** (Keep this secure; it bypasses RLS policies during seeding).
* `<SELLER_PROFILE_UUID>`: The unique identifier (`UUID`) of a seller profile. Sign up as a seller on the frontend or create one in the dashboard, copy the user profile UUID, and paste it here.

---

## ⚡ Step 3: Deploying Supabase Edge Functions

Supabase Edge Functions are written in TypeScript and run inside Deno sandboxes.

### 1. Install the Supabase CLI
Follow the installation guide for your OS:
```bash
# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# macOS (Homebrew)
brew install supabase/tap/supabase
```

### 2. Login and Link to Project
Retrieve your Project Ref token from the Supabase dashboard URL (`https://supabase.com/dashboard/project/<PROJECT_REF>`) and link:
```bash
supabase login
supabase link --project-ref <PROJECT_REF>
```

### 3. Deploy Edge Functions
Deploy both functions directly to production:
```bash
supabase functions deploy checkout
supabase functions deploy payout
```

### 4. Running Locally for Testing
To launch the Edge Functions inside a local emulator:
```bash
# Starts local environment services
supabase start

# Serves edge functions on http://localhost:54321
supabase functions serve
```

---

## 🔒 Security Auditing (RLS Policies)

The RLS policies in **[policies.sql](database/policies.sql)** guarantee that:
* **Product Management**: Only authenticated users with the `SELLER` role can insert, update, or delete products.
* **Order Isolation**: Buyers can only fetch their own orders. Sellers can only fetch orders containing products belonging to their store inventory.
* **Chat Access**: Direct messages are restricted strictly to the sender and receiver.
