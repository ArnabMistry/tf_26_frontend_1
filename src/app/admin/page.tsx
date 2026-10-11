'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, authRequest, destination } from '@/lib/auth';
export default function AdminEntry() {
  const router = useRouter(); const [error, setError] = useState('');
  useEffect(() => {
    let active = true; const token = localStorage.getItem('tf_auth_token');
    if (!token) { router.replace('/login'); return; }
    authRequest('/api/auth/me', undefined, token).then(({ data }) => { if (active) router.replace(destination(data.user)); }).catch(err => { if (!active) return; if (err instanceof ApiError && err.status === 401) { localStorage.removeItem('tf_auth_token'); router.replace('/login'); return; } setError(err instanceof Error ? err.message : 'Unable to verify session.'); });
    return () => { active = false; };
  }, [router]);
  return <main className="min-h-screen bg-[#241A4C] text-white p-12"><p role={error ? 'alert' : 'status'}>{error || 'Opening your dashboard…'}</p>{error && <Link href="/login">Log in again</Link>}</main>;
}
