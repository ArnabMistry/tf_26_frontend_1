'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authRequest } from '@/lib/auth';
import type { Person } from '@/lib/participant';

const Context = createContext<{ user: Person | null; loading: boolean }>({ user: null, loading: true });
export const useParticipant = () => useContext(Context);
export function ParticipantSession({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: Person | null; loading: boolean }>({ user: null, loading: true });
  useEffect(() => {
    let active = true, sequence = 0;
    const load = async () => {
      const request = ++sequence;
      const token = localStorage.getItem('tf_auth_token');
      setState({ user: null, loading: !!token });
      if (!token) return;
      try {
        const { data } = await authRequest('/api/auth/me', undefined, token);
        if (active && request === sequence && localStorage.getItem('tf_auth_token') === token) setState({ user: data.user, loading: false });
      } catch { if (active && request === sequence) setState({ user: null, loading: false }); }
    };
    const storage = (event: StorageEvent) => { if (!event.key || event.key === 'tf_auth_token') void load(); };
    void load();
    window.addEventListener('tf-auth-change', load);
    window.addEventListener('storage', storage);
    return () => { active = false; window.removeEventListener('tf-auth-change', load); window.removeEventListener('storage', storage); };
  }, []);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
