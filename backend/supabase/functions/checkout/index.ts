import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

// Setup CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Initialise Supabase Service Role client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration environment variables.")
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Parse request payload
    const { customerId, items, shippingAddress, notes } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid items list supplied." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!shippingAddress) {
      return new Response(
        JSON.stringify({ error: "Shipping address is required." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Process checkout within database transactions/checks
    let calculatedTotal = 0
    const checkedItems = []

    // Fetch and check all products
    for (const item of items) {
      const { data: product, error: productErr } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.id)
        .single()

      if (productErr || !product) {
        return new Response(
          JSON.stringify({ error: `Product ID ${item.id} not found in inventory.` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (product.stock_count < item.quantity) {
        return new Response(
          JSON.stringify({ error: `Insufficient stock for product: ${product.title}. Available: ${product.stock_count}, Requested: ${item.quantity}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      calculatedTotal += Number(product.price) * item.quantity
      checkedItems.push({
        product,
        quantity: item.quantity,
        size: item.size || null,
        price: product.price
      })
    }

    // 4. Update inventories and insert orders
    // First, insert order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId || null,
        total: calculatedTotal,
        status: 'Processing',
        shipping_address: shippingAddress,
        notes: notes || '',
        tracking_number: ''
      })
      .select()
      .single()

    if (orderErr || !order) {
      throw new Error(`Failed to create order: ${orderErr?.message}`)
    }

    // Insert order items & decrement stock counts
    for (const checked of checkedItems) {
      // Create line item record
      const { error: lineItemErr } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: checked.product.id,
          quantity: checked.quantity,
          size: checked.size,
          price: checked.price
        })

      if (lineItemErr) {
        throw new Error(`Failed to log order item: ${lineItemErr.message}`)
      }

      // Decrement stock in database
      const newStockCount = checked.product.stock_count - checked.quantity
      const { error: updateStockErr } = await supabase
        .from('products')
        .update({ stock_count: newStockCount })
        .eq('id', checked.product.id)

      if (updateStockErr) {
        throw new Error(`Failed to deduct stock for product ID ${checked.product.id}: ${updateStockErr.message}`)
      }
    }

    // 5. Success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Order placed securely.", 
        orderId: order.id, 
        total: calculatedTotal 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
