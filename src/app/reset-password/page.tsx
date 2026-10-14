import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your TantraFiesta 2026 account.",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: false },
  openGraph: {
    title: `Choose a new password | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description: "Set a new password for your TantraFiesta 2026 account.",
    url: `${siteConfig.url}/reset-password`,
  },
};

export default function Page() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.webp')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <Suspense fallback={<p className="text-white">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
