import { supabase } from './supabase'
export { supabase }
import staticProducts from '../data/products.json'

// Check if Supabase keys are configured in the environment
export const isSupabaseLinked = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log(isSupabaseLinked ? "UrbanCart: Supabase configuration linked." : "UrbanCart: Running in local sandbox fallback mode.");

// ==========================================
// 1. PRODUCTS SERVICES
// ==========================================

export async function getProducts() {
  if (!isSupabaseLinked) return staticProducts;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Format database keys to match frontend expectation if needed
    return data.map(dbProduct => ({
      id: dbProduct.id,
      title: dbProduct.title,
      brand: dbProduct.brand,
      price: Number(dbProduct.price),
      originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : null,
      category: dbProduct.category,
      subCategory: dbProduct.sub_category,
      image: dbProduct.image,
      rating: Number(dbProduct.rating),
      reviewsCount: dbProduct.reviews_count,
      inStock: dbProduct.stock_count > 0,
      tags: dbProduct.tags || [],
      seller_id: dbProduct.seller_id,
      description: dbProduct.description,
      specifications: dbProduct.specifications || {},
      stock_count: dbProduct.stock_count
    }));
  } catch (err) {
    console.warn("Failed to fetch products from Supabase. Falling back to static products.json:", err.message);
    return staticProducts;
  }
}

export async function getProductById(id) {
  if (!isSupabaseLinked) {
    return staticProducts.find(p => p.id === id) || null;
  }

  try {
    const { data: dbProduct, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return {
      id: dbProduct.id,
      title: dbProduct.title,
      brand: dbProduct.brand,
      price: Number(dbProduct.price),
      originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : null,
      category: dbProduct.category,
      subCategory: dbProduct.sub_category,
      image: dbProduct.image,
      rating: Number(dbProduct.rating),
      reviewsCount: dbProduct.reviews_count,
      inStock: dbProduct.stock_count > 0,
      tags: dbProduct.tags || [],
      seller_id: dbProduct.seller_id,
      description: dbProduct.description,
      specifications: dbProduct.specifications || {},
      stock_count: dbProduct.stock_count
    };
  } catch (err) {
    console.warn(`Product ID ${id} query failed. Searching in products.json:`, err.message);
    return staticProducts.find(p => p.id === id) || null;
  }
}

// ==========================================
// 2. CHECKOUT & ORDERS SERVICES
// ==========================================

export async function checkoutOrder({ customerId, items, shippingAddress, notes }) {
  if (!isSupabaseLinked) {
    // Local storage order simulation
    const ordersKey = customerId ? `buyer_orders_${customerId}` : 'buyer_orders_anonymous';
    const saved = localStorage.getItem(ordersKey);
    const existingOrders = saved ? JSON.parse(saved) : [];
    
    const mockOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: mockOrderId,
      total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: 'Processing',
      shipping_address: shippingAddress,
      notes: notes || '',
      tracking_number: '',
      created_at: new Date().toISOString(),
      items: items.map(item => ({
        product_id: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        size: item.size,
        price: item.product.price
      }))
    };
    
    localStorage.setItem(ordersKey, JSON.stringify([newOrder, ...existingOrders]));
    return { success: true, orderId: mockOrderId };
  }

  try {
    const session = (await supabase.auth.getSession()).data.session;
    const token = session?.access_token;
    
    // Call Deno Edge Function checkout endpoint
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ customerId, items, shippingAddress, notes })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Checkout failed.");
    }

    return await response.json();
  } catch (err) {
    console.error("Supabase Checkout Function Error:", err);
    throw err;
  }
}

export async function getOrders(userId, isSeller = false) {
  if (!isSupabaseLinked) {
    const key = isSeller ? 'seller_orders' : `buyer_orders_${userId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  }

  try {
    if (isSeller) {
      // Get all orders containing products owned by this seller
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `);
        
      if (error) throw error;
      
      // Filter orders where order items contain seller's products
      return data.filter(order => 
        order.order_items.some(item => item.products && item.products.seller_id === userId)
      ).map(order => ({
        id: order.id,
        date: order.created_at,
        customer: order.shipping_address.fullName,
        email: order.shipping_address.email || 'customer@urbancart.com',
        address: `${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.zip}`,
        total: Number(order.total),
        status: order.status,
        trackingNumber: order.tracking_number,
        notes: order.notes,
        items: order.order_items
          .filter(item => item.products && item.products.seller_id === userId)
          .map(item => ({
            title: item.products.title,
            quantity: item.quantity,
            price: Number(item.price)
          }))
      }));
    } else {
      // Get orders placed by buyer
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map(order => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        shipping_address: order.shipping_address,
        notes: order.notes,
        tracking_number: order.tracking_number,
        created_at: order.created_at,
        items: order.order_items.map(item => ({
          product_id: item.product_id,
          title: item.products?.title || 'Unknown Item',
          quantity: item.quantity,
          size: item.size,
          price: Number(item.price)
        }))
      }));
    }
  } catch (err) {
    console.warn("Failed to query database orders. Loading local storage fallback:", err.message);
    const key = isSeller ? 'seller_orders' : `buyer_orders_${userId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  }
}

// ==========================================
// 3. PAYOUTS SERVICES
// ==========================================

export async function requestPayout(amount, method, account) {
  if (!isSupabaseLinked) {
    // Local storage simulation
    const payoutId = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayout = {
      id: payoutId,
      date: new Date().toISOString().split('T')[0],
      amount: Number(amount),
      method,
      account,
      status: 'Completed'
    };
    
    const saved = localStorage.getItem('seller_payouts');
    const payouts = saved ? JSON.parse(saved) : [];
    localStorage.setItem('seller_payouts', JSON.stringify([newPayout, ...payouts]));
    return { success: true, payoutId, status: 'Completed' };
  }

  try {
    const session = (await supabase.auth.getSession()).data.session;
    const token = session?.access_token;

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ amount, method, destinationAccount: account })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Payout request failed.");
    }

    return await response.json();
  } catch (err) {
    console.error("Supabase Payout Function Error:", err);
    throw err;
  }
}
