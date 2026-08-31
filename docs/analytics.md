# Analytics Architecture

## Environment Variables
- NEXT_PUBLIC_GA_MEASUREMENT_ID: The GA4 measurement ID. If not set, tracking is gracefully disabled.

## Event Taxonomy
All custom events use a semantic taxonomy:
- page_view
- destination_view
- guide_view
- news_view
- event_view
- hotel_discovery_view
- affiliate_click
- etc.

## Affiliate Tracking Semantics
We track affiliate outbound clicks as intentionality signals, NOT as guaranteed revenue/conversions. The event name is affiliate_click. It contains safe properties:
- provider
- placement
- destination_slug (if applicable)

## Privacy Rules
- IP addresses are handled by GA4 anonymously (GA4 drops IPs by default).
- We never transmit personal identifiers (PII), email, passwords, user IDs, or API keys in event data.
- The cookie consent banner defaults to denied and waits for user interaction.

## Development Behavior
During local development, if NEXT_PUBLIC_GA_MEASUREMENT_ID is not configured, analytics functions become no-ops. They won't crash the application and won't pollute production metrics.
