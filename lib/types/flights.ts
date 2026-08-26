// ─────────────────────────────────────────────────────────────────────────────
// Flight search TypeScript types
// ─────────────────────────────────────────────────────────────────────────────

export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

export type TripType = 'roundtrip' | 'oneway';

export interface FlightSearchParams {
  origin: string;       // IATA code e.g. "BKK"
  destination: string;  // IATA code e.g. "NRT"
  departDate: string;   // "YYYY-MM-DD" — day used for deep-link, month for API
  returnDate?: string;  // "YYYY-MM-DD" — optional for one-way
  adults: number;
  tripType: TripType;
  currency: string;     // "USD"
}

export interface FlightResult {
  id: string;
  airline: string;           // IATA airline code e.g. "TG"
  airlineName: string;       // "Thai Airways"
  price: number;
  currency: string;
  departureAt: string;       // ISO datetime string
  returnAt?: string;         // ISO datetime string
  duration: number;          // minutes
  returnDuration?: number;   // minutes
  transfers: number;         // number of stops outbound
  returnTransfers?: number;  // number of stops return
  origin: string;            // IATA
  destination: string;       // IATA
  bookingUrl: string;        // full Aviasales affiliate deep-link
}

export interface FlightSearchResponse {
  results: FlightResult[];
  searchParams: FlightSearchParams;
  currency: string;
  totalFound: number;
  isMockData?: boolean;      // true when API token not configured
}

// Travelpayouts raw API response types ────────────────────────────────────────

export interface TpCheapTicket {
  price: number;
  airline: string;
  flight_number: number;
  departure_at: string;
  return_at?: string;
  transfers: number;
  return_transfers?: number;
  duration: number;
  return_duration?: number;
  link: string;
}

export interface TpCheapResponse {
  success: boolean;
  data: Record<string, Record<string, TpCheapTicket>>;
  currency: string;
}
