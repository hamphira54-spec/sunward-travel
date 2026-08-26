import type {
  FlightSearchParams,
  FlightSearchResponse,
  FlightResult,
  TpCheapResponse,
  TpCalendarResponse,
  TpCalendarTicket,
  TpLatestResponse,
  TpLatestTicket,
} from '@/lib/types/flights';
import { AIRLINE_NAMES, findAirport } from '@/lib/data/airports';

const API_BASE  = 'https://api.travelpayouts.com';
const TP_MARKER = '769903';
const TP_TRS    = '566794';

// ── Date helpers ──────────────────────────────────────────────────────────────

/** "2026-09-17T11:10:00+07:00" → "2026-09-17" */
function isoToDate(isoString: string): string {
  return isoString.slice(0, 10);
}

/** "2026-09-17" → "1709"  (DDMM for Aviasales deep-links) */
function toAviasalesDDMM(dateStr: string): string {
  const parts = dateStr.split('-'); // ["2026","09","17"]
  return parts[2] + parts[1];       // "17" + "09" = "1709"
}

// ── URL builder ───────────────────────────────────────────────────────────────

function buildBookingUrl(
  origin: string,
  destination: string,
  departDate: string,   // YYYY-MM-DD
  returnDate: string | undefined,
  adults: number,
): string {
  const dep = toAviasalesDDMM(departDate);
  let path  = `${origin}${dep}${destination}`;
  if (returnDate) path += toAviasalesDDMM(returnDate);
  path += `/${adults}`;
  return `https://www.aviasales.com/search/${path}?marker=${TP_MARKER}&trs=${TP_TRS}`;
}

// ── v1 /prices/calendar ───────────────────────────────────────────────────────
// Returns the cheapest flight for each departure day in the month.
// Up to 30 results WITH airline code, departure time, and duration.

