export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export type AuthUser = { id: string; role: 'participant' | 'event_admin' | 'super'; allowedEventIds: string[] | null };

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function authRequest(path: string, body?: unknown, token?: string, method?: string) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: method || (body === undefined ? 'GET' : 'POST'),
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store',
  });
  const data = await response.json().catch(() => { throw new ApiError('The server returned an invalid response. Please try again.', response.status); });
  if (!response.ok) throw new ApiError(data.error?.message || data.error || 'Request failed. Please try again.', response.status);
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
