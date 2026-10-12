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

// ── Cookie Helpers ───────────────────────────────────────────────
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, days = 3): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

// ── Token Storage Helpers (Cookies primary with local storage fallback) ──
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie('tf_auth_token') || localStorage.getItem('tf_auth_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie('tf_refresh_token') || localStorage.getItem('tf_refresh_token');
}

export function saveAuthTokens({
  accessToken,
  refreshToken,
}: {
  accessToken?: string | null;
  refreshToken?: string | null;
}) {
  if (accessToken) {
    setCookie('tf_auth_token', accessToken, 3);
    localStorage.setItem('tf_auth_token', accessToken);
  } else if (accessToken === null) {
    deleteCookie('tf_auth_token');
    localStorage.removeItem('tf_auth_token');
  }

  if (refreshToken) {
    setCookie('tf_refresh_token', refreshToken, 3);
    localStorage.setItem('tf_refresh_token', refreshToken);
  } else if (refreshToken === null) {
    deleteCookie('tf_refresh_token');
    localStorage.removeItem('tf_refresh_token');
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tf-auth-change'));
  }
}

export function saveAuthToken(token: string | null, refreshToken?: string | null) {
  saveAuthTokens({ accessToken: token, refreshToken });
}

export async function logout() {
  saveAuthTokens({ accessToken: null, refreshToken: null });
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
