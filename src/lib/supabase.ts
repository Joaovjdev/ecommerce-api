import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, hasSupabaseConfig } from '../config/env.js';

/**
 * Cliente com a anon key. Respeita RLS.
 * Use nas rotas autenticadas, passando o JWT do usuário.
 */
export const supabase: SupabaseClient | null = hasSupabaseConfig()
  ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  : null;

/**
 * Cliente com a service role. Ignora RLS.
 * Use só no servidor: webhooks, jobs e operações administrativas.
 * Nunca exponha essa chave no frontend.
 */
export const supabaseAdmin: SupabaseClient | null = hasSupabaseConfig()
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Copie .env.example para .env e preencha as chaves do painel.',
    );
  }

  return supabase;
}

export function requireSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error(
      'Supabase Admin não configurado. Copie .env.example para .env e preencha SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return supabaseAdmin;
}

export function createUserClient(accessToken: string): SupabaseClient {
  requireSupabase();

  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
