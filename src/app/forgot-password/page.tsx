import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your TantraFiesta 2026 account.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: false },
  openGraph: {
    title: `Reset your password | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description: "Request a password reset link for your TantraFiesta 2026 account.",
    url: `${siteConfig.url}/forgot-password`,
  },
};

export default function Page() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <Suspense fallback={<p className="text-white">Loading…</p>}>
          <ForgotPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
