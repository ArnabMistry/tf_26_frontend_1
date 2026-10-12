'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiError, authRequest, destination, type AuthUser } from '@/lib/auth';
import { hasSessionHint, clearSignedIn } from '@/lib/session';
import dynamic from 'next/dynamic';
import { enc, person, record, text, type Dashboard } from '@/lib/admin';
import { LoadState, Table, useAdminData } from '@/components/admin/AdminUI';

const EventTools = dynamic(() => import('@/components/admin/EventTools').then(m => m.EventTools), {
  loading: () => <p className="admin-loading-card">Loading event tools…</p>,
});
const Promotion = dynamic(() => import('@/components/admin/EventTools').then(m => m.Promotion), {
  loading: () => <p className="admin-loading-card">Loading round promotion…</p>,
});
const Registrations = dynamic(() => import('@/components/admin/EventTools').then(m => m.Registrations), {
  loading: () => <p className="admin-loading-card">Loading registrations…</p>,
});
const Coordinators = dynamic(() => import('@/components/admin/Governance').then(m => m.Coordinators), {
  loading: () => <p className="admin-loading-card">Loading coordinators…</p>,
});
const Users = dynamic(() => import('@/components/admin/Governance').then(m => m.Users), {
  loading: () => <p className="admin-loading-card">Loading user governance…</p>,
});
const Meals = dynamic(() => import('@/components/admin/Meals').then(m => m.Meals), {
  loading: () => <p className="admin-loading-card">Loading meal counter…</p>,
});
import '@/components/admin/admin.css';
import { logout } from '@/lib/session';

