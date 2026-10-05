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
  currentPath,
  registrationHref = "/register",
}: NavbarProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="relative z-30 mx-auto flex w-full items-center justify-between gap-4 px-6 py-4 text-white lg:px-12"
    >
      {/* ── Logo ── */}
      <Link
        href="/"
        aria-label="TantraFiesta home"
        className="flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#ffe43b]"
      >
        <Image
          src="/assets/tf_logo.png"
          alt=""
          width={48}
          height={48}
          className="h-10 w-10 object-contain"
        />
        <Image
          src="/assets/tf_nav.png"
          alt="TantraFiesta"
          width={320}
          height={40}
          className="hidden h-6 w-auto object-contain sm:block md:h-7"
        />
      </Link>

      {/* ── Desktop links ── */}
      <div className="hidden items-center gap-6 text-sm font-bold uppercase tracking-wider text-white md:flex">
        {navigation.map(({ href, label }) => {
          const isActive = currentPath === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-sm transition-colors hover:text-[#FFFF1A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b] ${
                isActive ? "text-[#FFFF1A]" : ""
              }`}
            >
              {label}
            </Link>
          );
        })}
        <Link
          href={registrationHref}
          className="whitespace-nowrap bg-[#E7137D] px-5 py-2 text-white transition-colors hover:bg-[#c60f69] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b]"
        >
          Register Now
        </Link>
      </div>

      {/* ── Mobile hamburger ── */}
      <details className="group relative md:hidden">
        <summary
          aria-label="Toggle navigation menu"
          className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border-2 border-[#ff2485]/60 bg-[#ff2485]/15 text-white transition-all duration-200 hover:border-[#ff2485] hover:bg-[#ff2485]/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffe43b] [&::-webkit-details-marker]:hidden"
        >
          {/* Hamburger icon — transforms to × when open */}
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {/* top bar */}
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              className="origin-center transition-transform duration-300 group-open:translate-y-[6px] group-open:rotate-45"
            />
            {/* middle bar — fades out when open */}
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              className="transition-opacity duration-200 group-open:opacity-0"
            />
            {/* bottom bar */}
            <line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
              className="origin-center transition-transform duration-300 group-open:-translate-y-[6px] group-open:-rotate-45"
            />
          </svg>
        </summary>

        {/* Dropdown — anchored to the right side, never clips viewport */}
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 flex min-w-[220px] flex-col gap-1 rounded-2xl border border-white/20 bg-[#1a1250] p-3 shadow-2xl shadow-black/60 backdrop-blur-sm">
          {navigation.map(({ href, label }) => {
            const isActive = currentPath === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-4 py-3 font-bold uppercase tracking-wide transition-colors hover:bg-white/10 hover:text-[#FFFF1A] focus-visible:outline-2 focus-visible:outline-[#ffe43b] ${
                  isActive ? "bg-white/10 text-[#FFFF1A]" : ""
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href={registrationHref}
            className="mt-2 rounded-lg bg-[#E7137D] px-4 py-3 text-center font-bold uppercase tracking-wide transition-colors hover:bg-[#c60f69] focus-visible:outline-2 focus-visible:outline-[#ffe43b]"
          >
            Register Now
          </Link>
        </div>
      </details>
    </nav>
  );
}
