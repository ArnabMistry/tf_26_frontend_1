import type { Metadata } from "next";
import Link from "next/link";
import { TeamInvitationForm } from "@/components/auth/TeamInvitationForm";

export const metadata: Metadata = {
  title: "Team Registration",
  description: "Complete your team registration for TantraFiesta 2026.",
};

export default function TeamRegisterPage() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate overflow-x-hidden bg-[#241A4C]">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Bar with X and Submit */}
      <div className="flex justify-between items-center px-6 py-8 md:px-12 md:py-10 w-full z-10">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/register" className="text-white hover:text-pink-400 transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </Link>
          <h1 
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-widest text-white mt-1"
            style={{ fontFamily: "var(--font-futura)" }}
          >
            COMPLETE YOUR REGISTRATION
          </h1>
        </div>
        
        {/* Submit button at top right */}
        <button 
          className="bg-[#E7137D] text-white px-6 py-2 md:px-8 md:py-2.5 rounded-lg font-extrabold tracking-widest text-sm md:text-base uppercase transition-all active:translate-y-[2px]"
          style={{ 
            fontFamily: "var(--font-futura)", 
            transform: "skewX(-10deg)",
            boxShadow: "3px 4px 0 0 #A80D5A" 
          }}
        >
          <span className="block" style={{ transform: "skewX(10deg)" }}>SUBMIT</span>
        </button>
      </div>

      {/* Main Form Content */}
      <main className="flex-1 w-full max-w-4xl px-6 md:px-12 pt-4 md:pt-8 pb-12 z-10 ml-0 md:ml-12">
        <TeamInvitationForm />
      </main>
    </div>
  );
}
