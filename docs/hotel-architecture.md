# Sunward Travel Hotel Architecture (Phase M1)

This document outlines the provider-agnostic hotel architecture implemented in Phase M1.
It ensures Sunward Travel remains independent of any single external provider's data structures or limitations.

## Domain Model
All hotel discovery and live search interactions use the normalized `HotelResult` and `HotelSearchInput` models defined in `lib/hotels/types.ts`.
- **HotelSearchInput**: Defines required and optional parameters, enforcing `adults >= 1` and `rooms >= 1`.
- **HotelResult**: Normalizes provider payloads. All missing capabilities (e.g., pricing, coordinates) gracefully fallback to optional or undefined states.

## Search Modes
The architecture defines two operation modes:
- **DISCOVERY**: Executed without dates. Returns destination-wide accommodation data, without asserting live room availability or exact pricing.
- **LIVE_SEARCH**: Executed with dates and guest counts. Attempts to fetch real-time availability and prices via the registered provider.

## Provider Abstraction
The `HotelProvider` interface ensures that all external integrations (Booking.com, Agoda, Expedia) adhere to a single contract.
- A `ProviderRegistry` selects the appropriate provider.
- `ProviderCapabilities` dictates whether a provider supports specific features (e.g., `supportsLiveSearch`).
- If a provider lacks capabilities (e.g., pricing), the UI fallback explicitly hides those components rather than fabricating prices.

## Normalization Boundary
Data ingested from external hotel APIs is immediately routed through `normalizeHotelBase` (and provider-specific mappers).
- Provider-specific payloads are never leaked directly to UI components.
- Sensitive or excessive metadata is stripped out (e.g., API tokens).

## Server/Client Security Boundary
- Provider calls which require server credentials (e.g., secret API keys) are restricted to the backend service layer (`searchHotels`).
- Public React client components only receive the strictly typed `HotelSearchResponse`.
- Safe affiliate links are generated on the server and verified via `validateUrlSafety`.

## Price & Availability Semantics
- **Price**: Uses structured `HotelPrice` object (amount, currency, basis). String parsing is strictly avoided.
- **Availability**: Uses explicit enums (`AVAILABLE`, `UNAVAILABLE`, `UNKNOWN`). Missing availability data defaults to `UNKNOWN`.

## Future Adaptability
- **Booking.com Adapter (M2)**: Will implement `HotelProvider` interface without requiring UI changes.
- **Destination Integration**: Hotel domains are natively compatible with Sunward Travel's Prisma Country/Destination records.
- **Mobile Compatibility**: Fully serializable payloads enable a future mobile app to consume this exact architecture.

## Observability
An event foundation (`logHotelEvent`) in `lib/hotels/events/analytics.ts` defines typed events such as `hotel_search_started`, `hotel_search_failed`, and `hotel_provider_selected` which can be wired to commercial analytics engines in Phase M7.
