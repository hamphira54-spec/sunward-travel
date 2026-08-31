# Hotel Affiliate Approval Readiness

This document outlines the strategic decisions made during Phase M2 to ensure Sunward Travel is eligible for approval from major hotel affiliate programs (Booking.com, Agoda, Expedia, etc.) via the Travelpayouts network.

## The Problem
Initially, the platform attempted to present a "live hotel search" interface (`HotelSearchForm`) that mimicked the functionality of Online Travel Agencies (OTAs). However, this approach faced several challenges for affiliate approval:
1. **Low Baseline Traffic**: New sites without established traffic patterns are often rejected if they appear to be generic search tools.
2. **Lack of Original Content**: OTAs and affiliate networks require publishers to provide substantial, original travel-related content that adds value beyond just a search box. A page with just a search form and no proprietary insights fails this requirement.
3. **Misleading User Experience**: Simulating a live search without access to live inventory or pricing leads to user frustration when they are redirected to a third party to perform the search again.

## The Solution: Editorial Accommodation Discovery
To align with affiliate network guidelines and provide genuine value to travelers, we pivoted the hotel architecture from a faux-OTA model to an **editorial accommodation discovery** model.

### Key Changes Implemented
1. **The Discovery Gateway**: The `/hotels` page was redesigned from a search-centric interface to a content-rich "Where to Stay" gateway. It now features curated accommodation guides and travel planning advice.
2. **Discovery Search Form**: We replaced the complex date/guest picker with a simple, destination-focused `DiscoverySearchForm`. This form routes users to our original editorial content (e.g., `/guides/where-to-stay-in-bali`) rather than blindly redirecting them to a third-party search results page.
3. **Pilot "Where to Stay" Guides**: We seeded the database with high-quality, long-form editorial guides for key destinations (Bali, Tokyo, Singapore). These guides offer original insights into neighborhoods, accommodation types, and travel styles, fulfilling the "original content" requirement.
4. **Destination Integration**: Destination pages (e.g., `/destinations/indonesia/bali`) now intelligently surface the relevant "Where to Stay" guide, creating a cohesive internal linking structure that search engines and affiliate reviewers look for.

## Future Readiness
By focusing on high-quality, destination-specific advice, Sunward Travel now demonstrates clear editorial value. Once traffic stabilizes, we can apply for premium affiliate programs with a strong portfolio of original content that genuinely assists travelers in choosing their accommodations.
