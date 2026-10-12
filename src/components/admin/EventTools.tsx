'use client';
import { useState } from 'react';
import { adminRequest, downloadCsv, enc, person, record, rows, text, type Row } from '@/lib/admin';
import { Details, EditorDialog, LoadState, Table, useAdminData, type Editor, type Field } from './AdminUI';

const options = (values: string[]) => values.map(value => ({ value, label: value.replaceAll('_', ' ') }));
const eventFields: Field[] = [
  { name: 'name', label: 'Event name', required: true }, { name: 'club', label: 'Club', required: true },
  { name: 'description', label: 'Description', type: 'textarea' }, { name: 'venue', label: 'Venue' },
  { name: 'registrationEndTime', label: 'Registration deadline (local time)', type: 'datetime-local', required: true },
  { name: 'isTeamEvent', label: 'Team event', type: 'checkbox' },
  { name: 'minTeamSize', label: 'Minimum team size', type: 'number', min: 1 }, { name: 'maxTeamSize', label: 'Maximum team size', type: 'number', min: 1 },
  { name: 'price', label: 'Fee', type: 'number', min: 0, value: 0, required: true }, { name: 'isPaid', label: 'Paid event', type: 'checkbox' },
  // No "payment round" here on purpose: an `after_round` fee falls due on the
  // first promotion, whichever round that is, so there is nothing to pick.
  { name: 'paymentTrigger', label: 'Payment trigger', options: options(['free', 'before_registration', 'after_round']) },
  { name: 'paymentPageLink', label: 'Payment page URL', type: 'url' },
];

export function EventTools({ eventId, superAdmin, changed }: { eventId: string; superAdmin: boolean; changed: () => void }) {
  const resource = useAdminData(eventId ? `/api/admin/events/${enc(eventId)}` : null);
  const roundsResource = useAdminData(eventId ? `/api/admin/events/${enc(eventId)}/rounds` : null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleted, setDeleted] = useState<Row | null>(null);
  const event = record(resource.data);
  const roundsList = rows(record(roundsResource.data).rounds ?? roundsResource.data);
  const refresh = () => { resource.reload(); roundsResource.reload(); changed(); };
  async function remove(path: string, warning: string, after?: (result: Row) => void) {
    if (!window.confirm(warning)) return;
    setBusy(true); setError('');
    try { const result = record(await adminRequest(path, undefined, 'DELETE')); if (after) after(result); else refresh(); } catch (err) { setError(err instanceof Error ? err.message : 'Delete failed.'); } finally { setBusy(false); }
  }
  // Deleting an event takes its registrations, teams, results and payment
  // records with it, so spell out exactly what is about to go.
  function deleteEventWarning() {
    const counts = record(event._count);
    const parts = [`${text(counts.registrations)} registration(s)`, `${text(counts.teams)} team(s)`, `${roundsList.length} round(s) and their results`];
    return `Delete ${text(event.name)}?\n\nThis permanently removes the event along with:\n· ${parts.join('\n· ')}\n· every order and payment record for this event\n\nPayments already collected are reconciled in Razorpay, not here — this only erases our copy. This cannot be undone.`;
  }
  function editEvent(create: boolean) {
    setEditor({ title: create ? 'Create event' : 'Edit event', path: create ? '/api/admin/events' : `/api/admin/events/${enc(eventId)}`, method: create ? 'POST' : 'PATCH', initial: create ? {} : event,
      fields: [...(create ? [{ name: 'id', label: 'Event ID', required: true }, { name: 'festId', label: 'Fest ID', type: 'number', min: 1, value: 1, required: true }] : []), ...eventFields],
      transform: data => {
        if (data.isTeamEvent && (!data.minTeamSize || !data.maxTeamSize || Number(data.minTeamSize) > Number(data.maxTeamSize))) throw new Error('Enter valid minimum and maximum team sizes.');
        return { ...data, minTeamSize: data.isTeamEvent ? data.minTeamSize : null, maxTeamSize: data.isTeamEvent ? data.maxTeamSize : null, paymentPageLink: data.paymentPageLink || null };
      },
    });
  }
  function editRound(round?: Row) {
    setEditor({ title: round ? 'Edit round' : 'Create round', path: `/api/admin/events/${enc(eventId)}/rounds${round ? `/${enc(round.roundNumber)}` : ''}`, method: round ? 'PATCH' : 'POST', initial: round,
      fields: [...(round ? [] : [{ name: 'roundNumber', label: 'Round number', type: 'number', min: 1, required: true }]), { name: 'name', label: 'Round name' }, { name: 'roundEndTime', label: 'Round deadline (local time)', type: 'datetime-local', required: true }],
    });
  }
  return <section><div className="admin-section-heading"><h2>Event management</h2>{superAdmin && <button className="primary" onClick={() => editEvent(true)}>Create event</button>}</div>
    {!deleted && <LoadState {...resource} />}{error && <p role="alert" className="admin-error">{error}</p>}
    {!eventId && !deleted && <p>Select an event to manage its settings and rounds.</p>}
    {deleted && <article className="admin-card"><h3>Deleted {text(deleted.name)}</h3>
      <p className="admin-success">The event and everything attached to it has been removed.</p>
      {(() => {
        const removed = record(deleted.removed);
        const amount = Number(removed.capturedAmount) || 0;
        return <><p>Removed: {text(removed.registrations)} registration(s), {text(removed.teams)} team(s), {text(removed.rounds)} round(s), {text(removed.orders)} order(s).</p>
          {amount > 0 && <p className="admin-error">{text(removed.capturedPayments)} collected payment(s) totalling ₹{amount} were also removed. Those transactions still exist in Razorpay — reconcile any refunds there.</p>}</>;
      })()}
      {/* The event list is only refreshed on the way out, so this summary is
          not torn down by the re-render that drops the deleted event. */}
      <div className="admin-actions"><button className="primary" onClick={() => { setDeleted(null); changed(); }}>Back to events</button></div></article>}
    {!deleted && !!resource.data && <><article className="admin-card"><h3>{text(event.name)}</h3><p>{text(event.description)}</p><p>{text(event.club)} · {text(event.venue)}</p><p>Fee: {text(event.price)} · Registration closes: {new Date(String(event.registrationEndTime)).toLocaleString()}</p>
      <div className="admin-actions"><button onClick={() => editEvent(false)}>Edit event</button>{superAdmin && <button disabled={busy} className="danger" onClick={() => remove(`/api/admin/events/${enc(eventId)}`, deleteEventWarning(), setDeleted)}>Delete event</button>}</div></article>
      <div className="admin-section-heading"><h3>Rounds</h3><button onClick={() => editRound()}>Add round</button></div><LoadState {...roundsResource} />
      <Table headings={['Round', 'Name', 'Deadline', 'Actions']} empty={!roundsList.length}>{roundsList.map(round => <tr key={text(round.id)}><td>{text(round.roundNumber)}</td><td>{text(round.name)}</td><td>{new Date(String(round.roundEndTime)).toLocaleString()}</td><td><div className="admin-actions"><button onClick={() => editRound(round)}>Edit</button><button className="danger" disabled={busy} onClick={() => remove(`/api/admin/events/${enc(eventId)}/rounds/${enc(round.roundNumber)}`, 'Delete this round and its participant results? This cannot be undone.')}>Delete</button></div></td></tr>)}</Table>
    </>}{editor && <EditorDialog editor={editor} close={() => setEditor(null)} saved={refresh} />}
  </section>;
}

