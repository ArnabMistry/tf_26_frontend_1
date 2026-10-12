'use client';

/**
 * Set a new password from the emailed reset link.
 *
 * This is also the migration path for every account that existed under
 * Supabase: those users have a profile row but no Better Auth credential, so
 * their old password does not work until they go through this once.
 */
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/session';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const linkError = searchParams.get('error');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('The two passwords do not match.'); return; }
    setError(''); setBusy(true);
    try {
      await resetPassword(password, token);
      router.replace('/login?reset=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset the password.');
    } finally {
      setBusy(false);
    }
  };

  if (!token || linkError) {
    return (
      <div className="w-full max-w-[520px] text-center">
        <p role="alert" className="mb-4 text-pink-300">
          This reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password" className="text-[#FFFF1A] underline">Request a new link</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[520px]">
      <h1 className="text-2xl font-extrabold uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-futura)' }}>
        Choose a new password
      </h1>
      {error && <p role="alert" className="mb-3 text-pink-300">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-[#FFFF1A] font-extrabold text-xs tracking-wider uppercase mb-2">New password</label>
          <input id="new-password" type="password" required minLength={6} autoComplete="new-password"
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50" />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-[#FFFF1A] font-extrabold text-xs tracking-wider uppercase mb-2">Confirm password</label>
          <input id="confirm-password" type="password" required minLength={6} autoComplete="new-password"
            value={confirm} onChange={e => setConfirm(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50" />
        </div>
        <button type="submit" disabled={busy}
          className="w-full h-12 rounded-lg bg-[#E7137D] text-white font-extrabold uppercase tracking-wider disabled:opacity-60 hover:brightness-110 transition"
          style={{ fontFamily: 'var(--font-futura)' }}>
          {busy ? '…' : 'Set password'}
        </button>
      </form>
    </div>
  );
}
