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

async function checkRLS() {
  // Query RLS policies from pg_policies if accessible, or fetch via RPC
  // Since pg_policies is system catalog, it might be readable or not depending on anon role.
  // Let's try running a direct query.
  const { data, error } = await supabase.rpc('get_policies_debug');
  console.log('Policies RPC:', data, error);

  // If RPC is not defined, we can try querying profiles to see if the role is correct.
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('*');
  console.log('All Profiles:', profiles, pErr);
}

checkRLS();
