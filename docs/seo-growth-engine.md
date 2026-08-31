# SEO Growth Engine Architecture (Phase M5)

## Overview
The SEO Growth Engine is Sunward Travel’s deterministic architecture for achieving topical authority, maintaining safe crawling budgets, and linking editorial content to affiliate conversion surfaces structurally.

## Key Principles
1. **Deterministic Canonicalization**: Duplicate indexation ruins SEO. Every Next.js page explicitly defines its canonical URL to avoid query-parameter leakage (e.g. `?checkin=...` on hotel searches).
2. **Safe Crawling Budgets**: The `robots.ts` explicitly blocks the `/api`, `/admin`, `/preview`, and `/hotels/book` routes from crawlers to preserve crawl budget and protect affiliate parameters from malicious scanning.
3. **Draft Isolation**: Public components never use Prisma to query content directly. All public components consume content exclusively through `lib/content/repository.ts`. The repository acts as a strict boundary, guaranteeing that draft or in-review content is never accidentally rendered on public pages or sitemaps.

## Structured Data Strategy
Sunward Travel utilizes `application/ld+json` for explicit, deterministic signaling to Google.
* **BreadcrumbList**: Rendered on all destinations and guides to create a rigid, indexable hierarchy (e.g., Home > Destinations > Japan > Tokyo > Travel Guides > Tokyo First-Time Guide).
* **Article**: Rendered on guides, events, and news with explicit `datePublished` and `dateModified` tags.
* **TouristDestination**: Rendered on Destination Hubs.
* **PROHIBITED Schemas**: We strictly prohibit `Hotel`, `Offer`, or `AggregateRating` schemas because Sunward Travel is an affiliate, not a direct booking engine. Attempting to use product schemas on affiliate content violates Google's structured data guidelines.

## Destination Hub Architecture
The core of our growth engine is the Destination Hub (`app/destinations/[country]/[destination]/page.tsx`).
Rather than floating orphan guides, the Destination Hub uses strict repository queries to aggregate:
* Where to Stay Editorial Guides
* General Travel Guides
* Travel News
* Events and Festivals

This establishes the Destination Hub as the primary pillar page, transferring PageRank down to specific editorial articles, and receiving localized relevance from them in return.
