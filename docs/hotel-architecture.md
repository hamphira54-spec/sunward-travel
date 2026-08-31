# Sunward Travel Hotel Architecture

This document outlines the provider-agnostic hotel architecture implemented in Phase M1 and expanded in Phase M2.
It ensures Sunward Travel remains independent of any single external provider's data structures or limitations.

## Phase M2: Editorial Accommodation Discovery (Current)
During M2, the platform transitioned to a highly editorial "Where to Stay" discovery flow.
- **DiscoverySearchForm**: A simple, destination-first search interface on `/hotels` that routes users to curated editorial content rather than live pricing results.
- **Guide Integration**: If a `where-to-stay-in-[destination]` guide exists for the user's destination, the user is navigated there. If not, they are directed to the general guides directory.
- **Affiliate Eligibility**: This architecture ensures Sunward Travel provides genuine editorial value, which is a prerequisite for approval by premium affiliate networks (Booking.com, Expedia) via Travelpayouts. 
- **Deep-linking Capability**: We preserve the M1 provider definitions (`supportsDeepLinks`) allowing us to route users to external partners cleanly without running live APIs.

## Domain Model (M1)
All hotel interactions use the normalized `HotelResult` and `HotelSearchInput` models defined in `lib/hotels/types.ts`.
- **HotelSearchInput**: Defines required and optional parameters, enforcing `adults >= 1` and `rooms >= 1`.
- **HotelResult**: Normalizes provider payloads. All missing capabilities (e.g., pricing, coordinates) gracefully fallback to optional or undefined states.

## Search Modes
The architecture defines two operation modes:
- **DISCOVERY**: Executed without dates. Returns destination-wide accommodation data, without asserting live room availability or exact pricing. (Prioritized in M2)
- **LIVE_SEARCH**: Executed with dates and guest counts. Attempts to fetch real-time availability and prices via the registered provider. (Disabled until API approval)

## Provider Abstraction
The `HotelProvider` interface ensures that all external integrations adhere to a single contract.
- A `ProviderRegistry` selects the appropriate provider.
- `ProviderCapabilities` dictates whether a provider supports specific features (e.g., `supportsDeepLinks`, `supportsLiveSearch`).
- If a provider lacks capabilities (e.g., pricing), the UI fallback explicitly hides those components rather than fabricating prices.

## Normalization Boundary
Data ingested from external hotel APIs is immediately routed through `normalizeHotelBase` (and provider-specific mappers).
- Provider-specific payloads are never leaked directly to UI components.
- Sensitive or excessive metadata is stripped out.

## Server/Client Security Boundary
- Provider calls which require server credentials are restricted to the backend service layer (`searchHotels`).
- Public React client components only receive strictly typed data.
- Safe affiliate links are generated on the server and verified via `validateUrlSafety`.

## Observability
An event foundation (`logHotelEvent`) in `lib/hotels/events/analytics.ts` defines typed events such as `hotel_search_started`, `hotel_search_failed`, and `hotel_provider_selected` which can be wired to commercial analytics engines in Phase M7.

### Phase M4 Updates
In Phase M4, the Accommodation Content Engine was introduced.
- Stay Areas are no longer parsed using fuzzy text matching against Headings and Lists.
- Stay Areas are formally integrated into the CMS using the StayAreaBlock type (type: 'stay_area').
- The Admin UI natively supports editing these blocks with a structured form, preventing malformed data.
- 2 new pilot guides (Bangkok and Seoul) were successfully created as draft accommodation guides on this new framework.
