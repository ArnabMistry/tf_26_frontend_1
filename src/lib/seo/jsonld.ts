import { siteConfig } from "@/lib/site";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export interface EventJsonLdData {
  slug: string;
  name: string;
  description?: string;
  tagline?: string;
  club?: { name: string; slug?: string };
  clubs?: { name: string; slug?: string }[];
  startDate?: string;
  endDate?: string;
  venue?: string;
  mode?: "Online" | "Offline" | "Hybrid";
  image?: string;
  poster?: string;
  prizePool?: string;
  price?: number;
  rules?: string[];
  registrationUrl?: string;
  registrationOpens?: string;
  registrationDeadline?: string;
}

/**
 * Generate full Schema.org/Event structured data adhering to Google Rich Results requirements.
 * Includes eventStatus, eventAttendanceMode, location, offers, organizer, and superEvent.
 */
export function generateEventJsonLd(event: EventJsonLdData) {
  const eventUrl = `${siteConfig.url}/events/${event.slug}`;
  const posterSrc = event.image || event.poster || siteConfig.ogImage;
  const imageUrl = posterSrc.startsWith("http")
    ? posterSrc
    : `${siteConfig.url}${posterSrc.startsWith("/") ? "" : "/"}${posterSrc}`;

  const primaryClub = event.club || event.clubs?.[0] || { name: "TantraFiesta", slug: "tantrafiesta" };

  // Determine Attendance Mode
  let attendanceMode = "https://schema.org/OfflineEventAttendanceMode";
  if (event.mode === "Online") {
    attendanceMode = "https://schema.org/OnlineEventAttendanceMode";
  } else if (event.mode === "Hybrid") {
    attendanceMode = "https://schema.org/MixedEventAttendanceMode";
  }

  // Google requires a valid location (VirtualLocation for online, Place for offline)
  const location = event.mode === "Online"
    ? {
        "@type": "VirtualLocation",
        url: event.registrationUrl || eventUrl,
      }
    : {
        "@type": "Place",
        name: event.venue || "IIIT Nagpur Campus",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Survey No. 140, 141/1 behind Br. Sheshrao Wankhade Shetkari Sahkari Soot Girni, Village - Waranga, PO - Dongargaon (Butibori)",
          addressLocality: "Nagpur",
          addressRegion: "Maharashtra",
          postalCode: "441108",
          addressCountry: "IN",
        },
      };

  const startDate = event.startDate && !Number.isNaN(Date.parse(event.startDate))
    ? event.startDate
    : "2026-10-10T09:00:00+05:30";

  const endDate = event.endDate && !Number.isNaN(Date.parse(event.endDate))
    ? event.endDate
    : undefined;

  const nameSpaced = event.name.replace(/[-_]/g, " ");
  const alternateNames = [
    nameSpaced,
    `${event.name} 2026`,
    `${event.name} IIIT Nagpur`,
    `${event.name} TantraFiesta`,
    ...(event.tagline ? [`${event.name} — ${event.tagline}`] : []),
  ].filter((alt) => alt.toLowerCase() !== event.name.toLowerCase());

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    alternateName: alternateNames.length > 0 ? alternateNames : undefined,
    description: (event.description || `${event.name} at TantraFiesta 2026, IIIT Nagpur.`).replace(/\s+/g, " ").trim(),
    url: eventUrl,
    startDate,
    ...(endDate ? { endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: attendanceMode,
    location,
    image: [imageUrl],
    keywords: `${event.name}, ${primaryClub.name}, TantraFiesta 2026, IIIT Nagpur, technical competition`,
    organizer: event.clubs && event.clubs.length > 1
      ? event.clubs.map((c) => ({
          "@type": "Organization" as const,
          name: c.name,
          url: `${siteConfig.url}/clubs/${c.slug || "tantrafiesta"}`,
        }))
      : {
          "@type": "Organization" as const,
          name: primaryClub.name,
          url: `${siteConfig.url}/clubs/${primaryClub.slug || "tantrafiesta"}`,
        },
    performer: event.clubs && event.clubs.length > 1
      ? event.clubs.map((c) => ({
          "@type": "Organization" as const,
          name: c.name,
        }))
      : {
          "@type": "Organization" as const,
          name: primaryClub.name,
        },
    offers: {
      "@type": "Offer",
      url: event.registrationUrl
        ? (event.registrationUrl.startsWith("http") ? event.registrationUrl : `${siteConfig.url}${event.registrationUrl}`)
        : eventUrl,
      price: event.price !== undefined ? String(event.price) : "0",
      priceCurrency: "INR",
      priceValidUntil: event.registrationDeadline || "2026-10-26T23:59:59+05:30",
      availability: "https://schema.org/InStock",
      validFrom: event.registrationOpens || "2026-09-01T00:00:00+05:30",
    },
    superEvent: {
      "@type": "Event",
      "@id": `${siteConfig.url}/#festival`,
      name: `${siteConfig.fullName} | ${siteConfig.institute}`,
      url: siteConfig.url,
      startDate: "2026-10-10T09:00:00+05:30",
      endDate: "2026-10-26T20:00:00+05:30",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
      location: {
        "@type": "Place",
        name: `${siteConfig.institute} Campus`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Survey No. 140, 141/1 behind Br. Sheshrao Wankhade Shetkari Sahkari Soot Girni, Village - Waranga, PO - Dongargaon (Butibori)",
          addressLocality: "Nagpur",
          addressRegion: "Maharashtra",
          postalCode: "441108",
          addressCountry: "IN",
        },
      },
    },
  };
}

export function itemListJsonLd(
  items: { name: string; url: string; description?: string; image?: string }[],
  name?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: name || `${siteConfig.fullName} Events`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
      ...(item.description ? { description: item.description.replace(/\s+/g, " ").trim() } : {}),
      ...(item.image ? { image: item.image.startsWith("http") ? item.image : `${siteConfig.url}${item.image}` } : {}),
    })),
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteConfig.fullName}`,
    description: `Contact and travel guide to TantraFiesta 2026 at ${siteConfig.institute}.`,
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "EducationalOrganization",
      name: "Indian Institute of Information Technology, Nagpur",
      alternateName: "IIIT Nagpur",
      url: "https://iiitn.ac.in",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Survey No. 140, 141/1 behind Br. Sheshrao Wankhade Shetkari Sahkari Soot Girni, Village - Waranga, PO - Dongargaon (Butibori)",
        addressLocality: "Nagpur",
        addressRegion: "Maharashtra",
        postalCode: "441108",
        addressCountry: "IN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "Technical Secretary",
          name: "Amulya Yadav",
          telephone: "+91-86045-51326",
          email: "ts@iiitn.ac.in",
        },
        {
          "@type": "ContactPoint",
          contactType: "Hospitality Lead",
          name: "Keshav Shukla",
          telephone: "+91-9016188508",
          email: "tantrafiesta.hospitality@iiitn.ac.in",
        },
        {
          "@type": "ContactPoint",
          contactType: "Marketing Lead",
          name: "Abdul Malik",
          telephone: "+91-9989211620",
          email: "tantrafiesta.marketing@iiitn.ac.in",
        },
      ],
    },
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
