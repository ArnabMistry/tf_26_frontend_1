import { getAuthToken, getRefreshToken, saveAuthTokens, getSupabase } from './supabase';

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export type AuthUser = { id: string; role: 'participant' | 'event_admin' | 'super'; allowedEventIds: string[] | null };

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function onTokenRefreshed(newToken: string | null) {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      const newAccessToken = json.data?.accessToken || json.accessToken;
      const newRefreshToken = json.data?.refreshToken || json.refreshToken || refreshToken;
      if (newAccessToken) {
        saveAuthTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        return newAccessToken;
      }
    }

    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await getSupabase().auth.refreshSession({ refresh_token: refreshToken });
      if (!error && data?.session?.access_token) {
        saveAuthTokens({
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        });
        return data.session.access_token;
      }
    }
  } catch (err) {
    console.warn('Failed to refresh authentication session:', err);
  }
  return null;
}

export async function authRequest(path: string, body?: unknown, token?: string, method?: string) {
  const effectiveToken = token !== undefined ? token : (getAuthToken() || undefined);

  const execute = async (t?: string) => {
    return fetch(`${API_BASE}${path}`, {
      method: method || (body === undefined ? 'GET' : 'POST'),
      headers: {
        'Content-Type': 'application/json',
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: 'no-store',
    });
  };

  let response = await execute(effectiveToken);

  // If 401 Unauthorized occurs on an authenticated route (not login/refresh), attempt refresh
  if (response.status === 401 && !path.startsWith('/api/auth/login') && !path.startsWith('/api/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshedToken = await refreshAccessToken();
      isRefreshing = false;
      onTokenRefreshed(refreshedToken);

      if (refreshedToken) {
        response = await execute(refreshedToken);
      }
    } else {
      const queuedToken = await new Promise<string | null>(resolve => {
        refreshSubscribers.push(resolve);
      });
      if (queuedToken) {
        response = await execute(queuedToken);
      }
    }
  }

  const data = await response.json().catch(() => {
    throw new ApiError('The server returned an invalid response. Please try again.', response.status);
  });
  if (!response.ok) {
    throw new ApiError(data.error?.message || data.error || 'Request failed. Please try again.', response.status);
  }
  return data;
}

export function destination(user: AuthUser) {
  if (user.role === 'super') return '/admin/super';
  if (user.role === 'event_admin') return user.allowedEventIds?.length
    ? `/admin/events/${encodeURIComponent(user.allowedEventIds[0])}` : '/admin/events';
  return '/profile';
}

export function safeReturnPath(path: string | null | undefined) {
  return path && /^\/(?!\/)/.test(path) && !/[\\\r\n]/.test(path) && !path.startsWith('/auth/') && !path.startsWith('/login') ? path : null;
}
