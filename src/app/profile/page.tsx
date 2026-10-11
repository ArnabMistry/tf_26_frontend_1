import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";
import { UserPortal } from "@/components/portal/UserPortal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your TantraFiesta events, teams, invitations and participant profile.",
  alternates: {
    canonical: "/profile",
  },
  openGraph: {
    title: `Profile | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description: "View your events, teams, invitations and participant profile.",
    url: `${siteConfig.url}/profile`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <div className="relative min-h-[100svh] flex flex-col bg-[#241A4C] text-white isolate overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      <Navbar currentPath="/profile" />

      <Suspense fallback={<p className="p-8">Loading your portal…</p>}><UserPortal /></Suspense>
    </div>
  );
}
