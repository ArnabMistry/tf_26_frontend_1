'use client';

import { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/session';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await requestPasswordReset(email);
      // Always reports success, so the form cannot be used to discover which
      // addresses have accounts.
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the email.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-[520px]">
        <p role="status" className="mb-4 text-green-400 font-bold">
          If an account exists for {email}, a reset link is on its way.
        </p>
        <p className="text-[#A49FBD] text-sm mb-6">The link is valid for one hour. Check your spam folder if it has not arrived in a few minutes.</p>
        <Link href="/login" className="text-[#FFFF1A] underline">Back to login</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[520px]">
      <h1 className="text-2xl font-extrabold uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-futura)' }}>
        Reset your password
      </h1>
      <p className="text-[#A49FBD] text-sm mb-6">
        Enter your email and we will send you a link to choose a new password.
      </p>
      {error && <p role="alert" className="mb-3 text-pink-300">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block text-[#FFFF1A] font-extrabold text-xs tracking-wider uppercase mb-2">Email</label>
          <input id="forgot-email" type="email" required autoComplete="email" autoFocus
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50" />
        </div>
        <button type="submit" disabled={busy}
          className="w-full h-12 rounded-lg bg-[#E7137D] text-white font-extrabold uppercase tracking-wider disabled:opacity-60 hover:brightness-110 transition"
          style={{ fontFamily: 'var(--font-futura)' }}>
          {busy ? '…' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-5 text-xs uppercase tracking-wider text-[#A49FBD] font-bold">
        <Link href="/login" className="text-[#E7137D] hover:underline">Back to login</Link>
      </p>
    </div>
  );
}
