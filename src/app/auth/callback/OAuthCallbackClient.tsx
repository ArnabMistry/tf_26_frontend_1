'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, authRequest, destination, safeReturnPath } from '@/lib/auth';
import { logout, markSignedIn } from '@/lib/session';

/** Google has already returned to the backend, which set the session cookie. */
export default function OAuthCallbackClient() {
  const router = useRouter();
  const [error, setError] = useState('');
  const deniedRef = useRef<boolean | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      if (deniedRef.current === null) deniedRef.current = params.has('error');
      const denied = deniedRef.current;
      window.history.replaceState({}, '', '/auth/callback');

      if (denied) {
        throw new Error('Google sign-in was cancelled or denied. Please try again.');
      }

      const profile = await authRequest('/api/auth/me');
      if (!profile.data?.user?.id) {
        throw new Error('Unable to load your profile. Please try again.');
      }

      markSignedIn();
      const next = safeReturnPath(sessionStorage.getItem('tf_return_to'));
      sessionStorage.removeItem('tf_return_to');
      return next || destination(profile.data.user);
    })()
      .then(path => { if (active) router.replace(path); })
      .catch(async err => {
        if (err instanceof ApiError && err.status === 401) {
          await logout();
        }
        if (active) setError(err instanceof Error ? err.message : 'Google sign-in failed.');
      });

    return () => { active = false; };
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#181135] p-6 text-white">
      <h1 className="text-2xl font-bold">Google sign-in</h1>
      {error
        ? <><p role="alert">{error}</p><Link href="/login" className="text-[#FFFF1A] underline">Back to login</Link></>
        : <p role="status">Signing you in and loading your profile…</p>}
    </main>
  );
}
