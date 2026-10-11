'use client';
import { useState } from 'react';
import { adminRequest, enc, person, record, rows, text, type EventSummary } from '@/lib/admin';
import { EditorDialog, LoadState, Table, useAdminData, type Editor } from './AdminUI';

export function Users({ currentUserId }: { currentUserId: string }) {
  const [search, setSearch] = useState(''); const [query, setQuery] = useState(''); const [role, setRole] = useState(''); const [page, setPage] = useState(1);
  const resource = useAdminData(`/api/admin/users?page=${page}&limit=20&search=${enc(query)}&role=${enc(role)}`);
  const data = record(resource.data); const list = rows(data.users); const pagination = record(data.pagination);
  const [editor, setEditor] = useState<Editor | null>(null);
  return <section><h2>User governance</h2><form className="admin-actions" onSubmit={e => { e.preventDefault(); setQuery(search); setPage(1); }}><input aria-label="Search users" placeholder="Name, email, college or Fest ID" value={search} onChange={e => setSearch(e.target.value)} /><button>Search</button><select aria-label="Filter user role" value={role} onChange={e => { setRole(e.target.value); setPage(1); }}><option value="">All roles</option><option value="participant">Participant</option><option value="event_admin">Event admin</option><option value="super">Super admin</option></select></form>
    <LoadState {...resource} /><Table headings={['Name / User ID', 'Email', 'Fest ID', 'Role', 'Action']} empty={!list.length}>{list.map(user => <tr key={text(user.id)}><td>{text(user.firstName)} {text(user.lastName)}<br /><small>{text(user.id)}</small></td><td>{text(user.email)}</td><td>{text(user.festId)}</td><td><span className="admin-badge">{text(user.role)}</span></td><td><button disabled={user.id === currentUserId} onClick={() => setEditor({ title: `Update role: ${text(user.email)}`, path: `/api/admin/users/${enc(user.id)}/role`, method: 'PATCH', initial: user, warning: 'Super admins have access to all events. Event admins also need a coordinator assignment.', fields: [{ name: 'role', label: 'Role', options: [{ value: 'participant', label: 'Participant' }, { value: 'event_admin', label: 'Event admin' }, { value: 'super', label: 'Super admin' }] }] })}>Change role</button></td></tr>)}</Table>
    <div className="admin-actions"><button disabled={page === 1 || resource.loading} onClick={() => setPage(p => p - 1)}>Previous</button><span>Page {page} of {Number(pagination.totalPages) || 1}</span><button disabled={page >= (Number(pagination.totalPages) || 1) || resource.loading} onClick={() => setPage(p => p + 1)}>Next</button></div>
    {editor && <EditorDialog editor={editor} close={() => setEditor(null)} saved={resource.reload} />}
  </section>;
}

export function Coordinators({ events }: { events: EventSummary[] }) {
  const [filter, setFilter] = useState(''); const resource = useAdminData(`/api/admin/staff${filter ? `?eventId=${enc(filter)}` : ''}`);
  const [editor, setEditor] = useState<Editor | null>(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const list = rows(record(resource.data).assignments);
  return <section><div className="admin-section-heading"><h2>Coordinators</h2><button className="primary" disabled={!events.length} onClick={() => setEditor({ title: 'Assign coordinator', path: '/api/admin/staff', warning: 'Assigning a participant also grants them the event admin role.', fields: [{ name: 'eventId', label: 'Event', required: true, options: events.map(e => ({ value: e.id, label: e.name })) }, { name: 'userId', label: 'User ID (from User governance)', required: true }] })}>Assign coordinator</button></div>
    <label>Filter event<select value={filter} onChange={e => setFilter(e.target.value)}><option value="">All events</option>{events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label><LoadState {...resource} />{error && <p role="alert" className="admin-error">{error}</p>}
    <Table headings={['Event', 'Coordinator', 'Role', 'Action']} empty={!list.length}>{list.map(assignment => <tr key={text(assignment.id)}><td>{text(record(assignment.event).name)}</td><td>{person(assignment.user)}</td><td>{text(record(assignment.user).role)}</td><td><button className="danger" disabled={busy} onClick={async () => {
      if (!window.confirm(`Revoke ${person(assignment.user)}'s access to ${text(record(assignment.event).name)}?`)) return;
      setBusy(true); setError(''); try { await adminRequest(`/api/admin/staff/${enc(assignment.id)}`, undefined, 'DELETE'); resource.reload(); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to revoke assignment.'); } finally { setBusy(false); }
    }}>Revoke</button></td></tr>)}</Table>{editor && <EditorDialog editor={editor} close={() => setEditor(null)} saved={resource.reload} />}
  </section>;
}
