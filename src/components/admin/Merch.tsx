'use client';
import { useState } from 'react';
import { adminRequest, downloadCsv, enc, record, rows, text } from '@/lib/admin';
import { EditorDialog, LoadState, Table, useAdminData, type Editor } from './AdminUI';

const buyerStatusOptions = [
  { value: 'confirmed', label: 'Paid buyers only' },
  { value: 'pending_payment', label: 'Started but never paid' },
  { value: 'all', label: 'Everyone with an order' },
];

const ledgerStatusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'confirmed', label: 'Paid' },
  { value: 'pending_payment', label: 'Awaiting payment' },
  { value: 'cancelled', label: 'Cancelled' },
];

const stamp = (value: unknown) =>
  value ? new Date(String(value)).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) : '—';

const rupees = (value: unknown) => (value == null ? '—' : `₹${value}`);

/**
 * Sizes as a compact range. Listing XS…XXXL in full turns the column into a
 * seven-line stack and pushes the action buttons off the table; the full list
 * is still one click away under Edit.
 */
const sizeRange = (value: unknown) => {
  const list = Array.isArray(value) ? (value as string[]) : [];
  if (!list.length) return 'One size';
  if (list.length <= 2) return list.join(', ');
  return `${list[0]}–${list[list.length - 1]} (${list.length})`;
};

/** "2x Tee (L)" — how a line reads at the desk. */
const lineLabel = (line: Record<string, unknown>) =>
  `${text(line.quantity)}x ${text(line.name)}${line.size ? ` (${text(line.size)})` : ''}`;

/**
 * One editable cell: a value that is changed in place and saved on its own.
 *
 * Used for the two fields an organiser actually changes mid-fest — the name
 * and the price — so neither needs the full editor dialog. It PATCHes a single
 * field, which is why it cannot blank the rest of the item the way the
 * whole-record PUT would.
 *
 * The parent gives it a `key` derived from the saved value, so a successful
 * save remounts it against the new value instead of leaving a stale draft.
 */
function InlineEdit({ value, onSave, type = 'text', prefix, ariaLabel, size = 14 }: {
  value: string | number | null | undefined;
  onSave: (next: string) => Promise<unknown>;
  type?: 'text' | 'number';
  prefix?: string;
  ariaLabel: string;
  size?: number;
}) {
  const initial = value == null ? '' : String(value);
  const [draft, setDraft] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dirty = draft.trim() !== initial.trim();

  async function commit() {
    if (!dirty || busy) return;
    setBusy(true); setError('');
    try { await onSave(draft.trim()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not save.'); }
    finally { setBusy(false); }
  }

  return <span className="admin-inline-edit">
    {/* The prefix and the field are one unit: letting "₹" wrap onto its own
        line above the input is the first thing that happens otherwise. */}
    <span className="admin-inline-edit-field">
      {prefix && <span aria-hidden="true">{prefix}</span>}
      <input
        aria-label={ariaLabel}
        type={type}
        value={draft}
        size={size}
        min={type === 'number' ? 0 : undefined}
        disabled={busy}
        onChange={e => { setDraft(e.target.value); setError(''); }}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); void commit(); }
          if (e.key === 'Escape') { setDraft(initial); setError(''); }
        }}
      />
    </span>
    {dirty && <>
      <button type="button" className="primary" disabled={busy} onClick={() => void commit()}>
        {busy ? 'Saving…' : 'Save'}
      </button>
      <button type="button" disabled={busy} onClick={() => { setDraft(initial); setError(''); }}>Undo</button>
    </>}
    {error && <span role="alert" className="admin-error">{error}</span>}
  </span>;
}

