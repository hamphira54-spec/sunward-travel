# Accommodation Content Engine (Phase M4)

## Architecture
The Accommodation Content Engine extends the existing Sunward Travel editorial `Guide` platform to seamlessly support highly-structured accommodation planning articles ("Where to Stay" guides).

To avoid creating sparse database tables without real-time hotel pricing and availability, accommodation data is entirely editorial and unstructured. It is derived natively from the `Guide` architecture.

### Storage
- Accommodation guides are standard `Guide` rows in the database.
- They are identified strictly by the category `where-to-stay`.
- Neighborhoods and Stay Areas are stored as native JSON blocks within the `Guide.body` field using the new `StayAreaBlock` type (`type: 'stay_area'`).

### StayAreaBlock
Each `StayAreaBlock` is fully serializable and strictly validated. It contains editorial insight intended to help travelers make informed geographical decisions before passing them along to Affiliate Providers (Booking.com, Agoda, etc.).
- `name` and `id` (slug)
- `summary`
- `bestFor` and `accommodationTypes` (arrays)
- `atmosphere`, `transportNotes`
- `considerations` (trade-offs)

### Editorial Admin Features
The Admin UI now includes an **Accommodation Checklist** tailored for authors writing `where-to-stay` guides:
- Tracks completeness interactively as the author types (Destination assigned, Overview heading, at least 1 Stay Area, and SEO metadata).
- `StayAreaBlock`s are edited via a focused, structured form UI natively inside `ContentBlockEditor`, replacing the need to write raw headings and bullet points.

### Fallbacks
- The codebase falls back cleanly when rendering static content. `CONTENT_SOURCE=static` safely renders public-facing generic destination placeholders if DB guides are absent.
- The legacy unstructured `Heading` + `List` method of extracting Stay Areas is fully backward-compatible within `extractStayAreasFromGuide`.
