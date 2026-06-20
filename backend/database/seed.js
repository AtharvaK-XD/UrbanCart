/**
 * URBANCART DATABASE SEEDING UTILITY
 * 
 * This script seeds the Supabase PostgreSQL database with products from 'products.json'.
 * Run this script using:
 *   node seed.js <SUPABASE_URL> <SUPABASE_SERVICE_ROLE_KEY> <SELLER_PROFILE_UUID>
 */

const fs = require('fs');
const path = require('path');

// Read command line arguments
const supabaseUrl = process.argv[2];
const supabaseServiceKey = process.argv[3];
const sellerId = process.argv[4];

if (!supabaseUrl || !supabaseServiceKey || !sellerId) {
  console.error('\x1b[31mError: Missing required arguments.\x1b[0m');
  console.log('\nUsage:');
  console.log('  node seed.js <SUPABASE_URL> <SUPABASE_SERVICE_ROLE_KEY> <SELLER_PROFILE_UUID>');
  console.log('\nExample:');
  console.log('  node seed.js https://xyz.supabase.co eyJhbGciOi... 9f91a50a-4712-4c28-971a-e88df2c6c399\n');
  process.exit(1);
}

// Locate products.json
const productsJsonPath = path.resolve(__dirname, '../../frontend/src/data/products.json');
if (!fs.existsSync(productsJsonPath)) {
  console.error(`\x1b[31mError: products.json could not be found at path: ${productsJsonPath}\x1b[0m`);
  process.exit(1);
}

const rawData = fs.readFileSync(productsJsonPath, 'utf8');
const products = JSON.parse(rawData);
console.log(`Successfully parsed ${products.length} products from products.json.`);

// Function to upload a batch of products
async function uploadBatch(batch, batchNum, totalBatches) {
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/products`;
  
  // Format batch data to fit schema.sql structure
  const formattedProducts = batch.map(p => ({
    id: p.id.length === 10 ? undefined : p.id, // Generate UUID on Postgres if product ID is an Amazon ASIN string (10 chars), or leave as UUID
    seller_id: sellerId,
    title: p.title,
    brand: p.brand || '',
    price: Number(p.price) || 0,
    original_price: p.originalPrice ? Number(p.originalPrice) : null,
    category: p.category,
    sub_category: p.subCategory || '',
    image: p.image || '',
    rating: Number(p.rating) || 5.0,
    reviews_count: Number(p.reviewsCount) || 0,
    stock_count: p.inStock ? Math.floor(10 + Math.random() * 90) : 0, // Mock stock count
    tags: Array.isArray(p.tags) ? p.tags : [],
    description: p.description || '',
    specifications: p.specifications || {}
  }));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(formattedProducts)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`REST API returned status ${response.status}: ${errorText}`);
    }

    console.log(`[Batch ${batchNum}/${totalBatches}] Uploaded ${formattedProducts.length} items successfully.`);
  } catch (err) {
    console.error(`\x1b[31m[Batch ${batchNum}/${totalBatches}] Failed to upload products: ${err.message}\x1b[0m`);
  }
}

// Batch controller
async function seedDatabase() {
  const BATCH_SIZE = 50;
  const totalBatches = Math.ceil(products.length / BATCH_SIZE);
  console.log(`Beginning database seed inside ${totalBatches} batches (batch size: ${BATCH_SIZE})...`);

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    await uploadBatch(batch, batchNum, totalBatches);
    
    // Add small delay to prevent rate limits
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n\x1b[32mSeeding completed successfully!\x1b[0m\n');
}

seedDatabase();
