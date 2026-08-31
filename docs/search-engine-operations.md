# Search Engine Operations

## Overview
Technical guidelines for operating the Sunward Travel SEO growth engine.

## 1. Sitemap Management
The sitemap is completely automated at `app/sitemap.ts`.
* It pulls static configuration (like Countries and Destinations) and merges it with dynamic repository queries for Guides, News, and Events.
* Because the sitemap uses the `getPublishedGuides()` repository methods, draft content is physically incapable of appearing in the sitemap.
* `lastmod` is automatically derived from the `updatedAt` database field (falling back to `publishedAt`).

## 2. Testing and Validation
Any new page component must include:
* **Canonical URL definition** inside `generateMetadata`.
* **BreadcrumbList JSON-LD** to prevent orphan page structures.

To test the SEO implementation:
1. Run a production build: `npm run build && npm start`.
2. Inspect the `<head>` of destination and guide pages.
3. Validate that `<meta name="robots">` correctly prevents indexing on `/hotels/book`.
4. Validate that `robots.txt` output blocks `/admin` and `/preview`.
5. Run the XML sitemap (`/sitemap.xml`) through a validator to ensure no duplicate URLs exist.

## 3. Travelpayouts Re-application Readiness
Sunward Travel is preparing for premium affiliate networks. To pass manual review:
* The site must demonstrate an active, high-quality editorial engine.
* We must avoid any appearance of being a "thin affiliate wrapper".
* Destination hubs must look like rich travel portals with varied content (Guides, News, Events), not just link farms.
