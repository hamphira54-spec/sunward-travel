import type {
  FlightSearchParams,
  FlightSearchResponse,
  FlightResult,
  TpCheapResponse,
  TpLatestResponse,
  TpLatestTicket,
} from '@/lib/types/flights';
import { AIRLINE_NAMES, findAirport } from '@/lib/data/airports';

const API_BASE  = 'https://api.travelpayouts.com';
const TP_MARKER = '769903';
const TP_TRS    = '566794';

// ── Date helpers ──────────────────────────────────────────────────────────────

/** "2026-09-15" → "1509"  (DDMM for Aviasales deep-links) */
function toAviasalesDDMM(dateStr: string): string {
  const parts = dateStr.split('-'); // ["2026","09","15"]
  return parts[2] + parts[1];       // "15" + "09" = "1509"
}

/** "2026-09-15" → "2026-09"  (month for v1 API) */
function toYYYYMM(dateStr: string): string {
  return dateStr.slice(0, 7);
}

// ── URL builders ──────────────────────────────────────────────────────────────

/** Build Aviasales deep-link from specific dates */
function buildBookingUrlFromDates(
  origin: string,
  destination: string,
  departDate: string,
  returnDate: string | undefined,
  adults: number,
): string {
  const dep = toAviasalesDDMM(departDate);
  let path  = `${origin}${dep}${destination}`;
  if (returnDate) path += toAviasalesDDMM(returnDate);
  path += `/${adults}`;
  return `https://www.aviasales.com/search/${path}?marker=${TP_MARKER}&trs=${TP_TRS}`;
}

/** Build Aviasales deep-link from a raw API link string (v1) */
function buildBookingUrlFromLink(link: string): string {
  const base = `https://www.aviasales.com${link}`;
  const sep  = link.includes('?') ? '&' : '?';
  return `${base}${sep}marker=${TP_MARKER}&trs=${TP_TRS}`;
}

// ── v2 /prices/latest ─────────────────────────────────────────────────────────

