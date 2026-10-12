'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParticipant } from '@/components/auth/ParticipantSession';
import { authRequest, ApiError } from '@/lib/auth';
import { getAuthToken } from '@/lib/supabase';
import { participantRequest, formatDate, fullName, type EventInfo, type Team, type Registration } from '@/lib/participant';
import s from './Portal.module.css';

export function EventRegistration() {
  const router = useRouter(), params = useSearchParams();
  const requestedEvent = params.get('eventId');
  const { user, loading } = useParticipant();
  const [event, setEvent] = useState<EventInfo | null>(null), [team, setTeam] = useState<Team | null>(null);
  const [registered, setRegistered] = useState(false), [ready, setReady] = useState(false);
  const [teamName, setTeamName] = useState(''), [identifier, setIdentifier] = useState('');
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const refresh = useCallback(async () => {
    if (!user || !requestedEvent) return;
    const token = getAuthToken();
    try {
      const result = await authRequest(`/api/events/${encodeURIComponent(requestedEvent)}`);
      const current: EventInfo = result.data;
      const expectedPath = current.isTeamEvent ? '/register/team' : '/register/event';
      if (window.location.pathname !== expectedPath) { router.replace(`${expectedPath}?eventId=${encodeURIComponent(current.id)}`); return; }
      const [teams, registrations] = await Promise.all([
        participantRequest<{ teams: { id: number; eventId: string }[] }>('/api/user/teams/my'),
        participantRequest<{ registrations: Registration[] }>('/api/user/registrations'),
      ]);
      const existing = teams.teams.find(item => item.eventId === current.id);
      const live = existing ? await participantRequest<Team>(`/api/user/teams/${existing.id}/live-status`) : null;
      if (getAuthToken() !== token) return;
      setEvent(current); setTeam(live); setRegistered(registrations.registrations.some(item => item.eventId === current.id && item.status !== 'cancelled'));
      setReady(true); setError('');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) router.replace(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      setError(err instanceof Error ? err.message : 'Could not load this event.');
    }
  }, [user, requestedEvent, router]);
  useEffect(() => {
    if (!loading && !user) {
      const next = window.location.pathname + window.location.search;
      sessionStorage.setItem('tf_return_to', next);
      router.replace(`/login?next=${encodeURIComponent(next)}`); return;
    }
    void refresh();
    const poll = () => { if (!document.hidden) void refresh(); };
    const timer = window.setInterval(poll, 15000);
    return () => clearInterval(timer);
  }, [user, loading, refresh, router]);
  async function mutate(work: () => Promise<unknown>, message: string) {
    setBusy(true); setError(''); setNotice('');
    try { await work(); await refresh(); setNotice(message); window.dispatchEvent(new Event('tf-inbox-change')); }
    catch (err) { setError(err instanceof Error ? err.message : 'Please try again.'); }
    finally { setBusy(false); }
  }
  if (!requestedEvent) return <main className={s.shell}><h1 className="text-3xl font-bold">Choose your event first</h1><p className={s.empty}>Team size and registration rules depend on the event.</p><Link className={s.button} href="/events">Explore events</Link>{/* Complete Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setShowProfileModal(false)}>
          <div className={`${s.card} max-w-md w-full relative border border-[#FFFF1A]/50`} onClick={e => e.stopPropagation()}>
            <span className={s.eyebrow}>Account Setup</span>
            <h2 className="mt-2 text-xl font-bold text-white">Complete Your Profile</h2>
            <p className={`${s.muted} text-xs mb-5`}>
              Please provide your college name and WhatsApp/phone number before registering for events.
            </p>
            <form className={s.form} onSubmit={async e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const college = (fd.get('collegeName') as string || '').trim();
              const phone = (fd.get('phoneNumber') as string || '').trim();
              if (!college || !phone) {
                setError('Both college name and phone number are required.');
                return;
              }
              setBusy(true);
              setError('');
              try {
                await participantRequest('/api/user/profile', {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  collegeName: college,
                  phoneNumber: phone,
                }, 'PATCH');
                window.dispatchEvent(new Event('tf-auth-change'));
                setShowProfileModal(false);
                setNotice('Profile updated! You can now register for the event.');
                await refresh();
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to update profile.');
              } finally {
                setBusy(false);
              }
            }}>
              <label>
                College / Institute Name
                <input name="collegeName" required defaultValue={user.collegeName || ''} maxLength={160} placeholder="e.g. IIIT Nagpur" />
              </label>
              <label>
                Phone Number (WhatsApp)
                <input name="phoneNumber" type="tel" required defaultValue={user.phoneNumber || ''} maxLength={20} placeholder="e.g. +91 9876543210" pattern="^[+\d ()-]{7,20}$" />
              </label>
              {error && <p className={s.error} role="alert">{error}</p>}
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className={s.secondary} onClick={() => setShowProfileModal(false)}>Cancel</button>
                <button type="submit" disabled={busy} className={s.button}>
                  {busy ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  </main>;
  if (loading || !user) return <main className={s.shell}><p role="status">Checking your account…</p></main>;
  const closed = !!event && new Date(event.registrationEndTime) <= new Date();
  const paymentRequired = !!event && event.price > 0 && event.paymentTrigger === 'before_registration';
  const isVerified = Boolean(user && user.verified);
  const isProfileIncomplete = Boolean(user && (!user.collegeName?.trim() || !user.phoneNumber?.trim()));
  const canRegister = !!event && !registered && !closed && !paymentRequired && !isProfileIncomplete && isVerified && (!event.isTeamEvent || (!!team?.isLeader && team.stats.isReadyForRegistration && !team.stats.isRegistered));
  return <main className={s.shell}>
    <Link className={s.eyebrow} href="/events">← All events</Link>
    <header className={s.hero}><div><p className={`${s.eyebrow} mt-5`}>{event?.club || 'TantraFiesta 2026'}</p><h1>{event?.name || 'Your next challenge'}</h1><p className={s.muted}>{event?.isTeamEvent ? 'Build your squad. Invite with TF IDs. Register together.' : 'One participant. One challenge. Your next achievement.'}</p></div><Link className={s.secondary} href="/profile">My portal ↗</Link></header>
    {error && <div className={s.error} role="alert">{error} <button className={s.secondary} onClick={refresh}>Refresh</button></div>}
    {notice && <p className={s.notice} role="status">{notice}</p>}
    {!ready || !event ? <p role="status">Loading registration details…</p> : <div className={s.grid}><div className={s.stack}>
      {registered || team?.stats.isRegistered ? <section className={s.card}><span className={`${s.badge} ${s.accepted}`}>Registered</span><h2 className="mt-4">You’re on the list.</h2><p className={s.muted}>Your registration is saved for {event.name}. Track your events and rounds in your portal.</p><Link className={`${s.button} mt-5`} href="/profile">Go to my portal</Link></section> : null}
      {event.isTeamEvent ? !team ? <section className={s.card}><h2>Create your team</h2><p className={`${s.muted} mb-5`}>You’ll be the leader. Invite teammates after creating your draft.</p><form className={s.form} onSubmit={e => { e.preventDefault(); void mutate(() => participantRequest('/api/user/teams', { eventId: event.id, name: teamName, members: [] }), 'Team created. Invite your teammates below.'); }}>
        <label>Team name<input required maxLength={80} value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Give your squad a name"/></label><label>Team leader<input readOnly value={`${fullName(user)} · ${user.festId || user.email}`}/></label><button disabled={busy || closed || registered || !isVerified || isProfileIncomplete} className={s.button}>{busy ? 'Creating…' : 'Create team'}</button>
        {!isVerified && <p className={`${s.fine} text-pink-300 mt-2`}>Please verify your email before creating a team.</p>}
      </form></section> : <>
        <section className={s.card}><div className={s.row}><div><p className={s.eyebrow}>{team.teamCode}</p><h2 className="mt-2">{team.name}</h2></div><span className={s.badge}>{team.isLeader ? 'Team leader' : 'Team member'}</span></div>
          <div className={s.progress} aria-label={`${team.members.length} of ${event.maxTeamSize || 4} slots filled`}>{Array.from({length: Math.min(event.maxTeamSize || 4, 20)}, (_,i) => <span key={i} className={i < team.members.length ? s.filled : ''}/>)}</div>
          <p className={s.muted}>{team.members.length} accepted · {team.stats.pendingCount} pending · {event.minTeamSize}–{event.maxTeamSize} members required</p>
          {team.members.map(member => <div className={s.entry} key={member.id}><div className={s.row}><div><h3>{fullName(member)}</h3><p className={s.fine}>{member.festId}</p></div><span className={`${s.badge} ${s.accepted}`}>{member.isLeader ? 'Leader' : 'Accepted'}</span>{team.isLeader && !member.isLeader && !team.stats.isRegistered && <button disabled={busy} className={s.secondary} onClick={() => mutate(() => participantRequest(`/api/user/teams/${team.id}/members`, { userId: member.id }, 'DELETE'), 'Member removed.')}>Remove</button>}</div></div>)}
          {team.invites.filter(invite => invite.status !== 'ACCEPTED').map(invite => <div className={s.entry} key={invite.id}><div className={s.row}><div><h3>{invite.user ? fullName(invite.user) : invite.email}</h3><p className={s.fine}>{invite.user?.festId}</p></div><span className={`${s.badge} ${invite.status === 'PENDING' ? s.pending : ''}`}>{invite.status}</span>{team.isLeader && invite.status === 'PENDING' && !team.stats.isRegistered && <button className={s.secondary} disabled={busy} onClick={() => mutate(() => participantRequest(`/api/user/teams/${team.id}/members`, { inviteId: invite.id }, 'DELETE'), 'Invitation cancelled.')}>Cancel invite</button>}</div></div>)}
          {team.isLeader && !team.stats.isRegistered && team.stats.isReadyForRegistration && <div className="mt-4 p-4 rounded-xl bg-[#faff52]/15 border border-[#faff52]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"><div><h4 className="font-bold text-[#faff52]">Team is ready!</h4><p className={s.fine}>Minimum team size reached. Finalize your registration below.</p></div><button disabled={busy} className={s.button} onClick={() => mutate(() => participantRequest('/api/user/registrations', { eventId: event.id, teamId: team.id }), 'Registration confirmed!')}>{busy ? 'Registering…' : 'Register team now'}</button></div>}
        </section>
        {team.isLeader && !team.stats.isRegistered && <section className={s.card}><h2>Invite a teammate</h2><p className={`${s.muted} mb-4`}>Ask for their TF ID from their profile. They’ll receive an invitation in their portal.</p><form className={s.form} onSubmit={e => { e.preventDefault(); void mutate(async () => { await participantRequest(`/api/user/teams/${team.id}/invites`, { identifier: identifier.trim().toUpperCase() }); setIdentifier(''); }, 'Invitation sent. Your teammate can accept or decline in their inbox.'); }}><label>Teammate’s TF ID<input required pattern="[Tt][Ff][0-9]{6}" placeholder="TF123456" value={identifier} onChange={e => setIdentifier(e.target.value.toUpperCase())}/></label><button className={s.button} disabled={busy || closed || team.members.length + team.stats.pendingCount >= (event.maxTeamSize || 4)}>Send invitation</button></form></section>}
      </> : <section className={s.card}><h2>Your participant details</h2><h3>{fullName(user)}</h3><p className={s.muted}>{user.email}</p><p className={s.id}>{user.festId}</p><p className={s.muted}>{user.collegeName || 'You can add your college in your profile.'}</p></section>}
    </div><aside className={s.card}><p className={s.eyebrow}>Registration summary</p><h2 className="mt-4">{event.name}</h2><div className={s.entry}><p className={s.muted}>Format</p><h3>{event.isTeamEvent ? `Team · ${event.minTeamSize}–${event.maxTeamSize} members` : 'Individual'}</h3></div><div className={s.entry}><p className={s.muted}>Registration closes</p><h3>{formatDate(event.registrationEndTime)} IST</h3></div><div className={s.entry}><p className={s.muted}>Entry fee</p><h3>{event.price ? `₹${event.price}${event.paymentTrigger === 'after_round' ? ' · after qualification' : ''}` : 'Free registration'}</h3></div>
      {closed && <p className={s.error}>Registration is closed.</p>}
      {paymentRequired && !registered && <p className={s.error}>Payment is required before registration. Contact the event organizer for checkout assistance.</p>}
      {event.isTeamEvent && !registered && <p className={`${s.muted} mb-4`}>{!team ? 'Create a team first.' : !team.isLeader ? 'Your team leader completes registration for everyone.' : !team.stats.isReadyForRegistration ? 'Meet the minimum team size and resolve all pending invitations before registering.' : 'Your team is ready to register.'}</p>}
      {!isVerified ? (
        <div className="p-4 rounded-xl bg-[#E7137D]/20 border border-[#E7137D] mb-3 text-left">
          <h4 className="font-bold text-[#FFFF1A] text-sm">Email Verification Required</h4>
          <p className={`${s.fine} mt-1 mb-2`}>Your account is not verified. Please verify your email before registering for events.</p>
        </div>
      ) : isProfileIncomplete ? (
        <div className="p-4 rounded-xl bg-[#FFFF1A]/10 border border-[#FFFF1A]/40 mb-3 text-left">
          <h4 className="font-bold text-[#FFFF1A] text-sm">Action Required</h4>
          <p className={`${s.fine} mt-1 mb-3`}>Please provide your college name and phone number to unlock registration.</p>
          <button type="button" className={`${s.button} w-full`} onClick={() => setShowProfileModal(true)}>Complete Profile</button>
        </div>
      ) : (
        <button className={`${s.button} w-full`} disabled={busy || !canRegister} onClick={() => mutate(() => participantRequest('/api/user/registrations', { eventId: event.id, ...(team ? { teamId: team.id } : {}) }), 'Registration confirmed!')}>{busy ? 'Please wait…' : registered ? 'Registered' : event.isTeamEvent ? 'Register team' : 'Confirm registration'}</button>
      )}
      <p className={s.fine}>Joining a team does not register it. The leader confirms registration once everyone is ready.</p>
    </aside></div>}
  </main>;
}
