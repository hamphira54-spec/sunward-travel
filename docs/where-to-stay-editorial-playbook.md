# Where to Stay - Editorial Playbook

## Overview
This playbook provides guidance for writing "Where to Stay" accommodation guides on Sunward Travel. Quality and accuracy are prioritized over quantity and mass-generation.

## Core Rules
1. **Never fabricate prices or inventory**. Do not include prices, specific hotel availability, or deals unless strictly integrated with an authorized live affiliate provider.
2. **Focus on Geography and Vibe**. The purpose of these guides is to help travelers decide *which neighborhood* suits their travel style, not to list specific hotels (yet).
3. **Use the Structured Editor**. Do not use raw Headings and Bullet Points to construct Stay Areas. Always use the `stay_area` block in the Admin Content Editor.

## Writing a Stay Area
Each Stay Area (Neighborhood) must be comprehensively filled out using the Admin UI:
- **Name**: The universally recognized name of the area (e.g. "Seminyak" or "Shinjuku").
- **Slug**: URL-friendly ID (e.g. `seminyak`).
- **Summary**: A compelling 1-2 sentence overview of why someone would stay here.
- **Best For Title**: Typically left as "Best for", but can be customized (e.g. "Perfect for").
- **Best For**: A comma-separated list of traveler profiles or activities (e.g. "Families, surfing, luxury").
- **Accommodation Types**: A comma-separated list of typical lodging available (e.g. "5-star resorts, private villas").
- **Atmosphere**: 3-4 adjectives describing the vibe (e.g. "Bustling, trendy, upscale").
- **Transport & Access**: Key logistical details (e.g. "30 mins from airport, heavy traffic").
- **Trade-offs (Considerations)**: Important negatives to balance the review (e.g. "Beaches aren't swimmable, very noisy at night").

## Editorial Checklist
Before publishing, the Admin UI will grade the guide based on:
1. Destination assigned.
2. Overview heading present (with id `overview`).
3. At least 1 Stay Area block present.
4. Valid SEO Title and Description.

## Publication Workflow
Guides must follow the L9 RBAC workflow:
`DRAFT` -> `IN_REVIEW` -> `APPROVED` -> `SCHEDULED` or `PUBLISHED`.
Never bypass this flow. Drafts will not appear in the `/hotels` destination list until published.
