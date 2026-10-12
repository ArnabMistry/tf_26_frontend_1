'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParticipant } from '@/components/auth/ParticipantSession';
import { ApiError } from '@/lib/auth';
import { getAuthToken, logout } from '@/lib/supabase';
import { participantRequest, fullName, formatDate, type Profile, type Inbox, type Notification, type MealPass, type Registration } from '@/lib/participant';
import { payForEvent } from '@/lib/payments';
import s from './Portal.module.css';

export function UserPortal() {
  const { user, loading } = useParticipant();
  const router = useRouter(), params = useSearchParams();
  const tab = params.get('tab') || 'overview';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [meals, setMeals] = useState<MealPass[] | null>(null);
  const [qrModal, setQrModal] = useState<{ title: string; image: string; token: string } | null>(null);
  const [profileDismissed, setProfileDismissed] = useState(false);
    const [page, setPage] = useState(1);
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    const token = getAuthToken();
    try {
      const [nextProfile, nextInbox, nextMeals] = await Promise.all([
        participantRequest<Profile>('/api/user/profile'),
        participantRequest<Inbox>(`/api/user/notifications?page=${page}`),
        participantRequest<{ meals: MealPass[] }>('/api/user/meals').catch(() => ({ meals: [] as MealPass[] })),
      ]);
      if (getAuthToken() !== token) return;
      setProfile(nextProfile);
      setInbox(nextInbox);
      setMeals(nextMeals.meals || []);
      setError('');
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

  /**
   * Settle a fee that fell due when an admin promoted this participant into a
   * round. Same create -> checkout -> verify sequence as the event page.
   */
  async function payFee(item: Registration) {
    if (!profile?.user) return;
    setBusy(`pay-${item.id}`); setError(''); setNotice('');
    try {
      const completed = await payForEvent({
        eventId: item.eventId,
        eventName: item.event.name,
        user: profile.user,
        teamId: item.teamId,
        onProgress: setNotice,
      });
      if (!completed) { setNotice(''); return; } // Checkout dismissed without paying.
      await load();
      setNotice(`Payment verified! Your place in ${item.event.name} is confirmed.`);
      window.dispatchEvent(new Event('tf-inbox-change'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be completed. Please try again.');
      setNotice('');
    } finally {
      setBusy('');
    }
  }

  /** Can this participant personally open the gateway? Teams pay via their leader. */
  const canPay = (item: Registration) => !!item.payment?.dueNow && (!item.teamId || item.team?.leaderId === profile?.user.id);

  function respond(item: Notification, action: 'accept' | 'reject') {
    if (action === 'accept' && profile?.user && (!profile.user.collegeName?.trim() || !profile.user.phoneNumber?.trim())) {
      setProfileDismissed(false);
      setError('Please complete your profile (college name and phone number) before accepting team invitations.');
      return;
    }
    // Optimistically update inbox immediately for instant UI feedback
    setInbox(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === item.id ? { ...n, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED', respondedAt: new Date().toISOString() } : n
        )
      };
    });
    return mutate(`invite-${item.id}`, async () => {
      await participantRequest(`/api/invites/${item.inviteId}/respond`, { action });
      await participantRequest(`/api/user/notifications/${item.id}/read`, {}, 'PATCH');
    }, action === 'accept' ? 'Invitation accepted. Your team is now visible below.' : 'Invitation declined.');
  }

    // Auto-refresh meal status when QR modal is active to immediately mark as stale/redeemed
  useEffect(() => {
    if (!qrModal) return;
    const poll = async () => {
      try {
        const res = await participantRequest<{ meals: MealPass[] }>('/api/user/meals');
        if (res.meals) {
          setMeals(res.meals);
          const current = res.meals.find(m => m.personalPassToken === qrModal.token);
          if (current && current.status === 'CLAIMED') {
            setNotice('Meal pass redeemed at counter! Enjoy your meal.');
            setQrModal(null);
          }
        }
      } catch (_) {}
    };
    const interval = setInterval(poll, 2500);
    return () => clearInterval(interval);
  }, [qrModal]);

  async function showPassQr(pass: MealPass) {
    setError('');
    try {
      const QRCode = await import('qrcode');
      const image = await QRCode.toDataURL(pass.personalPassToken, { width: 300, margin: 2 });
      setQrModal({
        title: `${pass.typeOfMeal.toUpperCase()} PASS`,
        image,
        token: pass.personalPassToken,
      });
    } catch {
      setError('Failed to generate pass QR code.');
    }
  }

  if (loading || !user) return <main className={s.shell}><p role="status">Loading your account...</p></main>;

  const availableMealsCount = meals?.filter(m => m.status === 'AVAILABLE').length || 0;
  // Events this participant was promoted into whose entry fee is still unpaid.
  const feesDue = (profile?.registeredEvents || []).filter(item => item.payment?.dueNow);

  return <main className={s.shell}>
    <p className={s.eyebrow}>TantraFiesta 2026 • Participant portal</p>
    {feesDue.map(item => (
      <div key={`due-${item.id}`} className="mb-6 p-4 rounded-2xl bg-[#faff52]/10 border border-[#faff52]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-[#faff52]">You’ve been promoted in {item.event.name}</h3>
          <p className={`${s.fine} mt-0.5`}>
            {canPay(item)
              ? `Pay the ₹${item.event.price} entry fee to confirm your place in ${item.payment?.roundName || 'the next round'}.`
              : `An entry fee of ₹${item.event.price} is due. Your team leader pays it for the whole team.`}
          </p>
        </div>
        {canPay(item)
          ? <button className={s.button} disabled={!!busy} onClick={() => payFee(item)}>{busy === `pay-${item.id}` ? 'Processing payment…' : `Pay ₹${item.event.price}`}</button>
          : <Link className={s.secondary} href={`/register/${item.event.isTeamEvent ? 'team' : 'event'}?eventId=${encodeURIComponent(item.eventId)}`}>Open event</Link>}
      </div>
    ))}
    {profile?.user && (!profile.user.collegeName?.trim() || !profile.user.phoneNumber?.trim()) && profileDismissed && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFFF1A]/10 border border-[#FFFF1A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-[#FFFF1A]">Your profile is incomplete</h3>
              <p className={`${s.fine} mt-0.5`}>Add your college name and phone number to unlock event registration and festival passes.</p>
            </div>
            <button className={s.button} onClick={() => setProfileDismissed(false)}>Complete profile</button>
          </div>
        )}
      <header className={s.hero}>
      <div>
        <h1>Your fest. Your space.</h1>
        <p className={s.muted}>Welcome back, {profile?.user.firstName || user.firstName}. Build your team and make your next move.</p>
      </div>
      <Link href="/events" className={s.button}>Explore events →</Link>
    </header>

    {error && <div role="alert" className={s.error}>{error} <button onClick={load} className={s.secondary}>Retry</button></div>}
    {notice && <p role="status" className={s.notice}>{notice}</p>}

    {!profile ? <p role="status">Loading your events and teams...</p> : <>
      <div className={s.stats}>
        {[[profile.stats.totalRegisteredEvents, 'Registered events'], [profile.stats.totalTeams, 'Your teams'], [inbox?.unreadCount || 0, 'Unread notifications']].map(([value, label]) => (
          <div className={s.stat} key={label}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </div>

      <div className={s.tabs} aria-label="Portal sections">
        {[
          ['overview', 'Overview'],
          ['notifications', `Notifications${inbox?.unreadCount ? ` (${inbox.unreadCount})` : ''}`],
          ['meals', `Meal Passes${availableMealsCount ? ` (${availableMealsCount})` : ''}`],
          ['settings', 'Edit profile']
        ].map(([key, label]) => (
          <Link
            key={key}
            href={`/profile?tab=${key}`}
            className={`${s.secondary} ${tab === key ? s.activeTab : ''}`}
            aria-current={tab === key ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className={s.grid}>
        <div className={s.stack}>
          {tab === 'notifications' ? (
            <section className={s.card} id="notifications">
              <div className={s.row}><h2>Your inbox</h2><span className={s.badge}>Live Sync</span></div>
              {!inbox?.notifications.length && <p className={s.empty}>All caught up. Team invitations and responses will appear here.</p>}
              {inbox?.notifications.map(item => (
                <article className={s.entry} key={item.id}>
                  <div className={s.row}>
                    <span className={`${s.badge} ${item.status === 'PENDING' ? s.pending : item.status === 'ACCEPTED' ? s.accepted : ''}`}>
                      {/* A promotion is news, not an invitation — label it by what it asks of you. */}
                      {item.kind === 'ROUND_PROMOTION' ? (item.status === 'PENDING' ? 'PAYMENT DUE' : 'PROMOTED') : item.status}
                    </span>
                    {!item.readAt && <span className={s.eyebrow}>New</span>}
                  </div>
                  <h3 className="mt-3">{item.kind === 'TEAM_INVITE' ? `${item.senderName} invited you to ${item.teamName}` : item.kind === 'ROUND_PROMOTION' ? `You’ve been promoted in ${item.eventName}` : `${item.senderName} ${item.status.toLowerCase()} your invitation`}</h3>
                  <p className={s.muted}>{item.kind === 'ROUND_PROMOTION' ? item.message : item.eventName}</p>
                  <p className={s.fine}>Sent {formatDate(item.createdAt)} IST{item.respondedAt ? ` • Responded ${formatDate(item.respondedAt)} IST` : ''}</p>
                  <div className={`${s.row} mt-3`}>
                    {item.kind === 'TEAM_INVITE' && item.status === 'PENDING' && item.inviteId ? (
                      <div className="flex gap-2">
                        <button className={s.button} disabled={!!busy} onClick={() => respond(item, 'accept')}>{busy === `invite-${item.id}` ? 'Accepting…' : 'Accept invitation'}</button>
                        <button className={s.secondary} disabled={!!busy} onClick={() => respond(item, 'reject')}>Decline</button>
                      </div>
                    ) : item.kind === 'ROUND_PROMOTION' ? (
                      (() => {
                        const due = feesDue.find(reg => reg.eventId === item.eventId);
                        return due && canPay(due)
                          ? <button className={s.button} disabled={!!busy} onClick={() => payFee(due)}>{busy === `pay-${due.id}` ? 'Processing payment…' : `Pay ₹${due.event.price} now`}</button>
                          : <Link className={s.secondary} href={`/register/${item.teamId ? 'team' : 'event'}?eventId=${encodeURIComponent(item.eventId)}`}>Open event</Link>;
                      })()
                    ) : (
                      <Link className={s.secondary} href={`/register/team?eventId=${encodeURIComponent(item.eventId)}`}>View event team</Link>
                    )}
                    {!item.readAt && (
                      <button disabled={!!busy} className={s.secondary} onClick={() => mutate(`read-${item.id}`, () => participantRequest(`/api/user/notifications/${item.id}/read`, {}, 'PATCH'), 'Marked as read.')}>Mark read</button>
                    )}
                  </div>
                </article>
              ))}
              {!!inbox && inbox.totalPages > 1 && (
                <div className={s.row}>
                  <button className={s.secondary} disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                  <span>{page} / {inbox.totalPages}</span>
                  <button className={s.secondary} disabled={page >= inbox.totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
              )}
            </section>
          ) : tab === 'meals' ? (
            <section className={s.card} id="meals">
              <div className={s.row}>
                <div>
                  <h2>Your Meal Passes</h2>
                  <p className={s.muted}>Dining passes granted for your registered competitions & hackathons.</p>
                </div>
                <span className={s.badge}>{availableMealsCount} Available</span>
              </div>

              

              {!meals?.length ? (
                <p className={s.empty}>No meal passes assigned yet. Meal entitlements are automatically linked when you participate in multi-hour competitions or hackathons.</p>
              ) : (
                meals.map(pass => (
                  <article className={s.entry} key={pass.mealId}>
                    <div className={s.row}>
                      <div>
                        <span className={s.eyebrow}>{formatDate(pass.date)}</span>
                        <h3 className="mt-1 text-lg font-bold">{pass.typeOfMeal.toUpperCase()}</h3>
                      </div>
                      <span className={`${s.badge} ${pass.status === 'CLAIMED' ? s.accepted : pass.isServingNow ? s.pending : ''}`}>
                        {pass.status === 'CLAIMED' ? 'REDEEMED' : pass.isServingNow ? 'SERVING NOW' : 'AVAILABLE'}
                      </span>
                    </div>

                    <p className={`${s.muted} mt-2`}>
                      Eligible via: {pass.grantedByEvents?.map(e => e.name).join(', ') || 'Fest Registration'}
                    </p>

                    <div className={`${s.row} mt-3`}>
                      {pass.status === 'AVAILABLE' ? (
                        <button className={s.button} onClick={() => showPassQr(pass)}>
                          Show Pass QR Code
                        </button>
                      ) : (
                        <p className={s.fine}>
                          Redeemed {pass.scannedAt ? `at ${formatDate(pass.scannedAt)} IST` : 'at counter'}
                        </p>
                      )}
                      </div>
                  </article>
                ))
              )}
            </section>
          ) : tab === 'settings' ? (
            <section className={s.card}>
              <h2>Make it yours</h2>
              <p className={`${s.muted} mb-5`}>Keep your contact details ready for the event team.</p>
              <form key={profile.user.id} className={s.form} onSubmit={e => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); void mutate('profile', () => participantRequest('/api/user/profile', data, 'PATCH'), 'Profile updated.'); }}>
                <div className={s.fields}><label>First name<input name="firstName" defaultValue={profile.user.firstName} required maxLength={80}/></label><label>Last name<input name="lastName" defaultValue={profile.user.lastName} maxLength={80}/></label></div>
                <label>College<input name="collegeName" defaultValue={profile.user.collegeName || ''} maxLength={160}/></label><label>Phone number<input name="phoneNumber" type="tel" defaultValue={profile.user.phoneNumber || ''} maxLength={20}/></label>
                <label>Email<input value={profile.user.email} readOnly/></label><p className={s.fine}>Your email, TF ID cannot be changed.</p><button className={s.button} disabled={!!busy}>{busy === 'profile' ? 'Saving...' : 'Save profile'}</button>
              </form>
            </section>
          ) : (
            <>
              <section className={s.card}>
                <div className={s.row}><h2>Registered events</h2><span className={s.badge}>Your lineup</span></div>
                {!profile.registeredEvents.length && <p className={s.empty}>Your next challenge is waiting. Explore an event and register to see it here.</p>}
                {profile.registeredEvents.map(item => (
                  <article key={item.id} className={s.entry}>
                    <div className={s.row}><div><p className={s.eyebrow}>{item.event.club}</p><h3 className="mt-2">{item.event.name}</h3></div><span className={s.badge}>{item.status.replaceAll('_',' ')}</span></div>
                    <p className={s.muted}>{item.team?.name || 'Individual entry'} • {item.event.venue || 'Venue to be announced'}</p>
                    {/* Undecided rounds are hidden: every event has a Round 1
                        from creation, so "awaiting result" would be noise. */}
                    <div className="flex flex-wrap gap-2 mt-3">{item.roundProgress?.filter(round => round.status !== 'PENDING').map(round => <span key={round.roundId} className={`${s.badge} ${round.status === 'QUALIFIED' ? s.accepted : ''}`}>{round.name}: {round.status === 'QUALIFIED' ? 'Promoted' : 'Not promoted'}</span>)}</div>
                    {item.payment?.dueNow && <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`${s.badge} ${s.pending}`}>Entry fee ₹{item.event.price} due</span>
                      {canPay(item)
                        ? <button className={s.button} disabled={!!busy} onClick={() => payFee(item)}>{busy === `pay-${item.id}` ? 'Processing payment…' : `Pay ₹${item.event.price} now`}</button>
                        : <span className={s.fine}>Your team leader pays this fee.</span>}
                    </div>}
                    {item.payment?.paid && <p className={`${s.fine} mt-3`}>Entry fee of ₹{item.event.price} paid.</p>}
                    {item.payment?.rejected && <p className={`${s.fine} mt-3`}>Not selected for the paid round — no fee is due.</p>}
                    </article>
                ))}
              </section>
              <section className={s.card}>
                <h2>Your teams</h2>
                {!profile.teams.length && <p className={s.empty}>Create a team from an event page, or accept a teammate's invitation in your inbox.</p>}
                {profile.teams.map(team => (
                  <article className={s.entry} key={team.id}>
                    <div className={s.row}><div><h3>{team.name}</h3><p className={s.muted}>{team.event.name}</p></div><span className={s.badge}>{team.isLeader ? 'Team leader' : 'Member'}</span></div>
                    <p className={s.fine}>{team.members.map(fullName).join(' • ')}</p>
                    <Link className={`${s.secondary} mt-3`} href={`/register/team?eventId=${encodeURIComponent(team.eventId)}`}>Open team →</Link>
                  </article>
                ))}
              </section>
            </>
          )}
        </div>

        <aside className={s.stack}>
          <section className={`${s.card} ${s.identity}`}>
            <div className={s.row}>
              <div className={s.avatar}>{profile.user.firstName?.[0]}{profile.user.lastName?.[0]}</div>
              
            </div>
            <h2 className="mt-5">{fullName(profile.user)}</h2>
            <p className={s.muted}>{profile.user.collegeName || 'Add your college in Edit profile'}</p>
            <p className={`${s.eyebrow} mt-6`}>TF ID</p>
            <p className={s.id}>{profile.user.festId || 'Not assigned'}</p>
            <button disabled={!profile.user.festId} className={s.secondary} onClick={async () => { try { await navigator.clipboard.writeText(profile.user.festId || ''); setNotice('TF ID copied. Share it with your team leader.'); } catch { setError('Copy unavailable. Select your TF ID and copy it manually.'); } }}>Copy TF ID</button>
            </section>
          <section className={s.card}>
            <h2>Recent activity</h2>
            {!profile.activities.length && <p className={s.empty}>Your fest journey starts here.</p>}
            {profile.activities.slice(0,5).map(item => (
              <div key={item.id} className={s.entry}><h3>{item.title}</h3><p className={s.fine}>{formatDate(item.timestamp)} IST</p></div>
            ))}
          </section>
          <button className={s.secondary} onClick={async () => { await logout(); router.replace('/login'); }}>Log out</button>
        </aside>
      </div>

      {/* Complete Profile Modal for Google OAuth or missing info */}
      {profile?.user && (!profile.user.collegeName?.trim() || !profile.user.phoneNumber?.trim()) && !profileDismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className={`${s.card} max-w-md w-full relative border border-[#FFFF1A]/50`} onClick={e => e.stopPropagation()}>
            <span className={s.eyebrow}>Account Setup</span>
            <h2 className="mt-2 text-xl font-bold text-white">Complete Your Profile</h2>
            <p className={`${s.muted} text-xs mb-5`}>
              Welcome to TantraFiesta! Please provide your college name and WhatsApp/phone number to enable event registrations and festival passes.
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
              setBusy('profile-setup');
              setError('');
              try {
                await participantRequest('/api/user/profile', {
                  firstName: profile.user.firstName,
                  lastName: profile.user.lastName,
                  collegeName: college,
                  phoneNumber: phone,
                }, 'PATCH');
                window.dispatchEvent(new Event('tf-auth-change'));
                await load();
                setNotice('Profile updated! You can now register for events.');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to update profile.');
              } finally {
                setBusy('');
              }
            }}>
              <label>
                College / Institute Name
                <input name="collegeName" required defaultValue={profile.user.collegeName || ''} maxLength={160} placeholder="Enter college or institute" />
              </label>
              <label>
                Phone Number (WhatsApp)
                <input name="phoneNumber" type="tel" required defaultValue={profile.user.phoneNumber || ''} maxLength={20} placeholder="Enter 10-digit mobile number" pattern="^[+\d ()-]{7,20}$" />
              </label>
              {error && <p className={s.error} role="alert">{error}</p>}
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className={s.secondary} onClick={() => setProfileDismissed(true)}>Dismiss for now</button>
                <button type="submit" disabled={busy === 'profile-setup'} className={s.button}>
                  {busy === 'profile-setup' ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Personal QR Pass Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setQrModal(null)}>
          <div className={`${s.card} max-w-sm w-full text-center relative border border-[#faff52]/40`} onClick={e => e.stopPropagation()}>
            <span className={s.eyebrow}>Food Counter Pass</span>
            <h2 className="mt-2 text-xl font-bold text-white">{qrModal.title}</h2>
            <p className={`${s.muted} text-xs mb-4`}>Present this personal QR code to counter staff</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrModal.image} alt={qrModal.title} className="mx-auto rounded-2xl border-2 border-[#E7137D] p-3 bg-white shadow-2xl" width={260} height={260} />
            <div className="flex justify-center mt-5">
              <button className={s.button} onClick={() => setQrModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>}
  </main>;
}
