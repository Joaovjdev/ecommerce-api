import 'dotenv/config';

function read(name: string): string {
  return process.env[name]?.trim() ?? '';
}

export const env = {
  NODE_ENV: read('NODE_ENV') || 'development',
  PORT: Number(read('PORT') || 3000),
  SUPABASE_URL: read('SUPABASE_URL'),
  SUPABASE_ANON_KEY: read('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: read('SUPABASE_SERVICE_ROLE_KEY'),
};

export function hasSupabaseConfig(): boolean {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  return !env.SUPABASE_URL.includes('SEU-PROJETO');
}
