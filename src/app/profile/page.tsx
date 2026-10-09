import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your registered events, qualification rounds, team, invitations, and meal passes for TantraFiesta 2026.",
  alternates: {
    canonical: "/profile",
  },
  openGraph: {
    title: `Profile | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description: "View your registered events, qualification rounds, team, invitations, and meal passes.",
    url: `${siteConfig.url}/profile`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      <Navbar currentPath="/profile" />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 pb-10 sm:pb-16">
        <h1
          className="font-tantra text-4xl min-[380px]:text-5xl sm:text-6xl uppercase tracking-widest text-white mb-6 sm:mb-8 drop-shadow-md"
        >
          Profile
        </h1>

        <Dashboard />
      </main>
    </div>
  );
}
