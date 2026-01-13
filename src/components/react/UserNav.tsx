import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LogIn, LayoutDashboard } from 'lucide-react';

export default function UserNav() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="w-24 h-10 bg-slate-100 animate-pulse rounded-lg"></div>
    );
  }

  if (session) {
    return (
      <a
        href={`${baseUrl}/admin/dashboard`}
        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white
           bg-linear-to-r from-[#A9CE3C] to-[#8FAF33]
           hover:from-[#96B835] hover:to-[#7E9E2E]
           rounded-lg shadow-md shadow-[#A9CE3C]/40
           hover:shadow-lg transition-all duration-300"
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </a>
    );
  }

  return (
    <a
      href={`${baseUrl}/login`}
      className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white
         bg-linear-to-r from-[#A9CE3C] to-[#8FAF33]
         hover:from-[#96B835] hover:to-[#7E9E2E]
         rounded-lg shadow-md shadow-[#A9CE3C]/40
         hover:shadow-lg transition-all duration-300"
    >
      <LogIn className="w-4 h-4" />
      Login
    </a>
  );
}
