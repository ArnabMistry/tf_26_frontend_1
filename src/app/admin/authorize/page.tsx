'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authRequest } from '@/lib/auth';
import { getAuthToken } from '@/lib/supabase';

export default function AuthorizeAdmin() {
  const router = useRouter(); const [code, setCode] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  return (
    <main className="min-h-screen bg-[#0d0a1e] text-white px-4 py-12 sm:py-20 flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(231,19,125,0.15),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(255,255,26,0.08),_transparent_50%)] pointer-events-none" />
      <section className="relative z-10 w-full max-w-lg mx-auto bg-[#1c143a]/90 border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/tf_logo.png" alt="TantraFiesta" width={36} height={36} className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(255,255,26,0.3)]" loading="lazy" />
            <span className="font-futura text-lg font-bold tracking-wider text-[#FFFF1A] group-hover:brightness-110">TANTRAFIESTA</span>
          </Link>
          <Link href="/" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-yellow-400/40 text-[#FFFF1A] hover:bg-[#FFFF1A] hover:text-[#170f2e] transition-all">
            ← Home
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-wide text-white" style={{ fontFamily: 'var(--font-futura)' }}>Activate admin access</h1>
        <p className="mb-6 text-sm text-purple-200">Log in to your existing account, then enter your assigned code.</p>
        <form onSubmit={async e => { e.preventDefault(); const token = getAuthToken(); if (!token) { setError('Please log in first, then return to this page.'); return; } setBusy(true); setError(''); try { await authRequest('/api/auth/admin/register', { eventCode: code }, token); router.replace('/admin'); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to authorize.'); } finally { setBusy(false); } }}>
          <label className="grid gap-2 text-sm font-medium text-purple-100">
            Admin code
            <input className="border border-purple-400/30 rounded-xl p-3.5 bg-[#120c24] text-white focus:outline-2 focus:outline-[#FFFF1A] focus:border-[#FFFF1A] transition-all" type="password" autoComplete="off" required value={code} onChange={e => setCode(e.target.value)} placeholder="Enter code…" />
          </label>
          {error && <p role="alert" className="text-pink-300 bg-pink-950/40 border border-pink-800/40 rounded-xl p-3.5 text-sm my-4">{error}</p>}
          <button disabled={busy} className="w-full bg-gradient-to-r from-[#E7137D] to-[#ff2a9d] text-white font-bold py-3.5 px-4 rounded-xl my-5 shadow-lg shadow-[#E7137D]/35 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer">
            {busy ? 'Checking…' : 'Activate access'}
          </button>
        </form>
        <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10 text-xs font-semibold text-[#FFFF1A]">
          <Link href="/login" className="hover:underline">Login</Link>
          <span className="text-gray-500">·</span>
          <Link href="/register/admin" className="hover:underline">Create admin account</Link>
          <span className="text-gray-500">·</span>
          <Link href="/admin" className="hover:underline">My panel</Link>
          <span className="text-gray-500">·</span>
          <Link href="/" className="hover:underline">Website Homepage</Link>
        </div>
      </section>
    </main>
  );
}
