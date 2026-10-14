import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Enter the 6-digit code we emailed you to finish setting up your TantraFiesta 2026 account.",
  alternates: { canonical: "/verify-email" },
  robots: { index: false, follow: false },
  openGraph: {
    title: `Verify your email | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description: "Confirm your email address for TantraFiesta 2026.",
    url: `${siteConfig.url}/verify-email`,
  },
};

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.webp')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <Suspense fallback={<p className="text-white">Loading…</p>}>
          <VerifyEmailForm />
        </Suspense>
      </main>
    </div>
  );
}
