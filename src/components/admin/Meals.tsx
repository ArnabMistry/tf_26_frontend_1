'use client';
import { useState } from 'react';
import { adminRequest, enc, record, rows, text, type EventSummary } from '@/lib/admin';
import { Details, EditorDialog, LoadState, Table, useAdminData, type Editor } from './AdminUI';
import { MealCounterQr } from './MealCounterQr';

const mealTypeOptions = [{ value: 'meal', label: 'Meal' }, { value: 'snack', label: 'Snack' }];

const sessionName = (meal: Record<string, unknown>) =>
  meal.name ? text(meal.name) : `${text(meal.typeOfMeal)} ${text(meal.slot)}`;

const clockTime = (value: unknown) =>
  value ? new Date(String(value)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

export function Meals({ events }: { events: EventSummary[] }) {
  const resource = useAdminData('/api/admin/meals'); const list = rows(record(resource.data).meals);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false); const [claim, setClaim] = useState<unknown>(null);
  // The counter works one session at a time: pick it once, then take codes.
  const [counterId, setCounterId] = useState(''); const [code, setCode] = useState('');
  const counter = list.find(meal => text(meal.id) === counterId);
  const [qrId, setQrId] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true); setError(''); setNotice('');
    try { setClaim(await action()); setCounts({}); setNotice(success); resource.reload(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Redemption failed.'); }
    finally { setBusy(false); }
  }

  return <section><div className="admin-section-heading"><h2>Food counter &amp; meals</h2><div className="admin-actions">
    <button disabled={busy} onClick={() => run(() => adminRequest('/api/admin/meals/apply-plan', {}), 'Event meal entitlements applied from the fee sheet.')}>Apply event meal plan</button>
    <button disabled={!events.length} onClick={() => setEditor({ title: 'Create meal session', path: '/api/admin/meals', fields: [{ name: 'typeOfMeal', label: 'Type', options: mealTypeOptions }, { name: 'label', label: 'Label (optional, e.g. “Day 1 lunch”)' }, { name: 'date', label: 'Date', type: 'date', required: true }, ...events.map(e => ({ name: `event:${e.id}`, label: e.name, type: 'checkbox' }))], transform: data => { const eventIds = events.filter(e => data[`event:${e.id}`]).map(e => e.id); if (!eventIds.length) throw new Error('Select at least one event.'); return { typeOfMeal: data.typeOfMeal, label: data.label || null, date: new Date(String(data.date)).toISOString(), eventIds }; } })}>Create session</button>
  </div></div>
    <p className="admin-hint">Sessions are counted, not named: the fee sheet grants an event “2 Meal + 2 Snacks”, so those passes are Meal 1, Meal 2, Snack 1 and Snack 2. Applying the plan creates the sessions and links every event to exactly the passes it is entitled to.</p>
    <LoadState {...resource} />{resource.error && <p>Meal features require the backend meal schema to be installed. Other admin sections remain available.</p>}
    {error && <p role="alert" className="admin-error">{error}</p>}{notice && <p role="status" className="admin-success">{notice}</p>}

    <article className="admin-card">
      <h3>Serve a participant</h3>
      <p>Select a meal or snack and generate its counter QR for participants to scan. Pass codes remain available as a fallback.</p>
      <label>Counter session
        <select value={counterId} onChange={e => { setCounterId(e.target.value); setQrId(''); setCode(''); setClaim(null); setError(''); setNotice(''); }}>
          <option value="">Select the session being served…</option>
          {list.map(meal => <option key={text(meal.id)} value={text(meal.id)}>{sessionName(meal)} — {new Date(String(meal.date)).toLocaleDateString()}</option>)}
        </select>
      </label>
      <div className="admin-actions">
        <button className="primary" disabled={!counter || !counter.isServingNow} onClick={() => setQrId(counterId)}>Generate counter QR</button>
        {qrId && <button onClick={() => setQrId('')}>Hide QR</button>}
      </div>
      {qrId && <MealCounterQr key={qrId} mealId={qrId} setCounts={setCounts} />}

      {counter && !counter.isServingNow && (
        <p role="alert" className="admin-error">
          {sessionName(counter)} is not being served right now
          {clockTime(counter.startTime) ? ` — its window is ${clockTime(counter.startTime)}–${clockTime(counter.endTime)} on ${new Date(String(counter.date)).toLocaleDateString()}` : ''}.
          Redemptions are refused outside it.
        </p>
      )}

      {!counterId ? <p>Pick the session above before taking a code.</p> : (
        <div className="admin-counter-code">
          <p>Every pass shows an 8-character code under it. Ask the participant to read theirs out.</p>
          <form onSubmit={e => {
            e.preventDefault();
            void run(() => adminRequest(`/api/admin/meals/${enc(counterId)}/verify-code`, { code: code.trim() }), 'Pass code verified and redeemed.').then(() => setCode(''));
          }}>
            <label>Pass code{counter ? ` for ${sessionName(counter)}` : ''}
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="7K2M-9QP4" autoCapitalize="characters" autoComplete="off" spellCheck={false} autoFocus />
            </label>
            <div className="admin-actions">
              <button className="primary" disabled={busy || !code.trim()}>{busy ? 'Verifying…' : 'Verify and redeem'}</button>
              <button type="button" disabled={busy || !code.trim()} onClick={() => {
                setError(''); setNotice('');
                adminRequest(`/api/admin/meals/${enc(counterId)}/lookup-code`, { code: code.trim() })
                  .then(result => { const found = record(result); setClaim(found); if (!found.found) setError('No participant holds that code for this session.'); })
                  .catch(err => setError(err instanceof Error ? err.message : 'Lookup failed.'));
              }}>Check without redeeming</button>
            </div>
          </form>
          <details><summary>They can&rsquo;t find their code?</summary>
            <p>Look the participant up by Fest ID or email with the “By Fest ID” action on the session row below.</p>
          </details>
        </div>
      )}
      {!!claim && <Details value={claim} />}
    </article>

    <Table headings={['Session', 'Date', 'Serving window', 'Eligible events', 'Served', 'Actions']} empty={!list.length}>{list.map(meal => <tr key={text(meal.id)}><td>{sessionName(meal)}{meal.isServingNow ? ' • serving now' : ''}</td><td>{new Date(String(meal.date)).toLocaleDateString()}</td><td>{clockTime(meal.startTime) ? `${clockTime(meal.startTime)} – ${clockTime(meal.endTime)}` : 'Default hours'}</td><td>{rows(meal.events).map(e => text(e.name)).join(', ') || '—'}</td><td>{text(counts[text(meal.id)] ?? meal.scannedCount)}</td><td><div className="admin-actions"><button onClick={() => { setCounterId(text(meal.id)); setQrId(''); setError(''); setNotice(''); }}>Open at counter</button><button onClick={() => setEditor({ title: `Reschedule ${sessionName(meal)}`, path: `/api/admin/meals/${enc(meal.id)}`, method: 'PATCH', fields: [{ name: 'label', label: 'Label', value: meal.label ?? '' }, { name: 'date', label: 'Date', type: 'date' }, { name: 'startTime', label: 'Serving starts', type: 'datetime-local' }, { name: 'endTime', label: 'Serving ends', type: 'datetime-local' }], transform: data => Object.fromEntries(Object.entries(data).filter(([, value]) => value !== '' && value !== null)) })}>Reschedule</button><button onClick={() => setEditor({ title: `Verify participant — ${sessionName(meal)}`, path: `/api/admin/meals/${enc(meal.id)}/verify-participant`, fields: [{ name: 'identifier', label: 'Fest ID, email or user ID', required: true }], warning: 'This verifies and redeems the participant’s meal.' })}>By Fest ID</button></div></td></tr>)}</Table>

    {editor && <EditorDialog editor={editor} close={() => setEditor(null)} saved={() => { setNotice('Saved successfully.'); resource.reload(); }} />}
  </section>;
}
