import { record, rows, type Row } from '@/lib/admin';

const label = (key: string) => ({ id: 'ID', verified: 'Email verified', festId: 'Fest ID', userId: 'User ID', teamId: 'Team ID', eventId: 'Event ID', createdAt: 'Created on', updatedAt: 'Last updated', paidAt: 'Paid on', amount: 'Amount (INR)' }[key] || key.replace(/([a-z])([A-Z0-9])/g, '$1 $2').replaceAll('_', ' ').replace(/^./, c => c.toUpperCase()));
const omit = (data: Row, keys: string[]) => Object.fromEntries(Object.entries(data).filter(([key]) => !keys.includes(key)));

/** Render every supplied field, including event-specific metadata, without raw JSON. */
function Fields({ data }: { data: Row }) {
  return <dl className="registration-fields">{Object.entries(data).map(([key, value]) => {
    const nested = value !== null && typeof value === 'object';
    let display = value == null || value === '' ? 'Not provided' : String(value);
    if (typeof value === 'boolean') display = value ? 'Yes' : 'No';
    if (typeof value === 'string' && /At$/.test(key) && !Number.isNaN(Date.parse(value))) {
      display = new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    }
    return <div key={key} className={nested ? 'registration-field-wide' : ''}><dt>{label(key)}</dt><dd>{nested
      ? Array.isArray(value)
        ? value.length ? value.map((item, i) => <div className="registration-nested" key={i}>{typeof item === 'object' && item !== null ? <Fields data={record(item)} /> : String(item ?? 'Not provided')}</div>) : 'None'
        : Object.keys(record(value)).length ? <Fields data={record(value)} /> : 'None'
      : key === 'email' && value ? <a href={`mailto:${value}`}>{display}</a>
        : key === 'phoneNumber' && value ? <a href={`tel:${value}`}>{display}</a> : display}</dd></div>;
  })}</dl>;
}

function PersonCard({ user, title, membership }: { user: Row; title: string; membership?: Row }) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || String(user.email || 'Participant');
  return <article className="registration-person"><span className="admin-badge">{title}</span><h4>{name}</h4>
    <Fields data={user} />
    {membership && Object.keys(membership).length > 0 && <div className="registration-membership"><h5>Team membership</h5><Fields data={membership} /></div>}
  </article>;
}

export function RegistrationDetails({ value, close }: { value: unknown; close: () => void }) {
  const registration = record(value);
  const team = record(registration.team);
  const leader = record(team.leader);
  const user = record(registration.user);
  const members = rows(team.members);
  const leaderMembership = members.find(member => record(member.user).id === leader.id);
  const teammates = members.filter(member => record(member.user).id !== leader.id);
  const userInTeam = user.id && (user.id === leader.id || members.some(member => record(member.user).id === user.id));
  return <article className="admin-card registration-details">
    <header className="registration-detail-header"><div><p>Registration #{String(registration.id)}</p><h3>{String(team.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Registration details')}</h3><span className="admin-badge">{String(registration.status || 'Unknown')}</span></div><button onClick={close}>Close details</button></header>
    <section className="registration-section"><h4>Registration overview</h4><Fields data={omit(registration, ['user', 'team', 'event', 'metadata', 'payment'])} /></section>
    <section className="registration-section"><h4>Event</h4><Fields data={record(registration.event)} /></section>
    {registration.payment != null && <section className="registration-section"><h4>Payment details</h4><Fields data={record(registration.payment)} /></section>}
    {team.id != null && <section className="registration-section"><h4>Team details</h4><Fields data={{ ...omit(team, ['leader', 'members']), teamSize: teammates.length + (leader.id ? 1 : 0) }} /></section>}
    <section className="registration-section"><h4>{team.id != null ? 'Team roster' : 'Participant details'}</h4><div className="registration-roster">
      {leader.id != null && <PersonCard user={{ ...record(user.id === leader.id ? user : null), ...leader }} title="Team lead · Member 1" membership={leaderMembership ? omit(leaderMembership, ['user']) : undefined} />}
      {teammates.map((member, i) => <PersonCard key={String(record(member.user).id || i)} user={{ ...record(record(member.user).id === user.id ? user : null), ...record(member.user) }} title={`Member ${i + 2}`} membership={omit(member, ['user'])} />)}
      {user.id != null && !userInTeam && <PersonCard user={user} title={team.id != null ? 'Registered by' : 'Participant'} />}
    </div></section>
    <section className="registration-section"><h4>Additional registration details</h4>{Object.keys(record(registration.metadata)).length ? <Fields data={record(registration.metadata)} /> : <p className="registration-empty">No additional details provided.</p>}</section>
  </article>;
}
