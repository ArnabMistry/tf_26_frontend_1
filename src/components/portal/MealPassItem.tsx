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

  useEffect(() => {
    if (pass.status === 'AVAILABLE' && pass.personalPassToken) {
      QRCode.toDataURL(pass.personalPassToken, {
        width: 240,
        margin: 1,
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

  const isClaimed = pass.status === 'CLAIMED';

  return (
    <article className={s.entry} key={pass.mealId}>
      <div className={s.row}>
        <div>
          <span className={s.eyebrow}>{formatDate(pass.date)}</span>
          <h3 className="mt-1 text-lg font-bold">{pass.name.toUpperCase()}</h3>
        </div>
        <span
          className={`${s.badge} ${
            isClaimed ? s.accepted : pass.isServingNow ? s.pending : ''
          }`}
        >
          {isClaimed ? 'REDEEMED' : pass.isServingNow ? 'SERVING NOW' : 'AVAILABLE'}
        </span>
      </div>

      <p className={`${s.muted} mt-2 text-sm`}>
        Eligible via:{' '}
        <span className="text-slate-300 font-medium">
          {pass.grantedByEvents?.map((e) => e.name).join(', ') || 'Fest Registration'}
        </span>
      </p>

      {!isClaimed ? (
        <div className="mt-3.5 flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-[#faff52]/30 bg-[#0d0d1a]/90 p-4 shadow-lg">
          {/* High-contrast QR code container for instant phone screen scanning */}
          <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-md">
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrUrl}
                alt={`Meal QR Pass for ${pass.name}`}
                width={140}
                height={140}
                className="h-32 w-32 sm:h-36 sm:w-36 block rounded-lg"
              />
            ) : (
              <div className="flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center bg-slate-100 text-xs text-slate-500">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#faff52]/80">
              Personal Food Pass QR
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Hold this QR code directly to the scanner at the food counter.
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                Counter Fallback Code
              </span>
              <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-[0.25em] text-[#faff52]">
                {pass.passCode}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-950/25 px-4 py-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Meal Claimed & Verified
            </span>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Redeemed{' '}
              {pass.scannedAt
                ? `on ${formatDate(pass.scannedAt)}`
                : 'at food counter'}
            </span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-black">
            ✓
          </div>
        </div>
      )}
    </article>
  );
}
