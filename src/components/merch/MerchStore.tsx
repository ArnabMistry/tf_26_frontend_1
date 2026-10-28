'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParticipant } from '@/components/auth/ParticipantSession';
import { formatDate, type Person } from '@/lib/participant';
import {
  basketTotal,
  canCheckout,
  lineKey,
  merchItems,
  payForMerch,
  refreshProfile,
  type BasketLine,
  type MerchItem,
} from '@/lib/merch';
import { TeeMockup, mockupVariant, swatchBorder } from './TeeMockup';
import s from '@/app/merch/page.module.css';

/** Nothing in the basket may exceed this; the backend enforces the same cap. */
const MAX_PER_LINE = 10;

/**
 * The TF 26 merch store.
 *
 * The catalogue is public — a logged-out visitor sees every design, price and
 * size — and only the Pay button is gated, which is why this fetches the store
 * without a session and resolves the user separately.
 *
 * The basket is local state and nothing more. No row exists in the database
 * until Checkout opens, so closing the tab costs nothing and an abandoned
 * checkout never holds stock.
 */
export function MerchStore() {
  const { user: sessionUser, loading: sessionLoading } = useParticipant();

  const [items, setItems] = useState<MerchItem[] | null>(null);
  const [basket, setBasket] = useState<BasketLine[]>([]);
  /** Size currently highlighted on each card, before it is added. */
  const [chosenSize, setChosenSize] = useState<Record<number, string>>({});
  /** Colourway filter, '' for all. */
  const [colour, setColour] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  // The session context carries only what /api/auth/me returned; the gateway
  // also needs phone and college, so the full profile is re-read once signed
  // in. Matching on id rather than clearing it on sign-out keeps a stale
  // profile from outliving the session it belongs to.
  const [profile, setProfile] = useState<Person | null>(null);
  const user = profile && sessionUser && profile.id === sessionUser.id ? profile : sessionUser;

  const load = useCallback(async () => {
    try {
      setItems(await merchItems());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the merch store.');
      setItems([]);
    }
  }, []);

  // Deferred the same way the portal defers its own first fetch, so the state
  // it sets lands outside the effect's render pass.
  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0);
    return () => clearTimeout(initial);
  }, [load]);

  const sessionUserId = sessionUser?.id;
  useEffect(() => {
    if (!sessionUserId) return;
    let active = true;
    refreshProfile()
      .then(fresh => { if (active) setProfile(fresh); })
      .catch(() => { /* the context user is a good enough fallback */ });
    return () => { active = false; };
  }, [sessionUserId]);

  const catalogue = useMemo(() => items || [], [items]);
  const signedIn = Boolean(user);
  const checkoutReady = canCheckout(user);

  // Colourways present in the catalogue, in the order they first appear, so
  // the filter row reflects the actual drop rather than a hard-coded list.
  const colourways = useMemo(() => {
    const seen = new Map<string, string | null>();
    for (const item of catalogue) {
      if (item.colorway && !seen.has(item.colorway)) seen.set(item.colorway, item.colorHex);
    }
    return [...seen].map(([name, hex]) => ({ name, hex }));
  }, [catalogue]);

  const shown = useMemo(
    () => (colour ? catalogue.filter(i => i.colorway === colour) : catalogue),
    [catalogue, colour]
  );

  // Lines whose item has since sold out or been pulled are dropped here rather
  // than synced away in an effect, so the total can never bill for one. The
  // filter above is purely visual and deliberately does not touch the basket.
  const payable = useMemo(
    () => basket.filter(line => {
      const item = catalogue.find(i => i.id === line.itemId);
      return Boolean(item && item.isAvailable && !item.soldOut);
    }),
    [basket, catalogue]
  );
  const total = useMemo(() => basketTotal(payable, catalogue), [payable, catalogue]);
  const units = useMemo(() => payable.reduce((n, l) => n + l.quantity, 0), [payable]);

  const quantityOf = useCallback(
    (itemId: number, size: string | null) =>
      basket.find(l => lineKey(l) === lineKey({ itemId, size }))?.quantity ?? 0,
    [basket]
  );

  function adjust(itemId: number, size: string | null, delta: number) {
    setError(''); setNotice('');
    setBasket(prev => {
      const key = lineKey({ itemId, size });
      const existing = prev.find(l => lineKey(l) === key);
      if (!existing) return delta > 0 ? [...prev, { itemId, size, quantity: delta }] : prev;
      const quantity = existing.quantity + delta;
      if (quantity < 1) return prev.filter(l => lineKey(l) !== key);
      // Matching the backend's cap here means the eleventh click does nothing
      // rather than failing at the gateway.
      if (quantity > MAX_PER_LINE) return prev;
      return prev.map(l => (lineKey(l) === key ? { ...l, quantity } : l));
    });
  }

  async function pay() {
    if (!user || !payable.length) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await payForMerch({ basket: payable, user, onProgress: setNotice });
      if (!result) { setNotice(''); return; } // Checkout dismissed without paying.
      await load();
      setBasket([]);
      setNotice(
        result.needsAttention
          ? result.needsAttention
          : `Payment confirmed — ₹${result.amount} for ${result.items
              .map(i => `${i.quantity}x ${i.name}${i.size ? ` (${i.size})` : ''}`)
              .join(', ')}. We will inform you once it's delivered.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be completed. Please try again.');
      setNotice('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {error && <p role="alert" className={s.error}>{error}</p>}
      {notice && <p role="status" className={s.notice}>{notice}</p>}

      {/* The one gate on this page: look freely, sign in to pay. */}
      {!sessionLoading && !signedIn && catalogue.length > 0 && (
        <p className={s.gate}>
          <span>Log in to buy — your order is tied to your Fest ID so the merch desk knows it is yours.</span>
          <Link href="/login?returnTo=%2Fmerch">Log in or sign up →</Link>
        </p>
      )}

      {signedIn && !checkoutReady && catalogue.length > 0 && (
        <p className={s.gate}>
          <span>
            Add your college name and phone number to your profile before paying — the payment gateway needs them.
          </span>
          <Link href="/profile">Complete your profile →</Link>
        </p>
      )}

      {/* Colour filter, shown only when the drop actually has more than one. */}
      {colourways.length > 1 && (
        <div className={s.filters} role="group" aria-label="Filter by colour">
          <button
            type="button"
            className={`${s.filter} ${colour === '' ? s.filterActive : ''}`}
            aria-pressed={colour === ''}
            onClick={() => setColour('')}
          >
            All ({catalogue.length})
          </button>
          {colourways.map(({ name, hex }) => (
            <button
              key={name}
              type="button"
              className={`${s.filter} ${colour === name ? s.filterActive : ''}`}
              aria-pressed={colour === name}
              onClick={() => setColour(colour === name ? '' : name)}
            >
              <span
                className={s.swatch}
                style={{ background: hex || '#2a1f52', borderColor: swatchBorder(hex) }}
                aria-hidden="true"
              />
              {name} ({catalogue.filter(i => i.colorway === name).length})
            </button>
          ))}
        </div>
      )}

      {!items ? (
        <div className={s.grid} aria-busy="true">
          {[0, 1, 2, 4].map(n => <div key={n} className={s.skeleton} />)}
          <p role="status" className={s.srOnly}>Loading the drop…</p>
        </div>
      ) : !catalogue.length ? (
        <p className={s.empty}>
          The TF 26 merch drop is not open yet. Check back soon — it goes live right here.
        </p>
      ) : (
        <div className={s.grid}>
          {shown.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              busy={busy}
              signedIn={signedIn}
              checkoutReady={checkoutReady}
              chosenSize={chosenSize[item.id] ?? item.sizes[0] ?? null}
              onChooseSize={size => setChosenSize(prev => ({ ...prev, [item.id]: size }))}
              quantityOf={quantityOf}
              onAdjust={adjust}
            />
          ))}
        </div>
      )}

      {catalogue.length > 0 && (
        <p className={s.fine}>
          Pay online, collect on campus — bring your Fest ID to the merch desk during the fest. Prices include GST.
          See our <Link href="/refund-policy">cancellation &amp; refund policy</Link> before you order.
        </p>
      )}

      {/* The docked basket. Only rendered once something is in it. */}
      {payable.length > 0 && (
        <div className={s.basket} role="region" aria-label="Your merch order">
          <div className={s.basketSummary}>
            <span className={s.basketTotal}>₹{total}</span>
            {units} item{units === 1 ? '' : 's'} in your order
          </div>
          <div className={s.basketActions}>
            <button type="button" className={s.ghostButton} disabled={busy} onClick={() => { setBasket([]); setNotice(''); setError(''); }}>
              Clear
            </button>
            {signedIn ? (
              <button type="button" className={s.payButton} disabled={busy || !checkoutReady} onClick={pay}>
                {busy ? 'Processing…' : `Pay ₹${total}`}
              </button>
            ) : (
              <Link className={s.payButton} href="/login?returnTo=%2Fmerch">Log in to pay</Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ItemCard({
  item,
  busy,
  signedIn,
  checkoutReady,
  chosenSize,
  onChooseSize,
  quantityOf,
  onAdjust,
}: {
  item: MerchItem;
  busy: boolean;
  signedIn: boolean;
  checkoutReady: boolean;
  chosenSize: string | null;
  onChooseSize: (size: string) => void;
  quantityOf: (itemId: number, size: string | null) => number;
  onAdjust: (itemId: number, size: string | null, delta: number) => void;
}) {
  const size = item.sizes.length ? chosenSize : null;
  const inBasket = quantityOf(item.id, size);
  const [view, setView] = useState<'front' | 'back'>('back');
  const owned = item.purchases.reduce((n, p) => n + p.quantity, 0);

  // The shots this item actually has, in the order they are offered. An item
  // photographed from one side gets no toggle; one with neither falls back to
  // the drawn mockup, exactly as it did before there was any photography.
  const views = [
    item.imageUrl ? { key: 'front' as const, src: item.imageUrl, label: 'Front' } : null,
    item.imageBackUrl ? { key: 'back' as const, src: item.imageBackUrl, label: 'Back' } : null,
  ].filter(v => v !== null);
  // Falls back to the first available view, so an item whose back shot is
  // pulled while the card is flipped shows its front rather than nothing.
  const shownView = views.some(v => v.key === view) ? view : views[0]?.key;
  const lowStock = item.stockRemaining != null && item.stockRemaining > 0 && item.stockRemaining <= 10;
  // Adding is blocked only by stock and by the sale being open — a logged-out
  // visitor may still build a basket and is asked to sign in at the Pay step.
  const canAdd = !busy && !item.soldOut && item.isAvailable;

  return (
    <article className={`${s.card} ${item.soldOut ? s.soldOutCard : ''}`}>
      <div className={s.shot}>
        {views.length ? (
          <>
            {/* Both views are stacked and cross-faded rather than swapped in
                the src, so flipping a card never shows an empty frame while
                the other photo loads. */}
            {views.map(v => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={v.key}
                src={v.src}
                alt={`${item.name}, ${v.label.toLowerCase()} view`}
                loading="lazy"
                className={`${s.shotImage} ${v.key === shownView ? s.shotImageOn : ''}`}
                aria-hidden={v.key === shownView ? undefined : true}
              />
            ))}
            {views.length > 1 && (
              <div className={s.views} role="group" aria-label={`Views of ${item.name}`}>
                {views.map(v => (
                  <button
                    key={v.key}
                    type="button"
                    className={`${s.viewButton} ${v.key === shownView ? s.viewButtonActive : ''}`}
                    aria-pressed={v.key === shownView}
                    onClick={() => setView(v.key)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={s.mockup}>
            <TeeMockup colorHex={item.colorHex} label={item.name} variant={mockupVariant(item.slug)} />
          </div>
        )}
        {item.soldOut ? (
          <span className={`${s.ribbon} ${s.ribbonSold}`}>Sold out</span>
        ) : owned > 0 ? (
          <span className={`${s.ribbon} ${s.ribbonOwned}`}>Yours ×{owned}</span>
        ) : lowStock ? (
          <span className={`${s.ribbon} ${s.ribbonLow}`}>{item.stockRemaining} left</span>
        ) : null}
      </div>

      <div className={s.body}>
        <div className={s.heading}>
          <h2 className={s.name}>{item.name}</h2>
          <span className={s.price}>
            <span className={s.priceNow}>₹{item.priceInr}</span>
            {item.mrpInr ? (
              <s className={s.wasPrice}>
                <span className={s.srOnly}>Reduced from </span>₹{item.mrpInr}
              </s>
            ) : null}
          </span>
        </div>
        {item.tagline && <p className={s.tagline}>{item.tagline}</p>}

        {item.colorway && (
          <p className={s.colourway}>
            <span
              className={s.swatch}
              style={{ background: item.colorHex || '#2a1f52', borderColor: swatchBorder(item.colorHex) }}
              aria-hidden="true"
            />
            {item.colorway}
          </p>
        )}

        {item.description && <p className={s.description}>{item.description}</p>}

        {owned > 0 && (
          <p className={s.owned}>
            You have already bought {owned}
            {item.purchases.some(p => p.size) ? ` (${item.purchases.map(p => p.size || 'one size').join(', ')})` : ''}
            {item.purchases[0]?.paidAt ? ` on ${formatDate(item.purchases[0].paidAt)} IST` : ''}. We will inform you once it's delivered.
          </p>
        )}

        {item.sizes.length > 0 && (
          <div className={s.sizeBlock}>
            <span className={s.fieldLabel} id={`size-label-${item.id}`}>
              Size{size ? <span className={s.chosenSize}> · {size}</span> : null}
            </span>
            <div className={s.sizes} role="group" aria-labelledby={`size-label-${item.id}`}>
              {item.sizes.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`${s.size} ${option === size ? s.sizeActive : ''}`}
                  aria-pressed={option === size}
                  disabled={busy || item.soldOut}
                  onClick={() => onChooseSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={s.actions}>
          {item.soldOut ? (
            <button type="button" className={s.ghostButton} disabled>Sold out</button>
          ) : inBasket > 0 ? (
            <div className={s.qtyRow}>
              <button
                type="button"
                className={s.qtyButton}
                disabled={busy}
                onClick={() => onAdjust(item.id, size, -1)}
                aria-label={`Remove one ${item.name}${size ? ` (${size})` : ''}`}
              >−</button>
              <span className={s.qtyValue} aria-live="polite">{inBasket}</span>
              <button
                type="button"
                className={s.qtyButton}
                disabled={busy || inBasket >= MAX_PER_LINE}
                onClick={() => onAdjust(item.id, size, 1)}
                aria-label={`Add another ${item.name}${size ? ` (${size})` : ''}`}
              >+</button>
              <span className={s.inBasket}>In your order{size ? ` · ${size}` : ''}</span>
            </div>
          ) : (
            <button
              type="button"
              className={s.addButton}
              disabled={!canAdd}
              onClick={() => onAdjust(item.id, size, 1)}
            >
              {signedIn && !checkoutReady ? 'Add — complete profile to pay' : `Add to order — ₹${item.priceInr}`}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