/** The editor fields for an item, pre-filled when one is being changed. */
const itemFields = (initial?: Record<string, unknown>) => [
  { name: 'name', label: 'Name', required: true, value: initial?.name },
  { name: 'tagline', label: 'Tagline (one line under the name)', value: initial?.tagline },
  { name: 'description', label: 'Description', type: 'textarea', value: initial?.description },
  { name: 'priceInr', label: 'Price (₹)', type: 'number', min: 0, required: true, value: initial?.priceInr },
  { name: 'mrpInr', label: 'Was (₹) — shown struck through, blank for no discount', type: 'number', min: 0, value: initial?.mrpInr },
  { name: 'imageUrl', label: 'Front image URL (leave blank for the drawn mockup)', value: initial?.imageUrl },
  { name: 'imageBackUrl', label: 'Back image URL (blank = no back view to flip to)', value: initial?.imageBackUrl },
  { name: 'colorway', label: 'Colour name shown to buyers, e.g. Midnight Black', value: initial?.colorway },
  { name: 'colorHex', label: 'Colour of the drawn mockup, as hex, e.g. #101014', value: initial?.colorHex },
  { name: 'sizes', label: 'Sizes, comma separated (blank = one size)', value: Array.isArray(initial?.sizes) ? (initial.sizes as string[]).join(', ') : '' },
  { name: 'stockLimit', label: 'Stock limit (blank = unlimited)', type: 'number', min: 0, value: initial?.stockLimit },
  { name: 'sortOrder', label: 'Sort order on the page', type: 'number', value: initial?.sortOrder ?? 0 },
  { name: 'isAvailable', label: 'On sale', type: 'checkbox', value: initial ? initial.isAvailable : true },
];

/**
 * Super-admin merch desk.
 *
 * Three questions, three sub-tabs: who has paid (the one asked at the counter),
 * what each item costs, and the order ledger behind both.
 */
