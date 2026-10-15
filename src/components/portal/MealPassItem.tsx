'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import type { MealPass } from '@/lib/participant';
import { formatDate } from '@/lib/participant';
import s from './Portal.module.css';

interface MealPassItemProps {
  pass: MealPass;
}

export function MealPassItem({ pass }: MealPassItemProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [enlarged, setEnlarged] = useState(false);

  useEffect(() => {
    if (pass.status === 'AVAILABLE' && pass.personalPassToken) {
      // 360px retina resolution for sharp scanning on phone screens
      QRCode.toDataURL(pass.personalPassToken, {
        width: 360,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrUrl(url))
        .catch(() => {});
    }
  }, [pass.status, pass.personalPassToken]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(pass.passCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const isClaimed = pass.status === 'CLAIMED';

  return (
    <>
      <article className={s.entry} key={pass.mealId}>
        <div className={s.row}>
          <div>
            <span className={s.eyebrow}>{formatDate(pass.date)}</span>
            <h3 className="mt-1 text-base sm:text-lg font-bold text-white tracking-wide">
              {pass.name.toUpperCase()}
            </h3>
          </div>
          <span
            className={`${s.badge} ${
              isClaimed
                ? s.accepted
                : pass.isServingNow
                ? `${s.pending} animate-pulse`
                : ''
            }`}
          >
            {isClaimed
              ? 'REDEEMED'
              : pass.isServingNow
              ? '● SERVING NOW'
              : 'AVAILABLE'}
          </span>
        </div>

        <p className={`${s.muted} mt-2 text-xs sm:text-sm`}>
          Eligible via:{' '}
          <span className="text-slate-300 font-semibold">
            {pass.grantedByEvents?.map((e) => e.name).join(', ') || 'Fest Registration'}
          </span>
        </p>

        {!isClaimed ? (
          <div className="mt-3.5 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-[#faff52]/35 bg-[#0d0d1a]/95 p-4 sm:p-5 shadow-xl transition-all">
            {/* High-contrast QR code container for instant phone screen scanning */}
            <div
              className="relative shrink-0 rounded-2xl bg-white p-2.5 sm:p-3 shadow-lg cursor-pointer group active:scale-95 transition-transform"
              onClick={() => setEnlarged(true)}
              title="Tap to enlarge QR code for scanner"
            >
              {qrUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrUrl}
                  alt={`Meal QR Pass for ${pass.name}`}
                  width={160}
                  height={160}
                  className="h-36 w-36 sm:h-40 sm:w-40 block rounded-xl select-none"
                />
              ) : (
                <div className="flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center bg-slate-100 text-xs font-semibold text-slate-500 rounded-xl">
                  Generating QR...
                </div>
              )}
              <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-[9px] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-sm group-hover:bg-[#e7137d]">
                Tap to expand
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#faff52] animate-ping" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#faff52]">
                  Scan Pass at Food Counter
                </p>
              </div>

              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Hold your screen up to the food counter scanner.
              </p>

              {/* 8-letter Spoken Code Fallback */}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Backup Pass Code
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-[0.2em] sm:tracking-[0.25em] text-[#faff52] block break-all">
                    {pass.passCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyCode}
                  className="self-center sm:self-auto px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  {copied ? '✓ COPIED' : 'COPY CODE'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 block">
                ✓ Meal Claimed & Verified
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                Redeemed{' '}
                {pass.scannedAt
                  ? `on ${formatDate(pass.scannedAt)}`
                  : 'at food counter'}
              </span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        )}
      </article>

      {/* Mobile-Friendly Fullscreen QR Lightbox Modal */}
      {enlarged && qrUrl && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setEnlarged(false)}
        >
          <div
            className="relative flex flex-col items-center bg-[#0d0d1a] border border-[#faff52]/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEnlarged(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-sm hover:bg-white/20 cursor-pointer"
            >
              ✕
            </button>

            <span className="text-xs uppercase tracking-widest text-[#faff52] font-black mb-1">
              {pass.name.toUpperCase()}
            </span>
            <p className="text-xs text-slate-400 mb-4 text-center">
              Maximum brightness QR for quick food counter scanning
            </p>

            <div className="p-4 bg-white rounded-2xl shadow-2xl mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt={`Meal QR Pass for ${pass.name}`}
                width={260}
                height={260}
                className="w-56 h-56 sm:w-64 sm:h-64 block rounded-lg select-none"
              />
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Pass Code
              </span>
              <span className="font-mono text-2xl font-black tracking-[0.25em] text-[#faff52]">
                {pass.passCode}
              </span>
            </div>

            <button
              onClick={() => setEnlarged(false)}
              className="mt-5 w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm tracking-wide transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
