'use client';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import QRCode from 'qrcode';
import { adminRequest, enc, record, rows, text, type Row } from '@/lib/admin';

export function MealCounterQr({ mealId, setCounts }: {
  mealId: string;
  setCounts: Dispatch<SetStateAction<Record<string, number>>>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<Row | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      if (document.hidden) {
        timer = setTimeout(() => void refresh(), 5000);
        return;
      }
      try {
        const next = record(await adminRequest(`/api/admin/meals/${enc(mealId)}/qr`));
        if (!active) return;
        setData(next);
        setCounts(previous => ({ ...previous, [mealId]: Number(next.scannedCount) || 0 }));
        setError('');
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Could not refresh the counter.');
      } finally {
        if (active) timer = setTimeout(() => void refresh(), 5000);
      }
    }
    void refresh();
    return () => { active = false; clearTimeout(timer); };
  }, [mealId, setCounts]);

  const url = typeof data?.claimUrl === 'string' ? data.claimUrl : '';
  const serving = data?.isServingNow === true;
  useEffect(() => {
    let active = true;
    if (canvas.current && url && serving) {
      void QRCode.toCanvas(canvas.current, url, { width: 320, margin: 4, errorCorrectionLevel: 'M' })
        .catch(() => { if (active) setError('Could not draw the QR. Close this counter and try again.'); });
    }
    return () => { active = false; };
  }, [url, serving]);

  return <section aria-label="Meal QR counter" className="admin-card">
    <h3>{data ? text(data.name) : 'Loading counter…'}</h3>
    {error && <p role="alert" className="admin-error">{error} Updates will retry automatically.</p>}
    {data && <>
      <p>{rows(data.eligibleEvents).map(event => text(event.name)).join(', ')}</p>
      {serving ? <>
        <p>Participants: open Meal Passes on the website, tap Scan Counter QR, and scan this code to claim your meal or snack once.</p>
        <canvas ref={canvas} aria-label={`${text(data.name)} claim QR`} role="img" style={{ maxWidth: '100%', height: 'auto', background: 'white' }} />
      </> : <p role="status">This serving window is closed. QR redemption is unavailable.</p>}
      <p role="status">Claimed: {text(data.scannedCount)} · Updates every 5 seconds</p>
      <h4>Recent claims</h4>
      {rows(data.recentClaims).length ? <ul>{rows(data.recentClaims).map(claim => {
        const participant = record(claim.user);
        return <li key={text(claim.id)}>{[participant.firstName, participant.lastName].filter(Boolean).join(' ')} · {text(participant.festId)} · Claimed {new Date(String(claim.scannedAt)).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</li>;
      })}</ul> : <p>No claims yet.</p>}
    </>}
  </section>;
}
