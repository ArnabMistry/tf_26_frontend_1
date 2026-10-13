import type { Metadata } from "next";
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
    "hackathons",
    "robotics",
    "coding competitions",
    "workshops",
    "guest lectures",
  ],
  authors: [{ name: "TantraFiesta Team" }],
  creator: "IIIT Nagpur",
  publisher: "TantraFiesta",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.fullName,
    title: `${siteConfig.fullName} | ${siteConfig.institute}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.fullName} | ${siteConfig.institute}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
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
      parentOrganization: {
        "@type": "EducationalOrganization",
        name: "Indian Institute of Information Technology, Nagpur",
        alternateName: "IIIT Nagpur",
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
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
