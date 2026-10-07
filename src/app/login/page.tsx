import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { LoginForm } from "@/components/auth/LoginForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your TantraFiesta 2026 account to access event passes, competitions, and technical workshops.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: `Login | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description: "Sign in to your TantraFiesta 2026 account.",
    url: `${siteConfig.url}/login`,
  },
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[100svh] flex flex-col text-white isolate overflow-x-hidden">
      {/* Fixed background layer covering viewport at exact 1:1 scale of Hero landing page */}
      <div
        className="fixed inset-0 -z-10 bg-[#241A4C] bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />

      {/* Global Navbar */}
      <Navbar currentPath="/login" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 sm:pt-4 md:pt-6 pb-6 sm:pb-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center lg:items-center">
          {/* Left Column: Title + Form */}
          <div className="lg:col-span-7 flex flex-col items-start w-full lg:-translate-y-4 xl:-translate-y-6">
            <h1
              className="text-3xl min-[380px]:text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-wider text-white mb-3 sm:mb-4 md:mb-5"
              style={{ fontFamily: "var(--font-futura)" }}
            >
              LOGIN
            </h1>

            <LoginForm />
          </div>

          {/* Right Column: Robot Mascot Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-end mt-4 lg:mt-0">
            <div className="relative w-[220px] min-[380px]:w-[260px] sm:w-[320px] md:w-[360px] lg:w-[375px] max-w-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]">
              <Image
                src="/assets/robot.png"
                alt="TantraFiesta Mascot Robot"
                width={375}
                height={563}
                priority
                className="w-full h-auto object-contain select-none pointer-events-none transition-transform duration-300 hover:scale-102"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