export function Merch() {
  const [sub, setSub] = useState<'buyers' | 'catalogue' | 'orders'>('buyers');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  // Buyers
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('confirmed');
  const [item, setItem] = useState('');
  const [page, setPage] = useState(1);

  // Order ledger
  const [ledgerItem, setLedgerItem] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState('');
  const [ledgerPage, setLedgerPage] = useState(1);

  const summaryRes = useAdminData('/api/admin/merch/summary');
  const summary = record(summaryRes.data);
  const perItem = rows(summary.perItem);
  const sizeBreakdown = rows(summary.sizeBreakdown);
  const totals = record(summary.totals);

  const itemsRes = useAdminData('/api/admin/merch/items');
  const items = rows(itemsRes.data);

  const buyersRes = useAdminData(
    sub === 'buyers'
      ? `/api/admin/merch/buyers?page=${page}&limit=50&status=${enc(status)}${query ? `&search=${enc(query)}` : ''}${item ? `&itemId=${enc(item)}` : ''}`
      : null
  );
  const buyers = rows(record(buyersRes.data).buyers);
  const buyerPages = Number(record(buyersRes.data).totalPages || 1);

  const ledgerRes = useAdminData(
    sub === 'orders'
      ? `/api/admin/merch/purchases?page=${ledgerPage}&limit=50${ledgerItem ? `&itemId=${enc(ledgerItem)}` : ''}${ledgerStatus ? `&status=${enc(ledgerStatus)}` : ''}`
      : null
  );
  const ledger = rows(record(ledgerRes.data).purchases);
  const ledgerPages = Number(record(ledgerRes.data).totalPages || 1);

  function reloadAll() {
    summaryRes.reload();
    itemsRes.reload();
    buyersRes.reload();
    ledgerRes.reload();
  }

  async function run(key: string, action: () => Promise<unknown>, success: string) {
    setBusy(key); setError(''); setNotice('');
    try { await action(); setNotice(success); reloadAll(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Action failed.'); }
    finally { setBusy(''); }
  }

  const itemFilterOptions = [
    { value: '', label: 'All items' },
    ...items.map(i => ({ value: text(i.id), label: text(i.name) })),
  ];

  return <section>
    <div className="admin-section-heading">
      <h2>Merch store</h2>
      <div className="admin-actions">
        <button onClick={reloadAll}>Refresh</button>
      </div>
    </div>
    <p className="admin-hint">
      The store lives at <strong>/merch</strong> — a public page that is linked from no navigation, so share the URL.
      Anyone can see the designs; only a signed-in participant can pay. An item counts as sold only once the payment is
      captured, so &ldquo;awaiting payment&rdquo; means a checkout was opened and abandoned, and no stock is held for it.
    </p>

    <LoadState {...summaryRes} />
    {error && <p role="alert" className="admin-error">{error}</p>}
    {notice && <p role="status" className="admin-success">{notice}</p>}

    {/* Headline numbers — units sold and money actually landed. */}
    <div className="admin-stats">
      <article><span>Paid buyers</span><strong>{text(totals.paidBuyers)}</strong></article>
      <article><span>Units sold</span><strong>{text(totals.unitsSold)}</strong></article>
      <article><span>Awaiting collection</span><strong>{text(totals.awaitingCollection)}</strong></article>
      <article><span>Revenue</span><strong>{rupees(totals.revenueInr)}</strong></article>
    </div>

    <nav className="admin-actions" aria-label="Merch views">
      {([['buyers', 'Who has paid'], ['catalogue', 'Items & pricing'], ['orders', 'Order ledger']] as const).map(([id, label]) => (
        <button key={id} className={sub === id ? 'primary' : ''} aria-current={sub === id ? 'page' : undefined} onClick={() => setSub(id)}>
          {label}
        </button>
      ))}
    </nav>

    {/* ── Who has paid ──────────────────────────────────────────────────── */}
    {sub === 'buyers' && <>
      <article className="admin-card">
        <h3>Look up a buyer</h3>
        <p>Search by name, email or Fest ID to check what someone has paid for before handing it over.</p>
        <form onSubmit={e => { e.preventDefault(); setQuery(search.trim()); setPage(1); }}>
          <label>Name, email or Fest ID
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="TF26-… or jane@example.com" autoComplete="off" />
          </label>
          <div className="admin-fields">
            <label>Status
              <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
                {buyerStatusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label>Item
              <select value={item} onChange={e => { setItem(e.target.value); setPage(1); }}>
                {itemFilterOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>
          <div className="admin-actions">
            <button className="primary">Search</button>
            <button type="button" onClick={() => { setSearch(''); setQuery(''); setStatus('confirmed'); setItem(''); setPage(1); }}>Clear</button>
            <button type="button" disabled={!buyers.length} onClick={() => downloadCsv('merch-buyers.csv', [
              ['Name', 'Email', 'Fest ID', 'College', 'Phone', 'Paid', 'Items paid for', 'Still to collect', 'Total paid (INR)'],
              ...buyers.map(b => [
                [b.firstName, b.lastName].filter(Boolean).join(' '),
                b.email, b.festId, b.collegeName, b.phoneNumber,
                b.hasPaid ? 'Yes' : 'No',
                rows(b.purchases).filter(p => p.status === 'confirmed').map(lineLabel).join(' | '),
                rows(b.toCollect).map(lineLabel).join(' | '),
                b.totalPaid,
              ]),
            ])}>Export CSV</button>
          </div>
        </form>
      </article>

      <LoadState {...buyersRes} />
      <Table headings={['Buyer', 'Fest ID', 'Paid', 'Items', 'To collect', 'Total']} empty={!buyers.length}>
        {buyers.map(b => (
          <tr key={text(b.id)}>
            <td>
              {[b.firstName, b.lastName].filter(Boolean).join(' ') || '—'}
              <br /><small>{text(b.email)}</small>
              {b.phoneNumber ? <><br /><small>{text(b.phoneNumber)}</small></> : null}
            </td>
            <td>{text(b.festId)}</td>
            <td><span className="admin-badge">{b.hasPaid ? 'PAID' : 'UNPAID'}</span></td>
            <td>
              {/* Only the lines belonging to the view being looked at. On the
                  default "Paid buyers only" that is the purchases and nothing
                  else — an abandoned checkout is not something the desk hands
                  over, so listing it here was only noise. */}
              {(() => {
                const lines = rows(b.purchases).filter(p => status === 'all' || p.status === status);
                if (!lines.length) return '—';
                return lines.map(p => (
                  <div key={text(p.id)}>
                    {lineLabel(p)}
                    {/* The state is only worth spelling out when the column
                        actually mixes the two. */}
                    {status === 'all' && ` — ${p.status === 'confirmed' ? 'paid' : 'awaiting payment'}`}
                  </div>
                ));
              })()}
            </td>
            <td>
              {rows(b.toCollect).length
                ? rows(b.toCollect).map(p => (
                    <div key={text(p.id)}>
                      {lineLabel(p)}
                      {' '}
                      <button
                        disabled={busy === `fulfil-${text(p.id)}`}
                        onClick={() => run(
                          `fulfil-${text(p.id)}`,
                          () => adminRequest(`/api/admin/merch/purchases/${enc(p.id)}/fulfil`, { fulfilled: true }, 'POST'),
                          `Handed over ${lineLabel(p)}.`
                        )}
                      >Hand over</button>
                    </div>
                  ))
                : b.hasPaid ? 'All collected' : '—'}
            </td>
            <td>{rupees(b.totalPaid)}</td>
          </tr>
        ))}
      </Table>
      {buyerPages > 1 && (
        <div className="admin-actions">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>{page} / {buyerPages}</span>
          <button disabled={page >= buyerPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>}

    {/* ── Items & pricing ───────────────────────────────────────────────── */}
    {sub === 'catalogue' && <>
      <div className="admin-section-heading">
        <h3>Items &amp; pricing</h3>
        <div className="admin-actions">
          <button onClick={() => setEditor({
            title: 'Add a merch item',
            path: '/api/admin/merch/items',
            method: 'PUT',
            fields: itemFields(),
          })}>Add item</button>
        </div>
      </div>
      <p className="admin-hint">
        <strong>Name and price are edited here in the table</strong> — type over them and press Enter (or hit Save).
        Everything else lives behind <em>Edit</em>. Changing a price never re-bills anyone: every order stores the
        price it was sold at. Renaming is safe too — orders follow the item, not its name. Taking an item off sale
        hides it from /merch without touching the orders already placed for it.
      </p>

      <LoadState {...itemsRes} />
      <Table headings={['Item', 'Price', 'Sizes', 'On sale', 'Sold', 'Unpaid', 'Stock left', 'Revenue', 'Actions']} empty={!perItem.length}>
        {perItem.map(n => {
          const id = text(n.itemId);
          const full = items.find(i => text(i.id) === id) || {};
          return <tr key={id}>
            <td>
              <InlineEdit
                key={`name-${id}-${text(n.name)}`}
                value={text(n.name)}
                ariaLabel={`Name of ${text(n.name)}`}
                size={22}
                onSave={async next => {
                  await adminRequest(`/api/admin/merch/items/${enc(id)}`, { name: next }, 'PATCH');
                  setNotice(`Renamed to "${next}".`); reloadAll();
                }}
              />
              <br /><small>{text(n.slug)}{full.colorway ? ` · ${text(full.colorway)}` : ''}</small>
            </td>
            <td>
              <InlineEdit
                key={`price-${id}-${text(n.priceInr)}`}
                value={Number(n.priceInr)}
                type="number"
                prefix="₹"
                size={5}
                ariaLabel={`Price of ${text(n.name)}`}
                onSave={async next => {
                  await adminRequest(`/api/admin/merch/items/${enc(id)}`, { priceInr: next }, 'PATCH');
                  setNotice(`${text(n.name)} is now ₹${next}.`); reloadAll();
                }}
              />
            </td>
            <td title={Array.isArray(n.sizes) ? (n.sizes as string[]).join(', ') : ''}>{sizeRange(n.sizes)}</td>
            <td><span className="admin-badge">{n.isAvailable ? 'ON SALE' : 'OFF SALE'}</span></td>
            <td>{text(n.soldUnits)}</td>
            <td>{text(n.pendingUnits)}</td>
            <td>{n.stockLimit == null ? 'Unlimited' : text(n.stockRemaining)}</td>
            <td>{rupees(n.revenueInr)}</td>
            <td><div className="admin-actions">
              <button onClick={() => setEditor({
                title: `Edit ${text(n.name)}`,
                path: '/api/admin/merch/items',
                method: 'PUT',
                fields: itemFields(full),
                // The slug identifies the row, so it rides along unchanged
                // rather than being offered for editing — changing it would
                // create a second item instead of renaming this one.
                transform: data => ({ ...data, slug: full.slug ?? n.slug }),
              })}>Edit</button>
              <button
                disabled={busy === `toggle-${id}`}
                onClick={() => run(
                  `toggle-${id}`,
                  () => adminRequest(`/api/admin/merch/items/${enc(id)}/availability`, { isAvailable: !n.isAvailable }, 'PATCH'),
                  `${text(n.name)} is now ${n.isAvailable ? 'off' : 'on'} sale.`
                )}
              >{n.isAvailable ? 'Take off sale' : 'Put on sale'}</button>
              {/* Only ever offered for an item nothing has been ordered
                  against; the backend refuses the rest. */}
              {!Number(n.soldUnits) && !Number(n.pendingUnits) && (
                <button
                  disabled={busy === `delete-${id}`}
                  onClick={() => {
                    if (!window.confirm(`Delete ${text(n.name)}? This cannot be undone.`)) return;
                    void run(
                      `delete-${id}`,
                      () => adminRequest(`/api/admin/merch/items/${enc(id)}`, undefined, 'DELETE'),
                      `${text(n.name)} deleted.`
                    );
                  }}
                >Delete</button>
              )}
            </div></td>
          </tr>;
        })}
      </Table>

      {sizeBreakdown.length > 0 && <>
        <div className="admin-section-heading"><h3>Sizes sold</h3></div>
        <p className="admin-hint">Paid orders only — this is what to send the printer.</p>
        <Table headings={['Item', 'Size', 'Units']} empty={false}>
          {sizeBreakdown.map(row => (
            <tr key={`${text(row.itemId)}-${text(row.size)}`}>
              <td>{text(row.name)}</td>
              <td>{text(row.size)}</td>
              <td>{text(row.units)}</td>
            </tr>
          ))}
        </Table>
      </>}
    </>}

    {/* ── Order ledger ──────────────────────────────────────────────────── */}
    {sub === 'orders' && <>
      <article className="admin-card">
        <h3>Order ledger</h3>
        <p>Every order line, with the payment behind it. Confirm one by hand when someone pays at the desk.</p>
        <div className="admin-fields">
          <label>Item
            <select value={ledgerItem} onChange={e => { setLedgerItem(e.target.value); setLedgerPage(1); }}>
              {itemFilterOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label>Status
            <select value={ledgerStatus} onChange={e => { setLedgerStatus(e.target.value); setLedgerPage(1); }}>
              {ledgerStatusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
        <div className="admin-actions">
          <button disabled={!ledger.length} onClick={() => downloadCsv('merch-orders.csv', [
            ['Name', 'Email', 'Fest ID', 'Phone', 'Item', 'Size', 'Qty', 'Status', 'Amount (INR)', 'Ordered at', 'Paid at', 'Handed over at', 'Razorpay payment'],
            ...ledger.map(p => {
              const u = record(p.user);
              return [
                [u.firstName, u.lastName].filter(Boolean).join(' '),
                u.email, u.festId, u.phoneNumber,
                record(p.item).name, p.size, p.quantity, p.status, p.amountPaid,
                p.createdAt, p.paidAt, p.fulfilledAt, p.razorpayPaymentId,
              ];
            }),
          ])}>Export CSV</button>
        </div>
      </article>

      <LoadState {...ledgerRes} />
      <Table headings={['Buyer', 'Item', 'Status', 'Amount', 'Ordered', 'Paid', 'Actions']} empty={!ledger.length}>
        {ledger.map(p => {
          const id = text(p.id);
          const u = record(p.user);
          const itemName = text(record(p.item).name);
          return <tr key={id}>
            <td>
              {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
              <br /><small>{text(u.email)}</small>
              <br /><small>{text(u.festId)}</small>
            </td>
            <td>
              {text(p.quantity)}x {itemName}
              {p.size ? <><br /><small>Size {text(p.size)}</small></> : null}
            </td>
            <td>
              <span className="admin-badge">{String(p.status).replaceAll('_', ' ')}</span>
              {p.fulfilledAt ? <><br /><small>collected {stamp(p.fulfilledAt)}</small></> : null}
              {p.razorpayPaymentId ? <><br /><small>{text(p.razorpayPaymentId)}</small></> : null}
            </td>
            <td>{rupees(p.amountPaid)}</td>
            <td>{stamp(p.createdAt)}</td>
            <td>{stamp(p.paidAt)}</td>
            <td><div className="admin-actions">
              {p.status === 'pending_payment' && (
                <button onClick={() => setEditor({
                  title: `Confirm ${text(p.quantity)}x ${itemName} for ${text(u.email)}`,
                  path: `/api/admin/merch/purchases/${enc(id)}/confirm`,
                  warning: 'Marks this order as paid without going through the gateway. Use it for cash or bank transfers taken at the desk, and record the reference below.',
                  fields: [{ name: 'razorpayPaymentId', label: 'Payment reference (optional)' }],
                })}>Confirm as paid</button>
              )}
              {p.status === 'confirmed' && !p.fulfilledAt && (
                <button
                  disabled={busy === `fulfil-${id}`}
                  onClick={() => run(
                    `fulfil-${id}`,
                    () => adminRequest(`/api/admin/merch/purchases/${enc(id)}/fulfil`, { fulfilled: true }, 'POST'),
                    `Handed over ${text(p.quantity)}x ${itemName}.`
                  )}
                >Hand over</button>
              )}
              {p.status === 'confirmed' && Boolean(p.fulfilledAt) && (
                <button
                  disabled={busy === `unfulfil-${id}`}
                  onClick={() => run(
                    `unfulfil-${id}`,
                    () => adminRequest(`/api/admin/merch/purchases/${enc(id)}/fulfil`, { fulfilled: false }, 'POST'),
                    'Hand-over undone.'
                  )}
                >Undo hand-over</button>
              )}
              {p.status !== 'cancelled' && (
                <button onClick={() => setEditor({
                  title: `Cancel ${text(p.quantity)}x ${itemName} for ${text(u.email)}`,
                  path: `/api/admin/merch/purchases/${enc(id)}/cancel`,
                  warning: p.status === 'confirmed'
                    ? 'This order has been paid for. Cancelling it here does NOT refund the buyer — raise the refund in the Razorpay dashboard separately.'
                    : 'Releases this unpaid order line.',
                  fields: [{ name: 'reason', label: 'Reason', required: true }],
                })}>Cancel</button>
              )}
            </div></td>
          </tr>;
        })}
      </Table>
      {ledgerPages > 1 && (
        <div className="admin-actions">
          <button disabled={ledgerPage <= 1} onClick={() => setLedgerPage(ledgerPage - 1)}>Previous</button>
          <span>{ledgerPage} / {ledgerPages}</span>
          <button disabled={ledgerPage >= ledgerPages} onClick={() => setLedgerPage(ledgerPage + 1)}>Next</button>
        </div>
      )}
    </>}

    {editor && <EditorDialog editor={editor} close={() => setEditor(null)} saved={() => { setNotice('Saved successfully.'); reloadAll(); }} />}
  </section>;
}
