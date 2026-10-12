'use client';

/**
 * Email verification by 6-digit code.
 *
 * Supabase used to email a confirmation *link*; the backend now emails a code
 * over its own SMTP mailbox and checks it at /api/otp/verify. A code works
 * better here than a link: students open the mail on a phone while registering
 * on a laptop, and a link would strand the session on the wrong device.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendEmailOtp, verifyEmailOtp } from '@/lib/session';

const RESEND_SECONDS = 60;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = (searchParams.get('email') || '').trim().toLowerCase();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    timer.current = setInterval(() => setCooldown(c => (c <= 1 ? 0 : c - 1)), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setNotice(''); setBusy(true);
    try {
      await verifyEmailOtp(email, otp.trim());
      setNotice('Email verified.');
      router.replace('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That code was not accepted.');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError(''); setNotice(''); setBusy(true);
    try {
      await sendEmailOtp(email);
      setNotice('A new code is on its way. It expires in 10 minutes.');
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send a new code.');
    } finally {
      setBusy(false);
    }
  };

  if (!email) {
    return (
      <div className="w-full max-w-[520px] text-center">
        <p role="alert" className="mb-4 text-pink-300">We do not know which address to verify.</p>
        <Link href="/login" className="text-[#FFFF1A] underline">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[520px]">
      <h1 className="text-2xl font-extrabold uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-futura)' }}>
        Verify your email
      </h1>
      <p className="text-[#A49FBD] text-sm mb-6">
        We sent a 6-digit code to <span className="text-white font-bold">{email}</span>.
      </p>

      {error && <p role="alert" className="mb-3 text-pink-300">{error}</p>}
      {notice && <p role="status" className="mb-3 text-green-400">{notice}</p>}

      <form onSubmit={submit}>
        <label htmlFor="otp" className="block text-[#FFFF1A] font-extrabold text-xs tracking-wider uppercase mb-2">
          Verification code
        </label>
        <input
          id="otp"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
          autoFocus
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full h-14 px-4 rounded-lg bg-[#FFFF1A] border-2 border-[#E7137D] text-black font-bold text-2xl tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-[#E7137D]/50"
        />

        <button
          type="submit"
          disabled={busy || otp.length !== 6}
          className="mt-5 w-full h-12 rounded-lg bg-[#E7137D] text-white font-extrabold uppercase tracking-wider disabled:opacity-60 hover:brightness-110 transition"
          style={{ fontFamily: 'var(--font-futura)' }}
        >
          {busy ? '…' : 'Verify'}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-wider text-[#A49FBD] font-bold">
        <button type="button" onClick={resend} disabled={busy || cooldown > 0} className="text-[#E7137D] disabled:text-[#6f6a8d] hover:underline">
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
        <Link href="/profile" className="hover:underline">Skip for now</Link>
      </div>
    </div>
  );
}