async function fetchCalendar(
  params: FlightSearchParams,
  token: string,
): Promise<FlightResult[]> {
  const url = new URL(`${API_BASE}/v1/prices/calendar`);
  url.searchParams.set('origin',      params.origin);
  url.searchParams.set('destination', params.destination);
  url.searchParams.set('depart_date', params.departDate.slice(0, 7)); // YYYY-MM
  if (params.returnDate) {
    url.searchParams.set('return_date', params.returnDate.slice(0, 7));
  }
  url.searchParams.set('currency',       params.currency.toLowerCase());
  url.searchParams.set('calendar_type',  'departure_date');

  const res = await fetch(url.toString(), {
    headers: { 'X-Access-Token': token },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`calendar API ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as TpCalendarResponse;

  if (!json.success || !json.data || typeof json.data !== 'object') {
    throw new Error('calendar API returned unexpected shape');
  }

  const entries = Object.entries(json.data) as [string, TpCalendarTicket][];
  if (entries.length === 0) return [];

  return entries
    .map(([dateKey, t]: [string, TpCalendarTicket], idx: number): FlightResult => {
      const departDate = isoToDate(t.departure_at ?? dateKey);
      const returnDate = t.return_at ? isoToDate(t.return_at) : undefined;

      return {
        id:             `cal-${dateKey}-${t.airline}-${idx}`,
        airline:        t.airline,
        airlineName:    AIRLINE_NAMES[t.airline] ?? t.airline,
        price:          t.price,
        currency:       json.currency.toUpperCase(),
        departureAt:    t.departure_at ?? dateKey,
        returnAt:       t.return_at,
        duration:       t.duration ?? 0,
        transfers:      t.transfers,
        returnTransfers: 0,
        origin:         t.origin ?? params.origin,
        destination:    t.destination ?? params.destination,
        bookingUrl:     buildBookingUrl(
                          t.origin ?? params.origin,
                          t.destination ?? params.destination,
                          departDate,
                          returnDate,
                          params.adults,
                        ),
        hasExactTime:   t.departure_at ? true : false,
      };
    })
    .sort((a, b) => a.price - b.price);
}

// ── v1 /prices/cheap ──────────────────────────────────────────────────────────
// Fewer results (1 per stop count) but has airline + exact times + duration.

async function fetchV1Cheap(
  params: FlightSearchParams,
  token: string,
): Promise<FlightResult[]> {
  const url = new URL(`${API_BASE}/v1/prices/cheap`);
  url.searchParams.set('origin',      params.origin);
  url.searchParams.set('destination', params.destination);
  url.searchParams.set('depart_date', params.departDate.slice(0, 7));
  if (params.returnDate) url.searchParams.set('return_date', params.returnDate.slice(0, 7));
  url.searchParams.set('currency', params.currency.toLowerCase());

  const res = await fetch(url.toString(), {
    headers: { 'X-Access-Token': token },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`v1 cheap API ${res.status}: ${res.statusText}`);

  const json = (await res.json()) as TpCheapResponse;
  if (!json.success) throw new Error('v1 cheap returned success=false');

  const results: FlightResult[] = [];
  for (const [, tickets] of Object.entries(json.data)) {
    for (const [idx, t] of Object.entries(tickets)) {
      const departDate = t.departure_at ? isoToDate(t.departure_at) : params.departDate;
      const returnDate = t.return_at   ? isoToDate(t.return_at)    : params.returnDate;
      results.push({
        id:             `v1-${t.airline}-${idx}`,
        airline:        t.airline,
        airlineName:    AIRLINE_NAMES[t.airline] ?? t.airline,
        price:          t.price,
        currency:       json.currency.toUpperCase(),
        departureAt:    t.departure_at,
        returnAt:       t.return_at || undefined,
        duration:       t.duration,
        returnDuration: t.return_duration,
        transfers:      t.transfers,
        returnTransfers: t.return_transfers,
        origin:         params.origin,
        destination:    params.destination,
        bookingUrl:     buildBookingUrl(params.origin, params.destination, departDate, returnDate, params.adults),
        hasExactTime:   true,
      });
    }
  }
  return results.sort((a, b) => a.price - b.price);
}

// ── v2 /prices/latest ─────────────────────────────────────────────────────────
// Many results (up to 100) but NO airline or exact time — date only.
// Used only when calendar and cheap both return nothing.

async function fetchV2Latest(
  params: FlightSearchParams,
  token: string,
): Promise<FlightResult[]> {
  const url = new URL(`${API_BASE}/v2/prices/latest`);
  url.searchParams.set('currency',            params.currency.toLowerCase());
  url.searchParams.set('origin',              params.origin);
  url.searchParams.set('destination',         params.destination);
  url.searchParams.set('beginning_of_period', params.departDate.slice(0, 8) + '01');
  url.searchParams.set('period_type',         'month');
  url.searchParams.set('one_way',             params.tripType === 'oneway' ? 'true' : 'false');
  url.searchParams.set('page',                '1');
  url.searchParams.set('limit',               '100');
  url.searchParams.set('show_to_affiliates',  'true');
  url.searchParams.set('sorting',             'price');

  const res = await fetch(url.toString(), {
    headers: { 'X-Access-Token': token },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`v2 latest API ${res.status}: ${res.statusText}`);
  const json = (await res.json()) as TpLatestResponse;
  if (!json.success || !Array.isArray(json.data)) return [];

  return json.data
    .filter((t: TpLatestTicket) => t.actual)
    .map((t: TpLatestTicket, idx: number): FlightResult => ({
      id:           `v2-${t.origin}-${t.destination}-${t.depart_date}-${idx}`,
      airline:      '',
      airlineName:  'Various Airlines',
      price:        Math.round(t.value),
      currency:     json.currency.toUpperCase(),
      departureAt:  t.depart_date,
      returnAt:     t.return_date,
      duration:     0,
      transfers:    t.number_of_changes,
      origin:       t.origin,
      destination:  t.destination,
      bookingUrl:   buildBookingUrl(t.origin, t.destination, t.depart_date, t.return_date, params.adults),
      hasExactTime: false,
    }))
    .sort((a, b) => a.price - b.price);
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

  // ① Calendar — up to 30 results WITH airline, time & duration (best quality)
  try {
    const results = await fetchCalendar(params, token);
    if (results.length > 0) {
      console.info(`[Travelpayouts] Calendar returned ${results.length} results.`);
      return { results, searchParams: params, currency: params.currency.toUpperCase(), totalFound: results.length };
    }
    console.info('[Travelpayouts] Calendar returned 0 — trying v1 cheap…');
  } catch (err) {
    console.error('[Travelpayouts] Calendar failed:', err);
  }

  // ② v1 cheap — 3-5 results with airline, time & duration
  try {
    const results = await fetchV1Cheap(params, token);
    if (results.length > 0) {
      console.info(`[Travelpayouts] v1 cheap returned ${results.length} results.`);
      return { results, searchParams: params, currency: params.currency.toUpperCase(), totalFound: results.length };
    }
    console.info('[Travelpayouts] v1 cheap returned 0 — trying v2 latest…');
  } catch (err) {
    console.error('[Travelpayouts] v1 cheap failed:', err);
  }

  // ③ v2 latest — up to 100 results, dates only (no airline/time)
  try {
    const results = await fetchV2Latest(params, token);
    if (results.length > 0) {
      console.info(`[Travelpayouts] v2 latest returned ${results.length} results (date-only).`);
      return { results, searchParams: params, currency: params.currency.toUpperCase(), totalFound: results.length };
    }
  } catch (err) {
    console.error('[Travelpayouts] v2 latest failed:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    const mock   = await getMockResults(params);
    return { ...mock, apiError: errMsg };
  }

  // No results from any source
  return { results: [], searchParams: params, currency: params.currency.toUpperCase(), totalFound: 0 };
}

// ── Mock data (used only when no token is configured) ─────────────────────────

async function getMockResults(params: FlightSearchParams): Promise<FlightSearchResponse> {
  const mockResults: FlightResult[] = [
    { id:'mock-1', airline:'TG', airlineName:'Thai Airways',        price:342, currency:'USD', departureAt:`${params.departDate}T08:00:00`, returnAt:params.returnDate?`${params.returnDate}T18:30:00`:undefined, duration:480, returnDuration:510, transfers:0, returnTransfers:0, origin:params.origin, destination:params.destination, bookingUrl:`https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`, hasExactTime:true },
    { id:'mock-2', airline:'EK', airlineName:'Emirates',            price:489, currency:'USD', departureAt:`${params.departDate}T14:30:00`, returnAt:params.returnDate?`${params.returnDate}T22:00:00`:undefined, duration:720, returnDuration:695, transfers:1, returnTransfers:1, origin:params.origin, destination:params.destination, bookingUrl:`https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`, hasExactTime:true },
    { id:'mock-3', airline:'QR', airlineName:'Qatar Airways',       price:521, currency:'USD', departureAt:`${params.departDate}T23:55:00`, returnAt:params.returnDate?`${params.returnDate}T06:15:00`:undefined, duration:810, returnDuration:790, transfers:1, returnTransfers:1, origin:params.origin, destination:params.destination, bookingUrl:`https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`, hasExactTime:true },
    { id:'mock-4', airline:'SQ', airlineName:'Singapore Airlines',  price:675, currency:'USD', departureAt:`${params.departDate}T10:15:00`, returnAt:params.returnDate?`${params.returnDate}T09:00:00`:undefined, duration:540, returnDuration:560, transfers:0, returnTransfers:0, origin:params.origin, destination:params.destination, bookingUrl:`https://www.aviasales.com/search/${params.origin}${params.destination}/?marker=${TP_MARKER}&trs=${TP_TRS}`, hasExactTime:true },
  ];
  return { results:mockResults, searchParams:params, currency:'USD', totalFound:mockResults.length, isMockData:true };
}
