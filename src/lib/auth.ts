import { clearSignedIn } from './session';

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
export type AuthUser = { id: string; role: 'participant' | 'event_admin' | 'super'; allowedEventIds: string[] | null };

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

/**
 * Call the backend as the signed-in user.
 *
 * The session is an httpOnly cookie, so authentication is entirely a matter of
 * `credentials: 'include'`. There is no token to pass, and no refresh dance to
 * run: Better Auth slides the session's expiry forward on its own while the
 * user stays active.
 *
 * The third parameter is accepted and ignored. It is kept so the many existing
 * `authRequest(path, body, token)` call sites still type-check during the
 * migration away from bearer tokens; new code should omit it.
 */
export async function authRequest(path: string, body?: unknown, _legacyToken?: string, method?: string) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: method || (body === undefined ? 'GET' : 'POST'),
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    credentials: 'include',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => {
    throw new ApiError('The server returned an invalid response. Please try again.', response.status);
  });

  if (!response.ok) {
    // The server is the authority on whether we are signed in; keep the local
    // optimistic hint honest the moment it disagrees.
    if (response.status === 401) clearSignedIn();
    throw new ApiError(data.error?.message || data.error || data.message || 'Request failed. Please try again.', response.status);
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