export function Registrations({ eventId }: { eventId: string }) {
  const [page, setPage] = useState(1); const [status, setStatus] = useState('');
  const [details, setDetails] = useState<unknown>(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const path = `/api/admin/events/${enc(eventId)}/registrations`;
  const resource = useAdminData(`${path}?page=${page}&limit=20&status=${enc(status)}`);
  const data = record(resource.data); const list = rows(data.registrations); const pagination = record(data.pagination);
  async function exportAll() {
    setBusy(true); setError('');
    try {
      const all: Row[] = []; let current = 1; let pages = 1;
      do { const result = await adminRequest(`${path}?page=${current}&limit=100&status=${enc(status)}`); all.push(...rows(result.registrations)); pages = result.pagination.totalPages; current++; } while (current <= pages);
      downloadCsv(`${eventId}-registrations.csv`, [['ID', 'Participant / Team', 'Email', 'Status', 'Created'], ...all.map(r => [r.id, record(r.team).name || person(r.user), record(r.user).email, r.status, r.createdAt])]);
    } catch (err) { setError(err instanceof Error ? err.message : 'Export failed.'); } finally { setBusy(false); }
  }
  return <section><div className="admin-section-heading"><h2>Registrations</h2><button disabled={busy || resource.loading} onClick={exportAll}>Export all filtered rows</button></div>
    <label>Status<select value={status} onChange={e => { setStatus(e.target.value); setPage(1); setDetails(null); }}><option value="">All statuses</option>{options(['registered', 'in_round', 'shortlisted', 'eliminated', 'confirmed', 'cancelled']).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
    <LoadState {...resource} />{error && <p role="alert" className="admin-error">{error}</p>}
    <Table headings={['ID', 'Participant / Team', 'Email', 'Status', 'Details']} empty={!list.length}>{list.map(r => <tr key={text(r.id)}><td>{text(r.id)}</td><td>{text(record(r.team).name || person(r.user))}</td><td>{text(record(r.user).email)}</td><td><span className="admin-badge">{text(r.status)}</span></td><td><button onClick={async () => { setError(''); try { setDetails(await adminRequest(`/api/admin/registrations/${enc(r.id)}`)); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load details.'); } }}>View</button></td></tr>)}</Table>
    <div className="admin-actions"><button disabled={page === 1 || resource.loading} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {Number(pagination.totalPages) || 1} · {text(pagination.total)} records</span><button disabled={resource.loading || page >= (Number(pagination.totalPages) || 1)} onClick={() => setPage(p => p + 1)}>Next</button></div>
    {!!details && <article className="admin-card"><button onClick={() => setDetails(null)}>Close details</button><Details value={details} /></article>}
  </section>;
}

export function Promotion({ eventId }: { eventId: string }) {
  const resource = useAdminData(`/api/admin/events/${enc(eventId)}/rounds`);
  const roundList = rows(record(resource.data).rounds ?? resource.data);
  const [round, setRound] = useState('');
  const selectedRound = round || String(roundList[0]?.roundNumber || '');
  return <section><h2>Round promotion &amp; results</h2><LoadState {...resource} /><label>Round<select value={selectedRound} onChange={e => setRound(e.target.value)}><option value="" disabled>Select a round</option>{roundList.map(r => <option key={text(r.id)} value={text(r.roundNumber)}>Round {text(r.roundNumber)} — {text(r.name)}</option>)}</select></label>
    {!resource.loading && !roundList.length && <p>Create a round in Event management first.</p>}
    {selectedRound && <RoundParticipants key={`${eventId}-${selectedRound}`} eventId={eventId} round={selectedRound} />}
  </section>;
}

function RoundParticipants({ eventId, round }: { eventId: string; round: string }) {
  const resource = useAdminData(`/api/admin/events/${enc(eventId)}/rounds/${enc(round)}/participants`);
  const list = rows(record(resource.data).participants ?? resource.data);
  const [selected, setSelected] = useState<string[]>([]); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  const key = (row: Row) => row.teamId ? `team:${row.teamId}` : `user:${row.userId}`;
  async function promote() {
    if (!window.confirm(`Promote ${selected.length} selected participants/teams? All other eligible participants/teams in this round will be rejected.`)) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const chosen = list.filter(r => selected.includes(key(r)));
      const result = await adminRequest(`/api/admin/events/${enc(eventId)}/rounds/${enc(round)}/promote`, { userIds: chosen.filter(r => !r.teamId).map(r => r.userId), teamIds: chosen.filter(r => r.teamId).map(r => Number(r.teamId)) });
      setMessage(`Promoted: ${result.promotedCount ?? chosen.length}. Rejected: ${result.rejectedCount ?? 0}.`); setSelected([]); resource.reload();
    } catch (err) { setError(err instanceof Error ? err.message : 'Promotion failed.'); } finally { setBusy(false); }
  }
  return <><LoadState {...resource} /><p>Choose the participants or teams who qualify. Unselected eligible entries will be rejected when you promote.</p>
    {error && <p role="alert" className="admin-error">{error}</p>}{message && <p role="status" className="admin-success">{message}</p>}
    <div className="admin-actions"><button disabled={busy || !list.length} onClick={() => setSelected(selected.length === list.length ? [] : list.map(key))}>Select / clear all</button><button disabled={!list.length} onClick={() => downloadCsv(`${eventId}-round-${round}.csv`, [['ID', 'Name', 'Status', 'Score'], ...list.map(r => [r.teamId || r.userId, r.teamName || r.name, r.status, r.score])])}>Export results</button></div>
    <Table headings={['Select', 'Participant / Team', 'ID', 'Status', 'Score']} empty={!list.length}>{list.map(r => <tr key={key(r)}><td><input type="checkbox" aria-label={`Select ${text(r.teamName || r.name)}`} disabled={busy} checked={selected.includes(key(r))} onChange={e => setSelected(previous => e.target.checked ? [...previous, key(r)] : previous.filter(id => id !== key(r)))} /></td><td>{text(r.teamName || r.name)}</td><td>{text(r.teamId || r.userId)}</td><td>{text(r.status)}</td><td>{text(r.score)}</td></tr>)}</Table>
    <button className="primary" disabled={busy || !selected.length || resource.loading} onClick={promote}>{busy ? 'Updating…' : 'Promote selected'}</button>
  </>;
}
