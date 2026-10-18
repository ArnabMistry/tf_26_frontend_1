'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDate, type Person } from '@/lib/participant';
import {
  accommodationNights,
  payForAccommodation,
  isConfirmed,
  isPending,
  isPayable,
  type AccommodationNight,
} from '@/lib/accommodation';
import s from './Portal.module.css';

/** Night label without the date suffix the card already shows above it. */
const nightDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })
    .format(new Date(value));

/**
 * Pick your nights, pay for them in one go.
 *
 * Nothing is reserved by ticking a box — the booking rows are created by the
 * backend when Checkout opens, and only a captured payment confirms a night.
 * So the selection here is just a selection, and an abandoned Checkout leaves
 * the participant able to pick a different set.
 */
export function AccommodationSection({ user, profileComplete }: { user: Person | null; profileComplete: boolean }) {
  const [nights, setNights] = useState<AccommodationNight[] | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setNights(await accommodationNights());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load accommodation.');
    }
  }, []);

  // Deferred the same way the portal defers its own first fetch, so the state
  // it sets lands outside the effect's render pass.
  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0);
    return () => clearTimeout(initial);
  }, [load]);

  // A night that got confirmed, or was withdrawn by an admin, while this tab
  // was open is dropped from the selection here rather than being synced away
  // in an effect — so the total on the Pay button can never bill for it.
  const picked = useMemo(
    () => (nights || []).filter(n => selected.includes(n.id) && isPayable(n)),
    [nights, selected]
  );
  const pickedIds = useMemo(() => picked.map(n => n.id), [picked]);
  const total = useMemo(() => picked.reduce((sum, n) => sum + n.priceInr, 0), [picked]);

  const confirmed = (nights || []).filter(isConfirmed);
  const payable = (nights || []).filter(isPayable);

  function toggle(night: AccommodationNight) {
    setError(''); setNotice('');
    setSelected(prev => prev.includes(night.id) ? prev.filter(id => id !== night.id) : [...prev, night.id]);
  }

  async function pay() {
    if (!user || !pickedIds.length) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await payForAccommodation({ configIds: pickedIds, user, onProgress: setNotice });
      if (!result) { setNotice(''); return; } // Checkout dismissed without paying.
      await load();
      setSelected([]);
      setNotice(
        result.needsAttention
          ? result.needsAttention
          : `Payment confirmed. Your stay is booked for ${result.nights.map(n => n.label).join(', ')}.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be completed. Please try again.');
      setNotice('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={s.card} id="accommodation">
      <div className={s.row}>
        <div>
          <h2>Accommodation</h2>
          <p className={s.muted}>Pick the nights you need a bed for and pay for them together.</p>
        </div>
        <span className={`${s.badge} ${confirmed.length ? s.accepted : ''}`}>
          {confirmed.length ? `${confirmed.length} night${confirmed.length === 1 ? '' : 's'} booked` : 'Not booked'}
        </span>
      </div>

      {error && <p role="alert" className={s.error}>{error}</p>}
      {notice && <p role="status" className={s.notice}>{notice}</p>}

      {!profileComplete && payable.length > 0 && (
        <p className={s.empty}>
          Add your college name and phone number under <strong>Edit profile</strong> before booking a room — the payment
          gateway needs them.
        </p>
      )}

      {!nights ? (
        <p role="status" className={s.muted}>Loading nights…</p>
      ) : !nights.length ? (
        <p className={s.empty}>Accommodation is not open for booking yet. Check back closer to the fest.</p>
      ) : (
        <>
          {nights.map(night => {
            const booked = isConfirmed(night);
            const pending = isPending(night);
            const checked = pickedIds.includes(night.id);
            return (
              <article className={s.entry} key={night.id}>
                <div className={s.row}>
                  <div>
                    <span className={s.eyebrow}>{nightDate(night.date)}</span>
                    <h3 className="mt-1 text-base sm:text-lg font-bold">{night.label}</h3>
                  </div>
                  <span className={`${s.badge} ${booked ? s.accepted : pending ? s.pending : ''}`}>
                    {booked ? 'CONFIRMED' : pending ? 'NOT PAID' : `₹${night.priceInr}`}
                  </span>
                </div>

                {booked ? (
                  <p className={`${s.fine} mt-2`}>
                    Paid ₹{night.booking?.amountPaid ?? night.priceInr}
                    {night.booking?.paidAt ? ` on ${formatDate(night.booking.paidAt)} IST` : ''}. Show your Fest ID at the
                    accommodation desk.
                  </p>
                ) : (
                  <label className={`${s.row} mt-2 cursor-pointer`} style={{ justifyContent: 'flex-start', gap: '0.6rem' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={busy}
                      onChange={() => toggle(night)}
                      aria-label={`Select ${night.label} for ₹${night.priceInr}`}
                    />
                    <span className={s.muted}>
                      Add this night — ₹{night.priceInr}
                      {pending ? ' (selected earlier but never paid for)' : ''}
                    </span>
                  </label>
                )}
              </article>
            );
          })}

          {payable.length > 0 && (
            <div className={`${s.row} mt-4`}>
              <p className={s.fine}>
                {pickedIds.length
                  ? `${pickedIds.length} night${pickedIds.length === 1 ? '' : 's'} selected · ₹${total} total`
                  : 'Select the nights you want.'}
              </p>
              <button
                className={s.button}
                disabled={busy || !pickedIds.length || !profileComplete}
                onClick={pay}
              >
                {busy ? 'Processing payment…' : `Pay ₹${total}`}
              </button>
            </div>
          )}

          {!payable.length && confirmed.length > 0 && (
            <p className={`${s.fine} mt-3`}>
              You are booked for every night on offer. To change or cancel a paid booking, contact the organisers.
            </p>
          )}
        </>
      )}
    </section>
  );
}
