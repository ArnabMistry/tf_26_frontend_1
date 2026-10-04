export const siteConfig = {
  name: "TantraFiesta",
  fullName: "TantraFiesta 2026",
  institute: "IIIT Nagpur",
  tagline: "Annual National Technical Festival",
  description:
    "TantraFiesta 2026 is the annual national technical festival of Indian Institute of Information Technology, Nagpur (IIITN), celebrating technology, innovation, robotics, coding, AI, and leadership.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tantrafiesta.in",
  ogImage: "/og-image.jpg",
  locale: "en_US",
  socials: {
    twitter: "https://twitter.com/tantrafiesta",
    instagram: "https://instagram.com/tantrafiesta",
    linkedin: "https://linkedin.com/company/tantrafiesta",
    github: "https://github.com/tantrafiesta",
  },
} as const;

export type SiteConfig = typeof siteConfig;
