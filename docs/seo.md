SEO uses https://www.tantrafiesta.in independently of the frontend's local origin.

Set BACKEND_API_URL (or NEXT_PUBLIC_API_URL) to the real public backend during
build and runtime. The API catalog is authoritative for event existence; local
eventDetails.ts supplies brochure copy and images. Without an API configuration,
the existing static catalog remains available. With an API configured, missing
events return 404 and failures propagate instead of silently publishing a partial
sitemap or resurrecting deleted records. Event pages and the sitemap revalidate
every 60 seconds. Database ID aliases for records with slugs return 404.

During initial inspection the public API exposed apparent development/test
records without publication flags. The final catalog contained 24 festival
events. Records cannot be reliably excluded based on their names; the frontend
honors isPublic:false and isPublished:false when supplied. Production's public
endpoint must expose only intended public events.

Organization and WebSite JSON-LD are present site-wide. Event and club details
include BreadcrumbList. Event JSON-LD requires an actual startDate supplied by
the backend; existing brochure registration timestamps are not event dates.
No attendance mode, event status, address or availability is guessed.

Verification against a running production build and its read-only backend:

    node scripts/verify-seo.mjs http://localhost:3100 http://localhost:8080

The script checks every sitemap page, unique titles and canonical URLs, social
metadata, parseable JSON-LD, image alt attributes, robots.txt, event 404s, API
catalog completeness across pagination, and rejection of duplicate ID aliases.

No production database records are changed by this implementation or script.

Final local verification: production build and changed-file ESLint passed.
The route script verified 43 unique canonical pages, including all 24 events
in the final live catalog. This verifies the configured local API and frontend;
the changes have not been deployed or tested against a production API.
