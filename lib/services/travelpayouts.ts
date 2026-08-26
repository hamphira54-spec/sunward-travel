// ─────────────────────────────────────────────────────────────────────────────
// Travelpayouts API service layer
//
// Uses TRAVELPAYOUTS_API_TOKEN env var (server-side only — never exposed to browser).
// Falls back to mock data if the token is not configured, so the UI is always
// functional during development and preview deployments.
//
// API docs: https://support.travelpayouts.com/hc/en-us/categories/200587111
// ─────────────────────────────────────────────────────────────────────────────

import type {
  FlightSearchParams,
  FlightSearchResponse,
  FlightResult,
  TpCheapResponse,
} from '@/lib/types/flights';
import { AIRLINE_NAMES, findAirport } from '@/lib/data/airports';

const API_BASE   = 'https://api.travelpayouts.com';
const TP_MARKER  = '769903';
const TP_TRS     = '566794';

// ── Affiliate deep-link builder ───────────────────────────────────────────────

function buildBookingUrl(link: string): string {
  // link from API is like "/search/BKK0111NRT1011TG/?"
  // Build: https://www.aviasales.com/search/BKK0111NRT1011TG/?marker=769903&trs=566794
  const base = `https://www.aviasales.com${link}`;
  const sep  = link.includes('?') ? '&' : '?';
  return `${base}${sep}marker=${TP_MARKER}&trs=${TP_TRS}`;
}

// ── Response normaliser ───────────────────────────────────────────────────────

function normaliseResponse(
  data: TpCheapResponse,
  params: FlightSearchParams
): FlightResult[] {
  const results: FlightResult[] = [];

  for (const [destIata, tickets] of Object.entries(data.data)) {
    for (const [idx, ticket] of Object.entries(tickets)) {
      const airlineName =
        AIRLINE_NAMES[ticket.airline] ?? ticket.airline;

      results.push({
        id:               `${destIata}-${idx}-${ticket.airline}-${ticket.flight_number}`,
        airline:          ticket.airline,
        airlineName,
        price:            ticket.price,
        currency:         data.currency.toUpperCase(),
        departureAt:      ticket.departure_at,
        returnAt:         ticket.return_at,
        duration:         ticket.duration,
        returnDuration:   ticket.return_duration,
        transfers:        ticket.transfers,
        returnTransfers:  ticket.return_transfers,
        origin:           params.origin,
        destination:      destIata,
        bookingUrl:       buildBookingUrl(ticket.link),
      });
    }
  }

  // Sort cheapest first
  return results.sort((a, b) => a.price - b.price);
}

// ── Real API call ─────────────────────────────────────────────────────────────

async function fetchFromTravelpayouts(
  params: FlightSearchParams
): Promise<FlightSearchResponse> {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;

  if (!token) {
    console.warn(
      '[Travelpayouts] No API token configured — returning mock data.\n' +
      'Set TRAVELPAYOUTS_API_TOKEN in your .env.local file.'
    );
    return getMockResults(params);
  }

  // Convert "YYYY-MM-DD" → "YYYY-MM" for the Data API
  const departMonth = params.departDate.slice(0, 7);
  const returnMonth = params.returnDate ? params.returnDate.slice(0, 7) : undefined;

  const url = new URL(`${API_BASE}/v1/prices/cheap`);
  url.searchParams.set('origin',      params.origin);
  url.searchParams.set('destination', params.destination);
  url.searchParams.set('depart_date', departMonth);
  if (returnMonth) url.searchParams.set('return_date', returnMonth);
  url.searchParams.set('currency',    params.currency.toLowerCase());

  const res = await fetch(url.toString(), {
    headers: { 'X-Access-Token': token },
    next:    { revalidate: 3600 }, // cache 1 hour
  });

  if (!res.ok) {
    throw new Error(`Travelpayouts API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as TpCheapResponse;

  if (!json.success) {
    throw new Error('Travelpayouts API returned success=false');
  }

  const results = normaliseResponse(json, params);

  return {
    results,
    searchParams: params,
    currency:     json.currency.toUpperCase(),
    totalFound:   results.length,
  };
}

// ── Public search function ────────────────────────────────────────────────────

export async function searchFlights(
  params: FlightSearchParams
): Promise<FlightSearchResponse> {
  try {
    return await fetchFromTravelpayouts(params);
  } catch (err) {
    console.error('[Travelpayouts] Search failed:', err);
    // Fall back to mock data so the page doesn't crash
    return { ...(await getMockResults(params)), isMockData: true };
  }
}

// ── Mock data (used when no token is configured) ──────────────────────────────

async function getMockResults(
  params: FlightSearchParams
): Promise<FlightSearchResponse> {
  const destAirport = findAirport(params.destination);
  const destName    = destAirport?.city ?? params.destination;

  const mockResults: FlightResult[] = [
    {
      id:           'mock-1',
      airline:      'TG',
      airlineName:  'Thai Airways',
      price:        342,
      currency:     'USD',
      departureAt:  `${params.departDate}T08:00:00`,
      returnAt:     params.returnDate ? `${params.returnDate}T18:30:00` : undefined,
      duration:     480,
      returnDuration: 510,
      transfers:    0,
      returnTransfers: 0,
      origin:       params.origin,
      destination:  params.destination,
      bookingUrl:   `https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`,
    },
    {
      id:           'mock-2',
      airline:      'EK',
      airlineName:  'Emirates',
      price:        489,
      currency:     'USD',
      departureAt:  `${params.departDate}T14:30:00`,
      returnAt:     params.returnDate ? `${params.returnDate}T22:00:00` : undefined,
      duration:     720,
      returnDuration: 695,
      transfers:    1,
      returnTransfers: 1,
      origin:       params.origin,
      destination:  params.destination,
      bookingUrl:   `https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`,
    },
    {
      id:           'mock-3',
      airline:      'QR',
      airlineName:  'Qatar Airways',
      price:        521,
      currency:     'USD',
      departureAt:  `${params.departDate}T23:55:00`,
      returnAt:     params.returnDate ? `${params.returnDate}T06:15:00` : undefined,
      duration:     810,
      returnDuration: 790,
      transfers:    1,
      returnTransfers: 1,
      origin:       params.origin,
      destination:  params.destination,
      bookingUrl:   `https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`,
    },
    {
      id:           'mock-4',
      airline:      'SQ',
      airlineName:  'Singapore Airlines',
      price:        675,
      currency:     'USD',
      departureAt:  `${params.departDate}T10:15:00`,
      returnAt:     params.returnDate ? `${params.returnDate}T09:00:00` : undefined,
      duration:     540,
      returnDuration: 560,
      transfers:    0,
      returnTransfers: 0,
      origin:       params.origin,
      destination:  params.destination,
      bookingUrl:   `https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`,
    },
  ];

  return {
    results:      mockResults,
    searchParams: params,
    currency:     'USD',
    totalFound:   mockResults.length,
    isMockData:   true,
  };
}