export function AdminPanel(props: { superAdmin?: boolean; eventId?: string }) {
  return <Suspense fallback={<main className="admin-workspace">Loading admin panel…</main>}><AdminGate key={`${props.superAdmin}-${props.eventId}`} {...props} /></Suspense>;
}
function AdminGate({ superAdmin = false, eventId }: { superAdmin?: boolean; eventId?: string }) {
  const router = useRouter(); const [user, setUser] = useState<AuthUser | null>(null); const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const token = hasSessionHint() ? 'session' : null;
    if (!token) { router.replace('/login'); return; }
    authRequest('/api/auth/me', undefined, token).then(({ data }) => {
      if (!active) return;
      const profile: AuthUser = data.user;
      if ((superAdmin && profile.role !== 'super') || (!superAdmin && profile.role !== 'event_admin')) { router.replace(destination(profile)); return; }
      if (eventId && !profile.allowedEventIds?.includes(eventId)) { setError('You do not have access to this event.'); return; }
      setUser(profile);
    }).catch(err => {
      if (!active) return;
      if (err instanceof ApiError && err.status === 401) { clearSignedIn(); router.replace('/login'); return; }
      setError(err instanceof Error ? err.message : 'Unable to verify access.');
    });
    return () => { active = false; };
  }, [superAdmin, eventId, router]);
  if (!user || error) return <main className="admin-workspace"><LoadState loading={!error} error={error} /><Link href="/admin">My admin panel</Link> · <Link href="/login">Log in</Link></main>;
  return <Workspace key={`${user.id}-${eventId || 'all'}`} user={user} eventId={eventId} />;
}
function Workspace({ user, eventId }: { user: AuthUser; eventId?: string }) {
  const router = useRouter(); const params = useSearchParams(); const superAdmin = user.role === 'super';
  const resource = useAdminData('/api/admin/dashboard'); const dashboard = resource.data as Dashboard | null;
  const tabs = [{ id: 'overview', name: 'Overview' }, { id: 'events', name: 'Event management' }, { id: 'registrations', name: 'Registrations' }, { id: 'promotion', name: 'Round promotion' }, { id: 'meals', name: 'Food counter' }, ...(superAdmin ? [{ id: 'users', name: 'User governance' }, { id: 'staff', name: 'Coordinators' }] : [])];
  const view = tabs.some(t => t.id === params.get('view')) ? params.get('view')! : 'overview';
  const events = dashboard?.perEventStats || [];
  const selectedId = eventId || (events.some(e => e.id === params.get('event')) ? params.get('event')! : events[0]?.id || '');
  const selected = events.find(e => e.id === selectedId);
  const recent = dashboard?.recentRegistrations?.filter(r => superAdmin || r.eventId === selectedId || record(r.event).id === selectedId) || [];
  function href(tab: string, id = selectedId) { return superAdmin ? `/admin/super?view=${tab}${id ? `&event=${enc(id)}` : ''}` : `${id ? `/admin/events/${enc(id)}` : '/admin/events'}?view=${tab}`; }
  const eventRequired = ['registrations', 'promotion'].includes(view);
  return <main className="admin-workspace"><div className="admin-layout">
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link className="admin-brand" href="/" title="Go to TantraFiesta Website Homepage">
          <div className="admin-brand-icon-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/tf_logo.png" alt="TantraFiesta" className="admin-brand-icon" width="28" height="28" loading="lazy" />
          </div>
          <div className="admin-brand-text">
            <span className="admin-brand-title">TANTRAFIESTA</span>
            <span>CONTROL CENTER / 2026</span>
          </div>
        </Link>
        <p className="admin-role">{superAdmin ? 'SUPER ADMIN' : 'EVENT ADMIN'}</p>
      </div>
      <nav aria-label="Admin sections">{tabs.map(tab => <Link key={tab.id} href={href(tab.id)} aria-current={view === tab.id ? 'page' : undefined}>{tab.name}</Link>)}</nav>
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-sidebar-home-link" title="Return to Website Homepage">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to website
        </Link>
        <Link href="/register/admin">Admin registration</Link>
        <button onClick={async () => { await logout(); router.replace('/login'); }}>Log out</button>
      </div>
    </aside>
    <div className="admin-content">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">{superAdmin ? 'FESTIVAL OPERATIONS' : 'YOUR ASSIGNED EVENT'}</p>
          <h1>{superAdmin ? 'Admin control center' : selected?.name || 'Event admin panel'}</h1>
        </div>
        <div className="admin-topbar-actions">
          <Link href="/" className="admin-home-btn" title="Go to Website Homepage">
            <svg className="admin-home-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Website Homepage</span>
          </Link>
          <button onClick={resource.reload}>Refresh overview</button>
        </div>
      </header>
      <LoadState {...resource} />
      {dashboard && <><div className="admin-event-picker"><label>{superAdmin ? 'Manage event' : 'Assigned event'}<select value={selectedId} onChange={e => router.push(href(view, e.target.value))}><option value="" disabled>Select event</option>{events.map(event => <option key={event.id} value={event.id}>{event.name}</option>)}</select></label><span>{events.length} {superAdmin ? 'events' : 'assigned events'}</span></div>
        {eventRequired && !selected ? <article className="admin-card">No event assigned. Contact a super admin to get access.</article> : <div key={`${view}-${selectedId}`}>
          {view === 'overview' && <><div className="admin-stats">{Object.entries(superAdmin ? dashboard.totals : { registrations: selected?._count.registrations || 0, teams: selected?._count.teams || 0, rounds: selected?._count.rounds || 0, assignedEvents: events.length }).map(([name, count]) => <article key={name}><span>{name.replace('assignedEvents', 'Assigned events')}</span><strong>{count}</strong></article>)}</div>
            <div className="admin-section-heading"><h2>{superAdmin ? 'Festival events' : 'Your events'}</h2><Link href={href('events')}>Manage events →</Link></div>
            <div className="admin-event-grid">{events.map(event => <Link className="admin-card" key={event.id} href={href('events', event.id)}><span className="admin-eyebrow">{event.club}</span><h3>{event.name}</h3><p>{event._count.registrations} registrations · {event._count.teams} teams</p><span className="admin-link">Open event →</span></Link>)}</div>
            {!events.length && <p>No events assigned yet.</p>}<h2>Recent registrations</h2><Table headings={['Event', 'Participant / Team', 'Status']} empty={!recent.length}>{recent.map(r => <tr key={text(r.id)}><td>{text(record(r.event).name)}</td><td>{text(record(r.team).name || person(r.user))}</td><td><span className="admin-badge">{text(r.status)}</span></td></tr>)}</Table>
          </>}
          {view === 'events' && <EventTools eventId={selectedId} superAdmin={superAdmin} changed={resource.reload} />}
          {view === 'registrations' && <Registrations eventId={selectedId} />}
          {view === 'promotion' && <Promotion eventId={selectedId} />}
          {view === 'meals' && <Meals events={events} />}
          {view === 'users' && superAdmin && <Users currentUserId={user.id} />}
          {view === 'staff' && superAdmin && <Coordinators events={events} />}
        </div>}
      </>}
    </div>
  </div></main>;
}
