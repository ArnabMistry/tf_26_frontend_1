'use client';

import { useEffect } from 'react';
import { getSupabase, saveAuthToken } from '@/lib/supabase';

export function SessionSync() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
      // Sync fresh access token on active session or token refresh
      if (session?.access_token) {
        saveAuthToken(session.access_token, session.refresh_token);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return null;
}
