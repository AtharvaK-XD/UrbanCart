import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const envText = fs.readFileSync(envPath, 'utf8');
const envConfig = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    envConfig[match[1]] = value.trim();
  }
});

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, seller_id, title');
    
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  const counts = {};
  products.forEach(p => {
    counts[p.seller_id] = (counts[p.seller_id] || 0) + 1;
  });
  
  console.log('Product counts by seller_id:', counts);
  
  const targetSeller = 'e4471081-62b5-463a-b090-cc9431568936';
  const targetProducts = products.filter(p => p.seller_id === targetSeller);
  console.log(`Products for seller ${targetSeller}:`, targetProducts);
}

check();