async function fetchV2Latest(
  params: FlightSearchParams,
  token: string,
): Promise<FlightResult[]> {
  const url = new URL(`${API_BASE}/v2/prices/latest`);
  url.searchParams.set('currency',             params.currency.toLowerCase());
  url.searchParams.set('origin',               params.origin);
  url.searchParams.set('destination',          params.destination);
  url.searchParams.set('beginning_of_period',  params.departDate.slice(0, 8) + '01');
  url.searchParams.set('period_type',          'month');
  url.searchParams.set('one_way',              params.tripType === 'oneway' ? 'true' : 'false');
  url.searchParams.set('page',                 '1');
  url.searchParams.set('limit',                '100');
  url.searchParams.set('show_to_affiliates',   'true');
  url.searchParams.set('sorting',              'price');

  const res = await fetch(url.toString(), {
    headers: { 'X-Access-Token': token },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`v2 API ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as TpLatestResponse;

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error('v2 API returned success=false or unexpected shape');
  }

  return json.data
    .filter((t: TpLatestTicket) => t.actual)
    .map((t: TpLatestTicket, idx: number): FlightResult => ({
      id:            `v2-${t.origin}-${t.destination}-${t.depart_date}-${idx}`,
      airline:       '',
      airlineName:   'Multiple Airlines',
      price:         Math.round(t.value),
      currency:      json.currency.toUpperCase(),
      departureAt:   t.depart_date,
      returnAt:      t.return_date,
      duration:      0,
      transfers:     t.number_of_changes,
      returnTransfers: 0,
      origin:        t.origin,
      destination:   t.destination,
      bookingUrl:    buildBookingUrlFromDates(
                       t.origin, t.destination,
                       t.depart_date, t.return_date,
                       params.adults,
                     ),
      hasExactTime:  false,
    }))
    .sort((a, b) => a.price - b.price);
}

// ── v1 /prices/cheap ──────────────────────────────────────────────────────────

async function fetchV1Cheap(
  params: FlightSearchParams,
  token: string,
): Promise<FlightResult[]> {
  const url = new URL(`${API_BASE}/v1/prices/cheap`);
  url.searchParams.set('origin',      params.origin);
  url.searchParams.set('destination', params.destination);
  url.searchParams.set('depart_date', toYYYYMM(params.departDate));
  if (params.returnDate) {
    url.searchParams.set('return_date', toYYYYMM(params.returnDate));
  }
  url.searchParams.set('currency', params.currency.toLowerCase());

  const res = await fetch(url.toString(), {
    headers: { 'X-Access-Token': token },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`v1 API ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as TpCheapResponse;

  if (!json.success) {
    throw new Error('v1 API returned success=false');
  }

  const results: FlightResult[] = [];
  for (const [destIata, tickets] of Object.entries(json.data)) {
    for (const [idx, ticket] of Object.entries(tickets)) {
      results.push({
        id:             `v1-${destIata}-${idx}-${ticket.airline}`,
        airline:        ticket.airline,
        airlineName:    AIRLINE_NAMES[ticket.airline] ?? ticket.airline,
        price:          ticket.price,
        currency:       json.currency.toUpperCase(),
        departureAt:    ticket.departure_at,
        returnAt:       ticket.return_at || undefined,
        duration:       ticket.duration,
        returnDuration: ticket.return_duration,
        transfers:      ticket.transfers,
        returnTransfers:ticket.return_transfers,
        origin:         params.origin,
        destination:    destIata,
        bookingUrl:     buildBookingUrlFromLink(ticket.link),
        hasExactTime:   true,
      });
    }
  }
  return results.sort((a, b) => a.price - b.price);
}

// ── Main search function ──────────────────────────────────────────────────────

export async function searchFlights(
  params: FlightSearchParams,
): Promise<FlightSearchResponse> {
  const token = process.env.TRAVELPAYOUTS_API_TOKEN;

  if (!token) {
    console.warn('[Travelpayouts] TRAVELPAYOUTS_API_TOKEN not set — returning mock data.');
    const mock = await getMockResults(params);
    return { ...mock, apiError: 'no_token' };
  }

  // Try v2 first (more results, specific dates)
  try {
    const results = await fetchV2Latest(params, token);
    if (results.length > 0) {
      return { results, searchParams: params, currency: params.currency.toUpperCase(), totalFound: results.length };
    }
    // v2 returned 0 results — fall through to v1
    console.info('[Travelpayouts] v2 returned 0 results, trying v1…');
  } catch (err) {
    console.error('[Travelpayouts] v2 failed:', err);
  }

  // Fallback: v1/prices/cheap
  try {
    const results = await fetchV1Cheap(params, token);
    return { results, searchParams: params, currency: params.currency.toUpperCase(), totalFound: results.length };
  } catch (err) {
    console.error('[Travelpayouts] v1 also failed:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    const mock   = await getMockResults(params);
    return { ...mock, apiError: errMsg };
  }
}

// ── Mock data fallback ────────────────────────────────────────────────────────

async function getMockResults(params: FlightSearchParams): Promise<FlightSearchResponse> {
  const mockResults: FlightResult[] = [
    { id:'mock-1', airline:'TG', airlineName:'Thai Airways',        price:342, currency:'USD', departureAt:`${params.departDate}T08:00:00`, returnAt:params.returnDate?`${params.returnDate}T18:30:00`:undefined, duration:480, returnDuration:510, transfers:0, returnTransfers:0, origin:params.origin, destination:params.destination, bookingUrl:`https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`, hasExactTime:true },
    { id:'mock-2', airline:'EK', airlineName:'Emirates',            price:489, currency:'USD', departureAt:`${params.departDate}T14:30:00`, returnAt:params.returnDate?`${params.returnDate}T22:00:00`:undefined, duration:720, returnDuration:695, transfers:1, returnTransfers:1, origin:params.origin, destination:params.destination, bookingUrl:`https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`, hasExactTime:true },
    { id:'mock-3', airline:'QR', airlineName:'Qatar Airways',       price:521, currency:'USD', departureAt:`${params.departDate}T23:55:00`, returnAt:params.returnDate?`${params.returnDate}T06:15:00`:undefined, duration:810, returnDuration:790, transfers:1, returnTransfers:1, origin:params.origin, destination:params.destination, bookingUrl:`https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`, hasExactTime:true },
    { id:'mock-4', airline:'SQ', airlineName:'Singapore Airlines',  price:675, currency:'USD', departureAt:`${params.departDate}T10:15:00`, returnAt:params.returnDate?`${params.returnDate}T09:00:00`:undefined, duration:540, returnDuration:560, transfers:0, returnTransfers:0, origin:params.origin, destination:params.destination, bookingUrl:`https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`, hasExactTime:true },
  ];
  return { results:mockResults, searchParams:params, currency:'USD', totalFound:mockResults.length, isMockData:true };
}
