'use client';
import { useState } from 'react';
import { adminRequest, downloadCsv, enc, record, rows, text } from '@/lib/admin';
import { EditorDialog, LoadState, Table, useAdminData, type Editor } from './AdminUI';

const stateOptions = [
  { value: '', label: 'Everyone' },
  { value: 'confirmed', label: 'Has accommodation (paid)' },
  { value: 'pending', label: 'Selected but unpaid' },
  { value: 'none', label: 'No accommodation' },
];

const bookingStatusOptions = [
  { value: '', label: 'All statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending_payment', label: 'Awaiting payment' },
  { value: 'cancelled', label: 'Cancelled' },
];

const nightDate = (value: unknown) =>
  value ? new Date(String(value)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : '—';

const stamp = (value: unknown) =>
  value ? new Date(String(value)).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) : '—';

const rupees = (value: unknown) => (value == null ? '—' : `₹${value}`);

/**
 * Super-admin accommodation desk.
 *
 * Three questions, three sub-tabs: who has a bed (the one asked at the gate),
 * what each night costs, and the booking ledger behind both.
 */
export function Accommodation() {
  const [sub, setSub] = useState<'people' | 'nights' | 'bookings'>('people');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  // Participants
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [night, setNight] = useState('');
  const [page, setPage] = useState(1);

  // Booking ledger
  const [ledgerNight, setLedgerNight] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState('');
  const [ledgerPage, setLedgerPage] = useState(1);

  const summaryRes = useAdminData('/api/admin/accommodation/summary');
  const summary = record(summaryRes.data);
  const perNight = rows(summary.perNight);
  const totals = record(summary.totals);

  const configsRes = useAdminData('/api/admin/accommodation/configs');
  const configs = rows(configsRes.data);

  const peopleRes = useAdminData(
    sub === 'people'
      ? `/api/admin/accommodation/participants?page=${page}&limit=50${query ? `&search=${enc(query)}` : ''}${state ? `&state=${enc(state)}` : ''}${night ? `&configId=${enc(night)}` : ''}`
      : null
  );
  const people = rows(record(peopleRes.data).participants);
  const peoplePages = Number(record(peopleRes.data).totalPages || 1);

  const ledgerRes = useAdminData(
    sub === 'bookings'
      ? `/api/admin/accommodation/bookings?page=${ledgerPage}&limit=50${ledgerNight ? `&configId=${enc(ledgerNight)}` : ''}${ledgerStatus ? `&status=${enc(ledgerStatus)}` : ''}`
      : null
  );
  const ledger = rows(record(ledgerRes.data).bookings);
  const ledgerPages = Number(record(ledgerRes.data).totalPages || 1);

  function reloadAll() {
    summaryRes.reload();
    configsRes.reload();
    peopleRes.reload();
    ledgerRes.reload();
  }

  async function run(key: string, action: () => Promise<unknown>, success: string) {
    setBusy(key); setError(''); setNotice('');
    try { await action(); setNotice(success); reloadAll(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Action failed.'); }
    finally { setBusy(''); }
  }

  const nightFilterOptions = [
    { value: '', label: 'All nights' },
    ...configs.map(c => ({ value: text(c.id), label: text(c.label) })),
  ];

  return <section>
    <div className="admin-section-heading">
      <h2>Accommodation</h2>
      <div className="admin-actions">
        <button onClick={reloadAll}>Refresh</button>
      </div>
    </div>
    <p className="admin-hint">
      Participants pick the nights they want on their profile page and pay for them in one go. A night counts as booked
      only once the payment is captured — &ldquo;awaiting payment&rdquo; means a checkout was opened and never completed,
      so no bed is held.
    </p>

    <LoadState {...summaryRes} />
    {error && <p role="alert" className="admin-error">{error}</p>}
    {notice && <p role="status" className="admin-success">{notice}</p>}

    {/* Headline numbers — beds sold and money actually landed. */}
    <div className="admin-stats">
      <article><span>Guests with a bed</span><strong>{text(totals.confirmedGuests)}</strong></article>
      <article><span>Awaiting payment</span><strong>{text(totals.pendingGuests)}</strong></article>
      <article><span>Nights sold</span><strong>{text(totals.confirmedBookings)}</strong></article>
      <article><span>Revenue</span><strong>{rupees(totals.revenueInr)}</strong></article>
    </div>

    <nav className="admin-actions" aria-label="Accommodation views">
      {([['people', 'Who has a bed'], ['nights', 'Night pricing'], ['bookings', 'Booking ledger']] as const).map(([id, label]) => (
        <button key={id} className={sub === id ? 'primary' : ''} aria-current={sub === id ? 'page' : undefined} onClick={() => setSub(id)}>
          {label}
        </button>
      ))}
    </nav>

    {/* ── Who has a bed ─────────────────────────────────────────────────── */}
    {sub === 'people' && <>
      <article className="admin-card">
        <h3>Look up a participant</h3>
        <p>Search by name, email or Fest ID to check whether someone has accommodation.</p>
        <form onSubmit={e => { e.preventDefault(); setQuery(search.trim()); setPage(1); }}>
          <label>Name, email or Fest ID
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="TF26-… or jane@example.com" autoComplete="off" />
          </label>
          <div className="admin-fields">
            <label>Status
              <select value={state} onChange={e => { setState(e.target.value); setPage(1); }}>
                {stateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label>Night
              <select value={night} onChange={e => { setNight(e.target.value); setPage(1); }}>
                {nightFilterOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>
          <div className="admin-actions">
            <button className="primary">Search</button>
            <button type="button" onClick={() => { setSearch(''); setQuery(''); setState(''); setNight(''); setPage(1); }}>Clear</button>
            <button type="button" disabled={!people.length} onClick={() => downloadCsv('accommodation-participants.csv', [
              ['Name', 'Email', 'Fest ID', 'College', 'Phone', 'Has accommodation', 'Confirmed nights', 'Unpaid nights', 'Total paid (INR)'],
              ...people.map(p => [
                [p.firstName, p.lastName].filter(Boolean).join(' '),
                p.email, p.festId, p.collegeName, p.phoneNumber,
                p.hasAccommodation ? 'Yes' : 'No',
                rows(p.bookings).filter(b => b.status === 'confirmed').map(b => text(b.label)).join(' | '),
                rows(p.bookings).filter(b => b.status === 'pending_payment').map(b => text(b.label)).join(' | '),
                p.totalPaid,
              ]),
            ])}>Export CSV</button>
          </div>
        </form>
      </article>

      <LoadState {...peopleRes} />
      <Table headings={['Participant', 'Fest ID', 'Accommodation', 'Nights', 'Paid']} empty={!people.length}>
        {people.map(p => (
          <tr key={text(p.id)}>
            <td>
              {[p.firstName, p.lastName].filter(Boolean).join(' ') || '—'}
              <br /><small>{text(p.email)}</small>
              {p.collegeName ? <><br /><small>{text(p.collegeName)}</small></> : null}
            </td>
            <td>{text(p.festId)}</td>
            <td>
              <span className="admin-badge">
                {p.hasAccommodation ? 'YES' : p.state === 'pending' ? 'UNPAID' : 'NO'}
              </span>
            </td>
            <td>
              {rows(p.bookings).length
                ? rows(p.bookings).map(b => (
                    <div key={text(b.id)}>
                      {text(b.label)} — {b.status === 'confirmed' ? 'confirmed' : 'awaiting payment'}
                    </div>
                  ))
                : '—'}
            </td>
            <td>{rupees(p.totalPaid)}</td>
          </tr>
        ))}
      </Table>
      {peoplePages > 1 && (
        <div className="admin-actions">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>{page} / {peoplePages}</span>
          <button disabled={page >= peoplePages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>}

    {/* ── Night pricing ─────────────────────────────────────────────────── */}
    {sub === 'nights' && <>
      <div className="admin-section-heading">
        <h3>Night pricing</h3>
        <div className="admin-actions">
          <button onClick={() => setEditor({
            title: 'Add a bookable night',
            path: '/api/admin/accommodation/configs',
            method: 'PUT',
            fields: [
              { name: 'date', label: 'Date of the night', type: 'date', required: true },
              { name: 'label', label: 'Label shown to participants', required: true },
              { name: 'priceInr', label: 'Price (₹)', type: 'number', min: 0, required: true },
              { name: 'isAvailable', label: 'Open for booking', type: 'checkbox', value: true },
            ],
            transform: data => ({ ...data, date: new Date(`${String(data.date)}T00:00:00.000Z`).toISOString() }),
          })}>Add night</button>
        </div>
      </div>
      <p className="admin-hint">
        Changing a price never re-bills anyone: each booking stores the price it was sold at. Closing a night hides it
        from participants without touching the bookings already made for it.
      </p>

      <LoadState {...configsRes} />
      <Table headings={['Night', 'Date', 'Price', 'Open', 'Confirmed', 'Unpaid', 'Revenue', 'Actions']} empty={!perNight.length}>
        {perNight.map(n => {
          const id = text(n.configId);
          return <tr key={id}>
            <td>{text(n.label)}</td>
            <td>{nightDate(n.date)}</td>
            <td>{rupees(n.priceInr)}</td>
            <td><span className="admin-badge">{n.isAvailable ? 'OPEN' : 'CLOSED'}</span></td>
            <td>{text(n.confirmed)}</td>
            <td>{text(n.pending)}</td>
            <td>{rupees(n.revenueInr)}</td>
            <td><div className="admin-actions">
              <button onClick={() => setEditor({
                title: `Edit ${text(n.label)}`,
                path: '/api/admin/accommodation/configs',
                method: 'PUT',
                initial: { label: n.label, priceInr: n.priceInr, isAvailable: n.isAvailable },
                fields: [
                  { name: 'label', label: 'Label', required: true },
                  { name: 'priceInr', label: 'Price (₹)', type: 'number', min: 0, required: true },
                  { name: 'isAvailable', label: 'Open for booking', type: 'checkbox' },
                ],
                // The date identifies the row, so it is sent back unchanged
                // rather than offered for editing — editing it would create a
                // second night instead of renaming this one.
                transform: data => ({ ...data, date: new Date(String(n.date)).toISOString() }),
              })}>Edit</button>
              <button
                disabled={busy === `toggle-${id}`}
                onClick={() => run(
                  `toggle-${id}`,
                  () => adminRequest(`/api/admin/accommodation/configs/${enc(id)}/availability`, { isAvailable: !n.isAvailable }, 'PATCH'),
                  `${text(n.label)} is now ${n.isAvailable ? 'closed' : 'open'} for booking.`
                )}
              >{n.isAvailable ? 'Close' : 'Open'}</button>
            </div></td>
          </tr>;
        })}
      </Table>
    </>}

    {/* ── Booking ledger ────────────────────────────────────────────────── */}
    {sub === 'bookings' && <>
      <article className="admin-card">
        <h3>Booking ledger</h3>
        <p>Every booking, with the payment behind it. Confirm a booking by hand when someone pays at the desk.</p>
        <div className="admin-fields">
          <label>Night
            <select value={ledgerNight} onChange={e => { setLedgerNight(e.target.value); setLedgerPage(1); }}>
              {nightFilterOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label>Status
            <select value={ledgerStatus} onChange={e => { setLedgerStatus(e.target.value); setLedgerPage(1); }}>
              {bookingStatusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
        <div className="admin-actions">
          <button disabled={!ledger.length} onClick={() => downloadCsv('accommodation-bookings.csv', [
            ['Name', 'Email', 'Fest ID', 'Night', 'Status', 'Amount (INR)', 'Booked at', 'Paid at', 'Razorpay payment'],
            ...ledger.map(b => {
              const u = record(b.user);
              return [
                [u.firstName, u.lastName].filter(Boolean).join(' '),
                u.email, u.festId, record(b.config).label, b.status, b.amountPaid,
                b.createdAt, b.paidAt, b.razorpayPaymentId,
              ];
            }),
          ])}>Export CSV</button>
        </div>
      </article>

      <LoadState {...ledgerRes} />
      <Table headings={['Participant', 'Night', 'Status', 'Amount', 'Booked', 'Paid', 'Actions']} empty={!ledger.length}>
        {ledger.map(b => {
          const id = text(b.id);
          const u = record(b.user);
          return <tr key={id}>
            <td>
              {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
              <br /><small>{text(u.email)}</small>
              <br /><small>{text(u.festId)}</small>
            </td>
            <td>{text(record(b.config).label)}</td>
            <td>
              <span className="admin-badge">{String(b.status).replaceAll('_', ' ')}</span>
              {b.razorpayPaymentId ? <><br /><small>{text(b.razorpayPaymentId)}</small></> : null}
            </td>
            <td>{rupees(b.amountPaid)}</td>
            <td>{stamp(b.createdAt)}</td>
            <td>{stamp(b.paidAt)}</td>
            <td><div className="admin-actions">
              {b.status === 'pending_payment' && (
                <button
                  disabled={busy === `confirm-${id}`}
                  onClick={() => setEditor({
                    title: `Confirm ${text(record(b.config).label)} for ${text(u.email)}`,
                    path: `/api/admin/accommodation/bookings/${enc(id)}/confirm`,
                    warning: 'Marks this night as paid without going through the gateway. Use it for cash or bank transfers taken at the desk, and record the reference below.',
                    fields: [
                      { name: 'razorpayPaymentId', label: 'Payment reference (optional)' },
                    ],
                  })}
                >Confirm as paid</button>
              )}
              {b.status !== 'cancelled' && (
                <button
                  disabled={busy === `cancel-${id}`}
                  onClick={() => setEditor({
                    title: `Cancel ${text(record(b.config).label)} for ${text(u.email)}`,
                    path: `/api/admin/accommodation/bookings/${enc(id)}/cancel`,
                    warning: b.status === 'confirmed'
                      ? 'This booking has been paid for. Cancelling it here does NOT refund the participant — raise the refund in the Razorpay dashboard separately.'
                      : 'Releases this unpaid booking.',
                    fields: [{ name: 'reason', label: 'Reason', required: true }],
                  })}
                >Cancel</button>
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
