'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authRequest, ApiError } from '@/lib/auth';
import { AUTH_CHANGE_EVENT, clearSignedIn, hasSessionHint } from '@/lib/session';
import type { Person } from '@/lib/participant';

const Context = createContext<{ user: Person | null; loading: boolean }>({ user: null, loading: true });
export const useParticipant = () => useContext(Context);

export function ParticipantSession({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: Person | null; loading: boolean }>({ user: null, loading: true });

  useEffect(() => {
    let active = true, sequence = 0;

    const load = async () => {
      const request = ++sequence;
      // The session cookie is httpOnly, so the only local signal is the hint.
      // Skipping the request when it is absent keeps anonymous page loads from
      // firing a guaranteed 401 on every navigation.
      if (!hasSessionHint()) {
        setState({ user: null, loading: false });
        return;
      }
      setState(prev => ({ ...prev, loading: true }));
      try {
        const { data } = await authRequest('/api/auth/me');
        if (active && request === sequence) {
          setState({ user: data.user, loading: false });
        }
      } catch (err) {
        if (active && request === sequence) {
          if (err instanceof ApiError && err.status === 401) {
            clearSignedIn();
            setState({ user: null, loading: false });
          } else {
            // A network blip should not log the user out of the UI.
            setState(prev => ({ user: prev.user, loading: false }));
          }
        }
      }
    };

    const onStorage = (event: StorageEvent) => { if (!event.key || event.key === 'tf_signed_in') void load(); };
    void load();
    window.addEventListener(AUTH_CHANGE_EVENT, load);
    window.addEventListener('storage', onStorage);
    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGE_EVENT, load);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}
