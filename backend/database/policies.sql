-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- 1. PROFILES POLICIES
-- ------------------------------------------
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ------------------------------------------
-- 2. PRODUCTS POLICIES
-- ------------------------------------------
DROP POLICY IF EXISTS "Products are readable by everyone" ON public.products;
CREATE POLICY "Products are readable by everyone" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sellers can create products" ON public.products;
CREATE POLICY "Sellers can create products" ON public.products
    FOR INSERT WITH CHECK (
        auth.uid() = seller_id AND 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'SELLER'
        )
    );

DROP POLICY IF EXISTS "Sellers can update their own products" ON public.products;
CREATE POLICY "Sellers can update their own products" ON public.products
    FOR UPDATE USING (
        auth.uid() = seller_id AND 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'SELLER'
        )
    );

DROP POLICY IF EXISTS "Sellers can delete their own products" ON public.products;
CREATE POLICY "Sellers can delete their own products" ON public.products
    FOR DELETE USING (
        auth.uid() = seller_id AND 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'SELLER'
        )
    );

-- ------------------------------------------
-- 3. ORDERS POLICIES
-- ------------------------------------------
DROP POLICY IF EXISTS "Buyers can view their own orders" ON public.orders;
CREATE POLICY "Buyers can view their own orders" ON public.orders
    FOR SELECT USING (
        auth.uid() = customer_id OR
        EXISTS (
            SELECT 1 FROM public.order_items oi
            JOIN public.products p ON oi.product_id = p.id
            WHERE oi.order_id = orders.id AND p.seller_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Buyers can create their own orders" ON public.orders;
CREATE POLICY "Buyers can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Sellers/Buyers can update specific orders" ON public.orders;
CREATE POLICY "Sellers/Buyers can update specific orders" ON public.orders
    FOR UPDATE USING (
        auth.uid() = customer_id OR
        EXISTS (
            SELECT 1 FROM public.order_items oi
            JOIN public.products p ON oi.product_id = p.id
            WHERE oi.order_id = orders.id AND p.seller_id = auth.uid()
        )
    );

-- ------------------------------------------
-- 4. ORDER ITEMS POLICIES
-- ------------------------------------------
DROP POLICY IF EXISTS "View order items relation checks" ON public.order_items;
CREATE POLICY "View order items relation checks" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_id AND (
                o.customer_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.products p
                    WHERE p.id = product_id AND p.seller_id = auth.uid()
                )
            )
        )
    );

DROP POLICY IF EXISTS "Insert order items linked checks" ON public.order_items;
CREATE POLICY "Insert order items linked checks" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_id AND o.customer_id = auth.uid()
        )
    );

-- ------------------------------------------
-- 5. CHAT MESSAGES POLICIES
-- ------------------------------------------
DROP POLICY IF EXISTS "Users can view chats they participate in" ON public.chat_messages;
CREATE POLICY "Users can view chats they participate in" ON public.chat_messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can insert their own sent messages" ON public.chat_messages;
CREATE POLICY "Users can insert their own sent messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);
