import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the TantraFiesta organizing team for partnerships, student inquiries, sponsorships, and event details.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Get in touch with the TantraFiesta organizing team for partnerships, student inquiries, sponsorships, and event details.",
    url: `${siteConfig.url}/contact`,
  },
  twitter: {
    title: `Contact | ${siteConfig.fullName} | ${siteConfig.institute}`,
    description:
      "Get in touch with the TantraFiesta organizing team for partnerships, student inquiries, sponsorships, and event details.",
  },
};

export default function ContactPage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Reach out to the TantraFiesta team at IIIT Nagpur for inquiries, collaborations, and registrations.
        </p>
      </header>

      <section id="contact-details" aria-labelledby="contact-heading" className="space-y-6">
        <h2 id="contact-heading" className="text-2xl font-semibold">
          Get in Touch
        </h2>
        <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
          <p>
            <strong className="text-zinc-900 dark:text-zinc-100">Official Email:</strong>{" "}
            <a href="mailto:contact@tantrafiesta.in" className="underline hover:text-foreground">
              contact@tantrafiesta.in
            </a>
          </p>
          <p>
            <strong className="text-zinc-900 dark:text-zinc-100">Venue & Campus:</strong>{" "}
            Indian Institute of Information Technology, Nagpur (IIITN), Survey No. 140,141/1 behind Br.
            Sheshrao Wankhade Shetkari Sahkari Soot Girni, Village - Waranga, PO - Dongargaon (Butibori),
            Tahsil - Nagpur (Rural) - 441108, Maharashtra, India.
          </p>
        </div>
      </section>
    </main>
  );
}
