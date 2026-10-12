/**
 * Session helpers — Better Auth, cookie-based.
 *
 * This replaces src/lib/supabase.ts. The session now lives in an httpOnly
 * cookie set by the backend, which means:
 *
 *   - JavaScript cannot read the session. There is no access token to stash in
 *     localStorage, nothing to attach to an Authorization header, and nothing
 *     to refresh by hand — the browser sends the cookie automatically, as long
 *     as every request is made with `credentials: 'include'`.
 *   - The only question the client can answer locally is "have I signed in on
 *     this device recently?" That is what the sign-in *hint* below is for: it
 *     drives first-paint UI so the app does not flash a logged-out shell. It is
 *     a convenience, never an authorisation decision — the backend decides.
 *
 * For the hint to be trustworthy enough to be useful, it is cleared on every
 * 401 and on logout.
 */
import { API_BASE } from './auth';

const HINT_KEY = 'tf_signed_in';
export const AUTH_CHANGE_EVENT = 'tf-auth-change';

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

/** Remember that this device has a session, so the next load can paint optimistically. */
export function markSignedIn() {
  try { localStorage.setItem(HINT_KEY, '1'); } catch { /* private mode */ }
  emitChange();
}

/** Forget the local hint. Does not itself end the server-side session. */
export function clearSignedIn() {
  try { localStorage.removeItem(HINT_KEY); } catch { /* private mode */ }
  emitChange();
}

/**
 * Cheap, local, optimistic check. True means "probably signed in, go ask the
 * server". False means "definitely show the logged-out UI".
 */
export function hasSessionHint(): boolean {
  if (typeof window === 'undefined') return false;
  try { return localStorage.getItem(HINT_KEY) === '1'; } catch { return false; }
}

/** Begin Google sign-in. Redirects away from the page on success. */
export async function startGoogleLogin(returnTo?: string | null) {
  if (returnTo) {
    try { sessionStorage.setItem('tf_return_to', returnTo); } catch { /* ignore */ }
  }

  // Better Auth answers with the Google consent URL; the browser then goes to
  // Google, and Google redirects back to the BACKEND callback. The backend
  // sets the session cookie and forwards the browser to `callbackURL`.
  const res = await fetch(`${API_BASE}/api/auth/sign-in/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      provider: 'google',
      callbackURL: `${window.location.origin}/auth/callback`,
      errorCallbackURL: `${window.location.origin}/auth/callback?error=google`,
    }),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) {
    throw new Error(data?.message || 'Google sign-in is unavailable right now. Please try again.');
  }
  window.location.href = data.url;
}

/** End the session on the server and locally. */
export async function logout() {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
    });
  } catch {
    // Network failure still clears local state; the cookie expires on its own.
  }
  clearSignedIn();
}

/** Request a password reset email. */
export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/request-password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      redirectTo: `${window.location.origin}/reset-password`,
    }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Could not send the reset email.');
  }
}

/** Set a new password using the token from the reset email. */
export async function resetPassword(newPassword: string, token: string) {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ newPassword, token }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Could not reset the password. The link may have expired.');
  }
}

// ── Email OTP (replaces Supabase's confirmation link) ──────────────
export async function sendEmailOtp(email: string) {
  const res = await fetch(`${API_BASE}/api/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error?.message || 'Could not send the code.');
  return data.data;
}

export async function verifyEmailOtp(email: string, otp: string) {
  const res = await fetch(`${API_BASE}/api/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, otp }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error?.message || 'That code was not accepted.');
  return data.data;
}
