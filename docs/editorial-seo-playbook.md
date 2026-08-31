# Editorial SEO Playbook

## Overview
This playbook guides editors in creating high-quality, high-converting content for Sunward Travel without resorting to spam tactics or thin content generation.

## 1. Content Opportunity Engine
Before writing, consult the **Editorial SEO Opportunities** dashboard at `/admin/seo-opportunities`.
* Look for Destinations with a **"Needs Guides"** status.
* Prioritize completing the **Where to Stay** guides for active destinations, as these carry the highest affiliate conversion potential.
* Avoid spinning up new destinations until the core pillar content (Where to Stay, Things to Do) is established for existing ones.

## 2. The "No Thin Content" Rule
Google's Helpful Content Update penalizes sites with hundreds of low-value, repetitive pages.
* **DO NOT** create `/hotels/bali/family`, `/hotels/bali/couples`, `/hotels/bali/solo`.
* **INSTEAD**, create one authoritative, comprehensive guide: `where-to-stay-in-bali` which covers neighborhoods best suited for families, couples, and solo travelers inside the same article using the StayArea blocks.

## 3. Freshness and Accuracy
* Articles must have an accurate `publishedAt` date.
* When updating an article for a new year or adding new hotel recommendations, update the `updatedAt` field. The SEO architecture will automatically output this to the `Article` structured data and the XML Sitemap.
* Never fabricate travel facts, sources, or event dates.

## 4. Connecting Content to Affiliates
Editorial content should natively connect to our affiliate architecture.
* Use `StayArea` blocks to provide highly specific hotel recommendations.
* If a destination has Klook activities enabled, ensure your "Things to Do" guides mention specific bookable experiences rather than vague advice.
