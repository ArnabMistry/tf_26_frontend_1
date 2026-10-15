import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { PageOpeningAnimation } from "@/components/PageOpeningAnimation";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";
import "lenis/dist/lenis.css";
import { ParticipantSession } from "@/components/auth/ParticipantSession";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#241A4C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.fullName} | ${siteConfig.institute}`,
    template: `%s | ${siteConfig.fullName} | ${siteConfig.institute}`,
  },
  description: siteConfig.description,
  keywords: [
    "TantraFiesta",
    "TantraFiesta 2026",
    "IIIT Nagpur",
    "technical fest",
    "national tech fest",
    "hackathons",
    "robotics competitions",
    "coding competitions",
    "workshops",
    "guest lectures",
    "engineering fest central india",
  ],
  authors: [{ name: "TantraFiesta Team", url: siteConfig.url }],
  creator: "IIIT Nagpur",
  publisher: "TantraFiesta",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.fullName,
    title: `${siteConfig.fullName} | ${siteConfig.institute}`,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.fullName} - ${siteConfig.institute}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.fullName} | ${siteConfig.institute}`,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
    creator: "@tantrafiesta",
    site: "@tantrafiesta",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.fullName,
      url: siteConfig.url,
      logo: `${siteConfig.url}/assets/tf_logo.png`,
      sameAs: [
        siteConfig.socials.instagram,
        siteConfig.socials.linkedin,
        siteConfig.socials.twitter,
        siteConfig.socials.github,
      ],
      parentOrganization: {
        "@type": "EducationalOrganization",
        name: "Indian Institute of Information Technology, Nagpur",
        alternateName: "IIIT Nagpur",
        url: "https://iiitn.ac.in",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.fullName,
      url: siteConfig.url,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "en-IN",
    },
    {
      "@type": "Event",
      "@id": `${siteConfig.url}/#festival`,
      name: `${siteConfig.fullName} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      url: siteConfig.url,
      startDate: "2026-10-10T09:00:00+05:30",
      endDate: "2026-10-26T20:00:00+05:30",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Indian Institute of Information Technology, Nagpur",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Survey No. 140, 141/1 behind Br. Sheshrao Wankhade Shetkari Sahkari Soot Girni, Village - Waranga, PO - Dongargaon (Butibori)",
          addressLocality: "Nagpur",
          addressRegion: "Maharashtra",
          postalCode: "441108",
          addressCountry: "IN",
        },
      },
      organizer: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          href="/fonts/font_bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/font_regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll />
        <PageOpeningAnimation />
        <ParticipantSession>{children}</ParticipantSession>
      </body>
    </html>
  );
}
