import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/events", label: "Events" },
  { href: "/speakers", label: "Speakers" },
];

interface NavbarProps {
  variant?: "default" | "events";
  currentPath?: string;
  registrationHref?: string;
}

export function Navbar({
  variant = "default",
  currentPath,
  registrationHref = "/register",
}: NavbarProps) {
  const isEvents = variant === "events";

  return (
    <nav
      aria-label="Main navigation"
      className={`relative z-30 mx-auto flex w-full items-center justify-between gap-4 text-white ${
        isEvents
          ? "max-w-[1440px] px-5 py-6 sm:px-8 lg:px-12 lg:pt-10 lg:pb-8"
          : "px-6 py-4 lg:px-12"
      }`}
    >
      <Link href="/" aria-label="TantraFiesta home" className="flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#ffe43b]">
        <Image
          src="/assets/tf_logo.png"
          alt=""
          width={48}
          height={48}
          className={isEvents ? "h-9 w-9 object-contain sm:h-12 sm:w-12" : "h-10 w-10 object-contain"}
        />
        <Image
          src="/assets/tf_nav.png"
          alt="TantraFiesta"
          width={320}
          height={40}
          className={isEvents ? "h-auto w-[clamp(140px,48vw,190px)] sm:w-[260px] xl:w-[320px]" : "hidden h-6 w-auto object-contain sm:block md:h-7"}
        />
      </Link>

      <div className={`hidden items-center font-bold uppercase text-white ${isEvents ? "gap-7 text-base italic lg:flex xl:gap-9 xl:text-lg" : "gap-6 text-sm tracking-wider md:flex"}`}>
        {navigation.map(({ href, label }) => (
          <Link key={href} href={href} aria-current={currentPath === href ? "page" : undefined} className="rounded-sm transition-colors hover:text-[#FFFF1A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b]">
            {label}
          </Link>
        ))}
        <Link href={registrationHref} className={`${isEvents ? "rounded-sm px-3 py-1" : "px-5 py-2"} whitespace-nowrap bg-[#E7137D] text-white transition-colors hover:bg-[#c60f69] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b]`}>
          Register Now
        </Link>
      </div>

      <details className={`group ${isEvents ? "lg:hidden" : "md:hidden"}`}>
        <summary aria-label="Toggle navigation menu" className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/40 bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b] [&::-webkit-details-marker]:hidden">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </summary>
        <div className="absolute right-5 top-full flex min-w-56 flex-col gap-1 rounded-2xl border border-white/20 bg-[#211952] p-3 shadow-xl sm:right-8">
          {navigation.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={currentPath === href ? "page" : undefined} className="rounded-lg px-4 py-3 font-bold uppercase hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#ffe43b]">
              {label}
            </Link>
          ))}
          <Link href={registrationHref} className="mt-2 rounded-lg bg-[#E7137D] px-4 py-3 text-center font-bold uppercase focus-visible:outline-2 focus-visible:outline-[#ffe43b]">
            Register Now
          </Link>
        </div>
      </details>
    </nav>
  );
}
