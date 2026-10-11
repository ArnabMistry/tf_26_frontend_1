'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParticipant } from '@/components/auth/ParticipantSession';
import { participantRequest, type Inbox } from '@/lib/participant';

export function PortalNav() {
  const { user, loading } = useParticipant();
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    let active = true;
    const update = async () => {
      if (!user || document.hidden) return;
      try { const inbox = await participantRequest<Inbox>('/api/user/notifications'); if (active) setUnread(inbox.unreadCount); }
      catch { if (active) setUnread(0); }
    };
    void update();
    const timer = window.setInterval(update, 30000);
    window.addEventListener('tf-inbox-change', update);
    document.addEventListener('visibilitychange', update);
    return () => { active = false; clearInterval(timer); window.removeEventListener('tf-inbox-change', update); document.removeEventListener('visibilitychange', update); };
  }, [user]);
  if (loading) return <div className="w-20" />;
  if (!user) return <Link href="/login" aria-label="Log in" className="shrink-0 rounded-full border border-pink-400/40 px-3 py-2 text-xs font-bold">Log in</Link>;
  return <div className="flex shrink-0 items-center gap-2">
    <Link href="/profile?tab=notifications" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} className="relative rounded-full border border-white/20 p-2.5 hover:bg-white/10">
      <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
      {unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-[#E7137D] px-1.5 text-[10px] font-bold">{unread > 99 ? '99+' : unread}</span>}
    </Link>
    <Link href="/profile" aria-label="My profile" title="My profile" className="grid h-10 w-10 place-items-center rounded-full bg-[#ffe43b] font-bold text-[#241A4C]">{user.firstName?.[0]?.toUpperCase() || <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/></svg>}</Link>
  </div>;
}
