'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authRequest, ApiError } from '@/lib/auth';
import { getAuthToken, saveAuthTokens } from '@/lib/supabase';
import type { Person } from '@/lib/participant';

const Context = createContext<{ user: Person | null; loading: boolean }>({ user: null, loading: true });
export const useParticipant = () => useContext(Context);
export function ParticipantSession({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: Person | null; loading: boolean }>({ user: null, loading: true });
  useEffect(() => {
    let active = true, sequence = 0;
    const load = async () => {
      const request = ++sequence;
      const token = getAuthToken();
      if (!token) {
        setState({ user: null, loading: false });
        return;
      }
      setState(prev => ({ ...prev, loading: true }));
      try {
        const { data } = await authRequest('/api/auth/me', undefined, token);
        if (active && request === sequence && getAuthToken() === token) {
          setState({ user: data.user, loading: false });
        }
      } catch (err) {
        if (active && request === sequence) {
          if (err instanceof ApiError && err.status === 401) {
            saveAuthTokens({ accessToken: null, refreshToken: null });
            setState({ user: null, loading: false });
          } else {
            setState(prev => ({ user: prev.user, loading: false }));
          }
        }
      }
    };
    const storage = (event: StorageEvent) => { if (!event.key || event.key === 'tf_auth_token') void load(); };
    void load();
    window.addEventListener('tf-auth-change', load);
    window.addEventListener('storage', storage);
    return () => { active = false; window.removeEventListener('tf-auth-change', load); window.removeEventListener('storage', storage); };
  }, []);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
