'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParticipant } from '@/components/auth/ParticipantSession';
import { authRequest, ApiError } from '@/lib/auth';
import { hasSessionHint } from '@/lib/session';
import { participantRequest, formatDate, fullName, type EventInfo, type Team, type Registration, type Person, type Profile } from '@/lib/participant';
import { payForEvent } from '@/lib/payments';
import s from './Portal.module.css';

export function EventRegistration() {
  const router = useRouter(), params = useSearchParams();
  const requestedEvent = params.get('eventId');
  const { user, loading } = useParticipant();
  const [profileUser, setProfileUser] = useState<Person | null>(null);
  const [event, setEvent] = useState<EventInfo | null>(null), [team, setTeam] = useState<Team | null>(null);
  const [registered, setRegistered] = useState(false), [ready, setReady] = useState(false);
  // The participant's own registration row, which carries round progress and
  // the payment state for events whose fee falls due after a promotion.
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [teamName, setTeamName] = useState(''), [identifier, setIdentifier] = useState('');
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const refresh = useCallback(async () => {
    if (!user || !requestedEvent) return;
    const token = hasSessionHint() ? 'session' : null;
    try {
      const result = await authRequest(`/api/events/${encodeURIComponent(requestedEvent)}`);
      const current: EventInfo = result.data;
      const expectedPath = current.isTeamEvent ? '/register/team' : '/register/event';
      if (window.location.pathname !== expectedPath) { router.replace(`${expectedPath}?eventId=${encodeURIComponent(current.id)}`); return; }
      const [teams, registrations, profile] = await Promise.all([
        participantRequest<{ teams: { id: number; eventId: string }[] }>('/api/user/teams/my'),
        participantRequest<{ registrations: Registration[] }>('/api/user/registrations'),
        participantRequest<Profile>('/api/user/profile'),
      ]);
      const existing = teams.teams.find(item => item.eventId === current.id);
      const live = existing ? await participantRequest<Team>(`/api/user/teams/${existing.id}/live-status`) : null;
      if ((hasSessionHint() ? 'session' : null) !== token) return;
      const mine = registrations.registrations.find(item => item.eventId === current.id && item.status !== 'cancelled') || null;
      setEvent(current); setTeam(live); setRegistration(mine); setRegistered(!!mine); setProfileUser(profile.user);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const poll = () => { if (!document.hidden) void refresh(); };
    const timer = window.setInterval(poll, 15000);
    return () => clearInterval(timer);
  }, [user, loading, refresh, router]);
  async function mutate(work: () => Promise<unknown>, message: string) {
    setBusy(true); setError(''); setNotice('');
    try { await work(); await refresh(); setNotice(message); window.dispatchEvent(new Event('tf-inbox-change')); return true; }
    catch (err) { setError(err instanceof Error ? err.message : 'Please try again.'); return false; }
    finally { setBusy(false); }
  }
  if (!requestedEvent) return <main className={s.shell}><h1 className="text-3xl font-bold">Choose your event first</h1><p className={s.empty}>Team size and registration rules depend on the event.</p><Link className={s.button} href="/events">Explore events</Link></main>;
  if (loading || !user) return <main className={s.shell}><p role="status">Checking your account…</p></main>;
  const participant = profileUser?.id === user.id ? profileUser : user;
  const closed = !!event && new Date(event.registrationEndTime) <= new Date();
  const paymentRequired = !!event && event.price > 0 && event.paymentTrigger === 'before_registration';
  const isVerified = Boolean(participant.verified);
  const isProfileIncomplete = !participant.collegeName?.trim() || !participant.phoneNumber?.trim();
  const canRegister = !!event && !registered && !closed && !isProfileIncomplete && isVerified && (!event.isTeamEvent || (!!team?.isLeader && team.stats.isReadyForRegistration && !team.stats.isRegistered));

  // `after_round` events are free to enter; the fee only opens once an admin
  // has promoted this participant into the round the fee is gated on.
  const payment = registration?.payment || null;
  const feeDueNow = !!payment?.dueNow;
  const feePaid = !!payment?.paid;
  const notPromoted = !!payment?.rejected;
  // On a team event the backend only accepts the fee from the team leader.
  const leadsTheTeam = !event?.isTeamEvent || !!team?.isLeader;
  const canPayFee = feeDueNow && leadsTheTeam && isVerified && !isProfileIncomplete;
  // The round whose promotion unlocked the fee, for the message copy.
  const feeRoundName = payment?.roundName || (payment?.roundNumber ? `Round ${payment.roundNumber}` : null);
  const decidedRounds = (registration?.roundProgress || []).filter(round => round.status !== 'PENDING');

  /**
   * Run the gateway for this event. Covers both fee models: an upfront fee
   * (which also creates the registration) and a fee that falls due after a
   * round promotion (which confirms an existing registration). The backend
   * decides which applies from the event's payment trigger.
   */
  async function runPayment(successMessage: string) {
    if (!event) return;
    if (!isVerified) {
      setError('Please verify your email before proceeding with payment.');
      return;
    }
    if (isProfileIncomplete) {
      setShowProfileModal(true);
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const completed = await payForEvent({
        eventId: event.id,
        eventName: event.name,
        user: participant,
        teamId: team?.id ?? null,
        onProgress: setNotice,
      });
      if (!completed) { setNotice(''); return; } // Checkout dismissed without paying.
      await refresh();
      setRegistered(true);
      setNotice(successMessage);
      window.dispatchEvent(new Event('tf-inbox-change'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be completed. Please try again.');
      setNotice('');
    } finally {
      setBusy(false);
    }
  }

  const handlePaymentAndRegistration = () => runPayment(`Payment verified! Registration confirmed for ${event?.name}.`);
  const handlePayFee = () => runPayment(`Payment verified! Your place in ${feeRoundName || 'the next round'} is confirmed.`);

  const handleAction = paymentRequired ? handlePaymentAndRegistration : () => mutate(() => participantRequest('/api/user/registrations', { eventId: event!.id, ...(team ? { teamId: team.id } : {}) }), 'Registration confirmed!');
  return <main className={s.shell}>
    <Link className={s.eyebrow} href="/events">← All events</Link>
    <header className={s.hero}><div><p className={`${s.eyebrow} mt-5`}>{event?.club || 'TantraFiesta 2026'}</p><h1>{event?.name || 'Your next challenge'}</h1><p className={s.muted}>{event?.isTeamEvent ? 'Build your squad. Invite with TF IDs. Register together.' : 'One participant. One challenge. Your next achievement.'}</p></div><Link className={s.secondary} href="/profile">My portal ↗</Link></header>
    {error && <div className={s.error} role="alert">{error} <button className={s.secondary} onClick={refresh}>Refresh</button></div>}
    {notice && <p className={s.notice} role="status">{notice}</p>}
    {!ready || !event ? <p role="status">Loading registration details…</p> : <div className={s.grid}><div className={s.stack}>
      {/* Promoted into the round this event's fee is gated on: the gateway is
          now open, and this is the participant's prompt to use it. */}
      {feeDueNow && <section className={`${s.card} border border-[#faff52]/60 bg-[#faff52]/10`}>
        <span className={`${s.badge} ${s.pending}`}>Payment due</span>
        <h2 className="mt-4">You’ve been promoted to {feeRoundName || 'the next round'}.</h2>
        <p className={s.muted}>
          {leadsTheTeam
            ? `Congratulations! Pay the ₹${event.price} entry fee to confirm ${event.isTeamEvent ? 'your team’s' : 'your'} place in ${feeRoundName || 'this round'}.`
            : `Congratulations! An entry fee of ₹${event.price} is now due. Your team leader${team?.leader ? ` (${fullName(team.leader)})` : ''} pays it for the whole team.`}
        </p>
        {leadsTheTeam && <button className={`${s.button} mt-5`} disabled={busy || !canPayFee} onClick={handlePayFee}>
          {busy ? 'Processing payment…' : `Pay ₹${event.price} now`}
        </button>}
        {leadsTheTeam && !isVerified && <p className={`${s.fine} mt-2`}>Verify your email before paying.</p>}
        {leadsTheTeam && isVerified && isProfileIncomplete && <p className={`${s.fine} mt-2`}>Add your college and phone number before paying.</p>}
      </section>}
      {feePaid && <section className={`${s.card} border border-[#faff52]/40`}>
        <span className={`${s.badge} ${s.accepted}`}>Fee paid</span>
        <h2 className="mt-4">Your place is confirmed.</h2>
        <p className={s.muted}>We’ve received ₹{event.price} for {event.name}. Nothing else to do — follow your round updates in your portal.</p>
      </section>}
      {notPromoted && <section className={s.card}>
        <span className={s.badge}>Not promoted</span>
        <h2 className="mt-4">This round didn’t go your way.</h2>
        <p className={s.muted}>You weren’t selected for the paid round of {event.name}, so no fee is due. Plenty of other events are still open.</p>
        <Link className={`${s.button} mt-5`} href="/events">Explore events</Link>
      </section>}
      {registered || team?.stats.isRegistered ? <section className={s.card}><span className={`${s.badge} ${s.accepted}`}>Registered</span><h2 className="mt-4">You’re on the list.</h2><p className={s.muted}>Your registration is saved for {event.name}. Track your events and rounds in your portal.</p>
        {/* Only decided rounds are worth showing - every event carries a
            Round 1 from creation, so undecided ones say nothing. */}
        {!!decidedRounds.length && <div className="flex flex-wrap gap-2 mt-4">{decidedRounds.map(round => <span key={round.roundId} className={`${s.badge} ${round.status === 'QUALIFIED' ? s.accepted : ''}`}>{round.name}: {round.status === 'QUALIFIED' ? 'Promoted' : 'Not promoted'}</span>)}</div>}
        <Link className={`${s.button} mt-5`} href="/profile">Go to my portal</Link></section> : null}
      {event.isTeamEvent ? !team ? <section className={s.card}><h2>Create your team</h2><p className={`${s.muted} mb-5`}>You’ll be the leader. Invite teammates after creating your draft.</p><form className={s.form} onSubmit={e => { e.preventDefault(); void mutate(() => participantRequest('/api/user/teams', { eventId: event.id, name: teamName, members: [] }), 'Team created. Invite your teammates below.'); }}>
        <label>Team name<input required maxLength={80} value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Give your squad a name"/></label><label>Team leader<input readOnly value={`${fullName(participant)} · ${participant.festId || participant.email}`}/></label><button disabled={busy || closed || registered || !isVerified || isProfileIncomplete} className={s.button}>{busy ? 'Creating…' : 'Create team'}</button>
        {!isVerified && <p className={`${s.fine} text-pink-300 mt-2`}>Please verify your email before creating a team.</p>}
      </form></section> : <>
        <section className={s.card}><div className={s.row}><div><p className={s.eyebrow}>{team.teamCode}</p><h2 className="mt-2">{team.name}</h2></div><span className={s.badge}>{team.isLeader ? 'Team leader' : 'Team member'}</span></div>
          <div className={s.progress} aria-label={`${team.members.length} of ${event.maxTeamSize || 4} slots filled`}>{Array.from({length: Math.min(event.maxTeamSize || 4, 20)}, (_,i) => <span key={i} className={i < team.members.length ? s.filled : ''}/>)}</div>
          <p className={s.muted}>{team.members.length} accepted · {team.stats.pendingCount} pending · {event.minTeamSize}–{event.maxTeamSize} members required</p>
          {team.members.map(member => <div className={s.entry} key={member.id}><div className={s.row}><div><h3>{fullName(member)}</h3><p className={s.fine}>{member.festId}</p></div><span className={`${s.badge} ${s.accepted}`}>{member.isLeader ? 'Leader' : 'Accepted'}</span>{team.isLeader && !member.isLeader && !team.stats.isRegistered && <button disabled={busy} className={s.secondary} onClick={() => mutate(() => participantRequest(`/api/user/teams/${team.id}/members`, { userId: member.id }, 'DELETE'), 'Member removed.')}>Remove</button>}</div></div>)}
          {team.invites.filter(invite => invite.status !== 'ACCEPTED').map(invite => <div className={s.entry} key={invite.id}><div className={s.row}><div><h3>{invite.user ? fullName(invite.user) : invite.email}</h3><p className={s.fine}>{invite.user?.festId}</p></div><span className={`${s.badge} ${invite.status === 'PENDING' ? s.pending : ''}`}>{invite.status}</span>{team.isLeader && invite.status === 'PENDING' && !team.stats.isRegistered && <button className={s.secondary} disabled={busy} onClick={() => mutate(() => participantRequest(`/api/user/teams/${team.id}/members`, { inviteId: invite.id }, 'DELETE'), 'Invitation cancelled.')}>Cancel invite</button>}</div></div>)}
          {team.isLeader && !team.stats.isRegistered && team.stats.isReadyForRegistration && <div className="mt-4 p-4 rounded-xl bg-[#faff52]/15 border border-[#faff52]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"><div><h4 className="font-bold text-[#faff52]">Team is ready!</h4><p className={s.fine}>Minimum team size reached. Finalize your registration below.</p></div><button disabled={busy} className={s.button} onClick={handleAction}>{busy ? (paymentRequired ? 'Processing payment…' : 'Registering…') : (paymentRequired ? `Pay ₹${event.price} & Register team` : 'Register team now')}</button></div>}
        </section>
        {team.isLeader && !team.stats.isRegistered && <section className={s.card}><h2>Invite a teammate</h2><p className={`${s.muted} mb-4`}>Ask for their TF ID from their profile. They’ll receive an invitation in their portal.</p><form className={s.form} onSubmit={e => { e.preventDefault(); void mutate(async () => { await participantRequest(`/api/user/teams/${team.id}/invites`, { identifier: identifier.trim().toUpperCase() }); setIdentifier(''); }, 'Invitation sent. Your teammate can accept or decline in their inbox.'); }}><label>Teammate’s TF ID<input required pattern="[Tt][Ff][0-9]{6}" placeholder="TF123456" value={identifier} onChange={e => setIdentifier(e.target.value.toUpperCase())}/></label><button className={s.button} disabled={busy || closed || team.members.length + team.stats.pendingCount >= (event.maxTeamSize || 4)}>Send invitation</button></form></section>}
      </> : <section className={s.card}><h2>Your participant details</h2><h3>{fullName(participant)}</h3><p className={s.muted}>{participant.email}</p><p className={s.id}>{participant.festId}</p><p className={s.muted}>{participant.collegeName || 'You can add your college in your profile.'}</p></section>}
    </div><aside className={s.card}><p className={s.eyebrow}>Registration summary</p><h2 className="mt-4">{event.name}</h2><div className={s.entry}><p className={s.muted}>Format</p><h3>{event.isTeamEvent ? `Team · ${event.minTeamSize}–${event.maxTeamSize} members` : 'Individual'}</h3></div><div className={s.entry}><p className={s.muted}>Registration closes</p><h3>{formatDate(event.registrationEndTime)} IST</h3></div><div className={s.entry}><p className={s.muted}>Entry fee</p><h3>{event.price ? `₹${event.price}${event.paymentTrigger === 'after_round' ? (feePaid ? ' · paid' : feeDueNow ? ' · due now' : notPromoted ? ' · not applicable' : ' · after qualification') : ''}` : 'Free registration'}</h3></div>
      {closed && <p className={s.error}>Registration is closed.</p>}
      
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
      ) : feeDueNow ? (
        /* Already registered, already promoted — the only thing left is the fee. */
        <>
          <button className={`${s.button} w-full`} disabled={busy || !canPayFee} onClick={handlePayFee}>
            {busy ? 'Processing payment…' : leadsTheTeam ? `Pay ₹${event.price} now` : 'Awaiting team leader'}
          </button>
          <p className={s.fine}>{leadsTheTeam ? `You were promoted to ${feeRoundName || 'the next round'}. Pay to confirm your place.` : 'Your team leader pays this fee on behalf of the whole team.'}</p>
        </>
      ) : (
        <button className={`${s.button} w-full`} disabled={busy || !canRegister} onClick={handleAction}>
          {busy
            ? paymentRequired ? 'Processing payment…' : 'Please wait…'
            : feePaid
            ? 'Fee paid'
            : registered
            ? 'Registered'
            : paymentRequired
            ? event?.isTeamEvent ? `Pay ₹${event?.price} & Register team` : `Pay ₹${event?.price} & Register`
            : event?.isTeamEvent ? 'Register team' : 'Confirm registration'}
        </button>
      )}
      <p className={s.fine}>Joining a team does not register it. The leader confirms registration once everyone is ready.</p>
    </aside></div>}
    {showProfileModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation" onClick={() => !busy && setShowProfileModal(false)}>
      <form className={`${s.card} ${s.form} w-full max-w-lg`} role="dialog" aria-modal="true" aria-label="Complete profile" onClick={e => e.stopPropagation()} onSubmit={e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        void mutate(async () => {
          await participantRequest('/api/user/profile', data, 'PATCH');
          window.dispatchEvent(new Event('tf-auth-change'));
        }, 'Profile updated. You can now register.').then(saved => { if (saved) setShowProfileModal(false); });
      }}>
        <h2>Complete your profile</h2>
        <p className={s.muted}>Add your college and phone number to register.</p>
        <div className={s.fields}><label>First name<input name="firstName" defaultValue={participant.firstName} required maxLength={80}/></label><label>Last name<input name="lastName" defaultValue={participant.lastName} maxLength={80}/></label></div>
        <label>College<input name="collegeName" defaultValue={participant.collegeName || ''} required maxLength={160}/></label>
        <label>Phone number<input name="phoneNumber" type="tel" defaultValue={participant.phoneNumber || ''} required maxLength={20}/></label>
        {error && <p className={s.error} role="alert">{error}</p>}
        <div className={s.row}><button type="button" className={s.secondary} disabled={busy} onClick={() => setShowProfileModal(false)}>Cancel</button><button className={s.button} disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button></div>
      </form>
    </div>}
  </main>;
}
