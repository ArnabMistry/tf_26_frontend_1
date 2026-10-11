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
  return (
    <main className="min-h-screen bg-[#0d0a1e] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(231,19,125,0.15),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(255,255,26,0.08),_transparent_50%)] pointer-events-none" />
      <div className="relative z-10 w-full max-w-md bg-[#1c143a]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-center">
        <div className="mb-5 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/tf_logo.png" alt="TantraFiesta" width={48} height={48} className="w-12 h-12 object-contain drop-shadow-[0_0_12px_rgba(255,255,26,0.4)]" />
        </div>
        <h1 className="text-xl font-bold tracking-wider text-[#FFFF1A] mb-2" style={{ fontFamily: 'var(--font-futura)' }}>TANTRAFIESTA ADMIN</h1>
        <p role={error ? 'alert' : 'status'} className="text-sm text-purple-200 mb-6 leading-relaxed">{error || 'Opening your dashboard…'}</p>
        <div className="flex flex-col gap-3">
          {error && <Link href="/login" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E7137D] to-[#ff2a9d] font-semibold text-white shadow-lg shadow-[#E7137D]/30 hover:opacity-95 transition-opacity">Log in again</Link>}
          <Link href="/" className="px-5 py-2.5 rounded-xl border border-white/15 text-sm font-medium text-gray-300 hover:text-[#FFFF1A] hover:border-[#FFFF1A] transition-colors">← Back to Homepage</Link>
        </div>
      </div>
    </main>
  );
}
