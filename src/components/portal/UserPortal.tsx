'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParticipant } from '@/components/auth/ParticipantSession';
import { ApiError } from '@/lib/auth';
import { getAuthToken, logout } from '@/lib/supabase';
import { participantRequest, fullName, formatDate, type Profile, type Inbox, type Notification } from '@/lib/participant';
import s from './Portal.module.css';

export function UserPortal() {
  const { user, loading } = useParticipant();
  const router = useRouter(), params = useSearchParams();
  const tab = params.get('tab') || 'overview';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState('');
  const load = useCallback(async () => {
    if (!user) return;
    const token = getAuthToken();
    try {
      const [nextProfile, nextInbox] = await Promise.all([participantRequest<Profile>('/api/user/profile'), participantRequest<Inbox>(`/api/user/notifications?page=${page}`)]);
      if (getAuthToken() !== token) return;
      setProfile(nextProfile); setInbox(nextInbox); setError('');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) router.replace('/login?next=%2Fprofile');
      setError(err instanceof Error ? err.message : 'Could not load your portal.');
    }
  }, [user, page, router]);
  useEffect(() => {
    if (!loading && !user) { router.replace('/login?next=%2Fprofile'); return; }
    void load();
    const refresh = () => { if (!document.hidden) void load(); };
    const timer = window.setInterval(refresh, 30000);
    document.addEventListener('visibilitychange', refresh);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, [loading, user, load, router]);
  async function mutate(key: string, work: () => Promise<unknown>, message: string) {
    setBusy(key); setError(''); setNotice('');
    try { await work(); await load(); setNotice(message); window.dispatchEvent(new Event('tf-inbox-change')); }
    catch (err) { setError(err instanceof Error ? err.message : 'Please try again.'); }
    finally { setBusy(''); }
  }
  function respond(item: Notification, action: 'accept' | 'reject') {
    return mutate(`invite-${item.id}`, async () => {
      await participantRequest(`/api/invites/${item.inviteId}/respond`, { action });
      await participantRequest(`/api/user/notifications/${item.id}/read`, {}, 'PATCH');
    }, action === 'accept' ? 'Invitation accepted. Your team is now visible below.' : 'Invitation declined.');
  }
  if (loading || !user) return <main className={s.shell}><p role="status">Loading your account…</p></main>;
  return <main className={s.shell}>
    <p className={s.eyebrow}>TantraFiesta 2026 · Participant portal</p>
    <header className={s.hero}><div><h1>Your fest. Your space.</h1><p className={s.muted}>Welcome back, {profile?.user.firstName || user.firstName}. Build your team and make your next move.</p></div><Link href="/events" className={s.button}>Explore events ↗</Link></header>
    {error && <div role="alert" className={s.error}>{error} <button onClick={load} className={s.secondary}>Retry</button></div>}
    {notice && <p role="status" className={s.notice}>{notice}</p>}
    {!profile ? <p role="status">Loading your events and teams…</p> : <>
      <div className={s.stats}>{[[profile.stats.totalRegisteredEvents, 'Registered events'], [profile.stats.totalTeams, 'Your teams'], [inbox?.unreadCount || 0, 'Unread notifications']].map(([value, label]) => <div className={s.stat} key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      <div className={s.tabs} aria-label="Portal sections">{[['overview','Overview'],['notifications','Notifications'],['settings','Edit profile']].map(([key,label]) => <Link key={key} href={`/profile?tab=${key}`} className={`${s.secondary} ${tab === key ? s.activeTab : ''}`} aria-current={tab === key ? 'page' : undefined}>{label}{key === 'notifications' && inbox?.unreadCount ? ` (${inbox.unreadCount})` : ''}</Link>)}</div>
      <div className={s.grid}><div className={s.stack}>
        {tab === 'notifications' ? <section className={s.card} id="notifications"><div className={s.row}><h2>Your inbox</h2><span className={s.badge}>Updates every 30 seconds</span></div>
          {!inbox?.notifications.length && <p className={s.empty}>All caught up. Team invitations and responses will appear here.</p>}
          {inbox?.notifications.map(item => <article className={s.entry} key={item.id}>
            <div className={s.row}><span className={`${s.badge} ${item.status === 'PENDING' ? s.pending : item.status === 'ACCEPTED' ? s.accepted : ''}`}>{item.status}</span>{!item.readAt && <span className={s.eyebrow}>New</span>}</div>
            <h3 className="mt-3">{item.kind === 'TEAM_INVITE' ? `${item.senderName} invited you to ${item.teamName}` : `${item.senderName} ${item.status.toLowerCase()} your invitation`}</h3>
            <p className={s.muted}>{item.eventName}</p><p className={s.fine}>Sent {formatDate(item.createdAt)} IST{item.respondedAt ? ` · Responded ${formatDate(item.respondedAt)} IST` : ''}</p>
            <div className={`${s.row} mt-3`}>
              {item.kind === 'TEAM_INVITE' && item.status === 'PENDING' && item.inviteId ? <div className="flex gap-2"><button className={s.button} disabled={!!busy} onClick={() => respond(item, 'accept')}>Accept invitation</button><button className={s.secondary} disabled={!!busy} onClick={() => respond(item, 'reject')}>Decline</button></div> : <Link className={s.secondary} href={`/register/team?eventId=${encodeURIComponent(item.eventId)}`}>View event team</Link>}
              {!item.readAt && <button disabled={!!busy} className={s.secondary} onClick={() => mutate(`read-${item.id}`, () => participantRequest(`/api/user/notifications/${item.id}/read`, {}, 'PATCH'), 'Marked as read.')}>Mark read</button>}
            </div>
          </article>)}
          {!!inbox && inbox.totalPages > 1 && <div className={s.row}><button className={s.secondary} disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>{page} / {inbox.totalPages}</span><button className={s.secondary} disabled={page >= inbox.totalPages} onClick={() => setPage(page + 1)}>Next</button></div>}
        </section> : tab === 'settings' ? <section className={s.card}><h2>Make it yours</h2><p className={`${s.muted} mb-5`}>Keep your contact details ready for the event team.</p>
          <form key={profile.user.id} className={s.form} onSubmit={e => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); void mutate('profile', () => participantRequest('/api/user/profile', data, 'PATCH'), 'Profile updated.'); }}>
            <div className={s.fields}><label>First name<input name="firstName" defaultValue={profile.user.firstName} required maxLength={80}/></label><label>Last name<input name="lastName" defaultValue={profile.user.lastName} maxLength={80}/></label></div>
            <label>College<input name="collegeName" defaultValue={profile.user.collegeName || ''} maxLength={160}/></label><label>Phone number<input name="phoneNumber" type="tel" defaultValue={profile.user.phoneNumber || ''} maxLength={20}/></label>
            <label>Email<input value={profile.user.email} readOnly/></label><p className={s.fine}>Your email, TF ID and account role are managed by the authentication system.</p><button className={s.button} disabled={!!busy}>{busy === 'profile' ? 'Saving…' : 'Save profile'}</button>
          </form></section> : <>
          <section className={s.card}><div className={s.row}><h2>Registered events</h2><span className={s.badge}>Your lineup</span></div>
            {!profile.registeredEvents.length && <p className={s.empty}>Your next challenge is waiting. Explore an event and register to see it here.</p>}
            {profile.registeredEvents.map(item => <article key={item.id} className={s.entry}><div className={s.row}><div><p className={s.eyebrow}>{item.event.club}</p><h3 className="mt-2">{item.event.name}</h3></div><span className={s.badge}>{item.status.replaceAll('_',' ')}</span></div><p className={s.muted}>{item.team?.name || 'Individual entry'} · {item.event.venue || 'Venue to be announced'}</p><div className="flex flex-wrap gap-2 mt-3">{item.roundProgress?.map(round => <span key={round.roundId} className={s.badge}>{round.name}: {round.status}</span>)}</div><p className={`${s.fine} mt-3`}>Event ID: {item.eventId}</p></article>)}
          </section>
          <section className={s.card}><h2>Your teams</h2>{!profile.teams.length && <p className={s.empty}>Create a team from an event page, or accept a teammate’s invitation in your inbox.</p>}{profile.teams.map(team => <article className={s.entry} key={team.id}><div className={s.row}><div><h3>{team.name}</h3><p className={s.muted}>{team.event.name}</p></div><span className={s.badge}>{team.isLeader ? 'Team leader' : 'Member'}</span></div><p className={s.fine}>{team.members.map(fullName).join(' · ')}</p><Link className={`${s.secondary} mt-3`} href={`/register/team?eventId=${encodeURIComponent(team.eventId)}`}>Open team →</Link></article>)}</section>
        </>}
      </div><aside className={s.stack}>
        <section className={`${s.card} ${s.identity}`}><div className={s.row}><div className={s.avatar}>{profile.user.firstName?.[0]}{profile.user.lastName?.[0]}</div><span className={s.badge}>{profile.user.role.replaceAll('_',' ')}</span></div><h2 className="mt-5">{fullName(profile.user)}</h2><p className={s.muted}>{profile.user.collegeName || 'Add your college in Edit profile'}</p><p className={`${s.eyebrow} mt-6`}>Your invitation ID</p><p className={s.id}>{profile.user.festId || 'Not assigned'}</p><button disabled={!profile.user.festId} className={s.secondary} onClick={async () => { try { await navigator.clipboard.writeText(profile.user.festId || ''); setNotice('TF ID copied. Share it with your team leader.'); } catch { setError('Copy unavailable. Select your TF ID and copy it manually.'); } }}>Copy TF ID</button><p className={`${s.fine} mt-4`}>User ID: {profile.user.id}</p></section>
        <section className={s.card}><h2>Recent activity</h2>{!profile.activities.length && <p className={s.empty}>Your fest journey starts here.</p>}{profile.activities.slice(0,5).map(item => <div key={item.id} className={s.entry}><h3>{item.title}</h3><p className={s.fine}>{formatDate(item.timestamp)} IST</p></div>)}</section>
        <button className={s.secondary} onClick={async () => { await logout(); router.replace('/login'); }}>Log out</button>
      </aside></div>
    </>}
  </main>;
}
