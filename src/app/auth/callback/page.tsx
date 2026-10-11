'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authRequest, destination, safeReturnPath } from '@/lib/auth';
import { getSupabase, logout, saveAuthToken } from '@/lib/supabase';

// Share completion across React Strict Mode effect replays: a code is single-use.
let completion: Promise<string> | undefined;

async function completeLogin() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const flowId = params.get('sb_flow_id');
  const denied = params.has('error');
  window.history.replaceState({}, '', '/auth/callback');
  if (denied) throw new Error('Google sign-in was cancelled or denied. Please try again.');
  if (!code) throw new Error('Missing login code. Start Google sign-in again.');
  const { data, error } = await getSupabase().auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);
  if (error || !data.session) throw new Error('Google sign-in expired or could not be verified. Please try again.');
  try {
    const profile = await authRequest('/api/auth/me', undefined, data.session.access_token);
    if (!profile.data?.user?.id) throw new Error('Unable to load your profile. Please try again.');
    saveAuthToken(data.session.access_token);
    const next = safeReturnPath(sessionStorage.getItem('tf_return_to'));
    sessionStorage.removeItem('tf_return_to');
    return next || destination(profile.data.user);
  } catch (error) {
    await logout();
    throw error;
  }
}

export default function OAuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    completion ??= completeLogin();
    completion.then(path => { if (active) router.replace(path); })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Google sign-in failed.'); });
    return () => { active = false; };
  }, [router]);
  return <main className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#181135] p-6 text-white">
    <h1 className="text-2xl font-bold">Google sign-in</h1>
    {error ? <><p role="alert">{error}</p><Link href="/login" className="text-[#FFFF1A] underline">Back to login</Link></>
      : <p role="status">Signing you in and loading your profile…</p>}
  </main>;
}
