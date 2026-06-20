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
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'kulkarniatharva529@gmail.com');
    
  console.log('Profile for kulkarniatharva529@gmail.com:', profiles, error);
}

check();
