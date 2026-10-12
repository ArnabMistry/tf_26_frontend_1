'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, authRequest, destination, safeReturnPath } from '@/lib/auth';
import { getSupabase, logout, saveAuthToken } from '@/lib/supabase';

// Share completion across React Strict Mode effect replays: a code is single-use.
let completion: Promise<string> | undefined;

async function completeLogin() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const code = searchParams.get('code') || hashParams.get('code');
  const flowId = searchParams.get('sb_flow_id') || hashParams.get('sb_flow_id');
  const denied = searchParams.has('error') || hashParams.has('error');
  const rawErrorDesc = searchParams.get('error_description') || hashParams.get('error_description') || searchParams.get('error') || hashParams.get('error');

  window.history.replaceState({}, '', '/auth/callback');

  if (denied) {
    const detail = rawErrorDesc ? `: ${decodeURIComponent(rawErrorDesc.replace(/\+/g, ' '))}` : '';
    throw new Error(`Google sign-in was cancelled or denied${detail}. Please try again.`);
  }

  if (!code) {
    // Check if an existing session is already established
    try {
      const { data: existingSession } = await getSupabase().auth.getSession();
      if (existingSession?.session?.access_token) {
        saveAuthToken(existingSession.session.access_token, existingSession.session.refresh_token);
        const next = safeReturnPath(sessionStorage.getItem('tf_return_to'));
        sessionStorage.removeItem('tf_return_to');
        return next || '/profile';
      }
    } catch (_) {}
    throw new Error('Missing login code. Start Google sign-in again.');
  }

  const { data, error } = await getSupabase().auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);
  if (error || !data.session) {
    throw new Error(`Google sign-in expired or could not be verified (${error?.message || 'No session'}). Please try again.`);
  }

  try {
    const profile = await authRequest('/api/auth/me', undefined, data.session.access_token);
    if (!profile.data?.user?.id) throw new Error('Unable to load your profile. Please try again.');
    saveAuthToken(data.session.access_token, data.session.refresh_token);
    const next = safeReturnPath(sessionStorage.getItem('tf_return_to'));
    sessionStorage.removeItem('tf_return_to');
    return next || destination(profile.data.user);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await logout();
      throw error;
    }
    // If backend profile load experienced a transient hiccup or rate-limit, keep the valid session
    saveAuthToken(data.session.access_token, data.session.refresh_token);
    const next = safeReturnPath(sessionStorage.getItem('tf_return_to'));
    sessionStorage.removeItem('tf_return_to');
    return next || '/profile';
  }
}

export default function OAuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    completion ??= completeLogin();
    completion
      .then(path => {
        if (active) router.replace(path);
      })
      .catch(err => {
        // Clear cached promise on error so retrying isn't permanently locked
        completion = undefined;
        if (active) setError(err instanceof Error ? err.message : 'Google sign-in failed.');
      });

    return () => {
      active = false;
    };
  }, [router]);
  return <main className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#181135] p-6 text-white">
    <h1 className="text-2xl font-bold">Google sign-in</h1>
    {error ? <><p role="alert">{error}</p><Link href="/login" className="text-[#FFFF1A] underline">Back to login</Link></>
      : <p role="status">Signing you in and loading your profile…</p>}
  </main>;
}
