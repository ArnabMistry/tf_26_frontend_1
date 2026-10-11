import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

export function getSupabase() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Google login is not configured. Set the Supabase URL and public anon key.');
  client = createClient(url, key, {
    auth: { flowType: 'pkce', detectSessionInUrl: false, persistSession: true, autoRefreshToken: true },
  });
  return client;
}

export function saveAuthToken(token: string | null) {
  if (token) localStorage.setItem('tf_auth_token', token);
  else localStorage.removeItem('tf_auth_token');
  window.dispatchEvent(new Event('tf-auth-change'));
}

export async function logout() {
  saveAuthToken(null);
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    await getSupabase().auth.signOut({ scope: 'local' });
  }
}

export async function startGoogleLogin() {
  const { error } = await getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}
