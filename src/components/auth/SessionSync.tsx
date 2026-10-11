'use client';

import { useEffect } from 'react';
import { getSupabase, saveAuthToken } from '@/lib/supabase';

export function SessionSync() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange((event, session) => {
      // Preserve legacy password sessions when no Supabase browser session exists.
      if (event === 'SIGNED_OUT') saveAuthToken(null);
      else if (session) saveAuthToken(session.access_token);
    });
    return () => subscription.unsubscribe();
  }, []);
  return null;
}
