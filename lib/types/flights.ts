// ─── API Response Types ───────────────────────────────────────────────────────

export interface Airport {
  iata:    string;
  name:    string;
  city:    string;
  country: string;
}

export type TripType = 'roundtrip' | 'oneway';

export interface FlightSearchParams {
  origin:      string;
  destination: string;
  departDate:  string;          // YYYY-MM-DD
  returnDate?: string;          // YYYY-MM-DD
  adults:      number;
  tripType:    TripType;
  currency:    string;
}

export interface FlightResult {
  id:              string;
  airline:         string;
  airlineName:     string;
  price:           number;
  currency:        string;
  departureAt:     string;      // ISO datetime or YYYY-MM-DD
  returnAt?:       string;
  duration:        number;      // minutes (0 = unknown)
  returnDuration?: number;
  transfers:       number;
  returnTransfers?: number;
  origin:          string;
  destination:     string;
  bookingUrl:      string;
  hasExactTime?:   boolean;     // false when only date is known (v2 API)
}

export interface FlightSearchResponse {
  results:      FlightResult[];
  searchParams: FlightSearchParams;
  currency:     string;
  totalFound:   number;
  isMockData?:  boolean;
  apiError?:    string;         // set when real API returned an error
}

// ─── Travelpayouts v1 cheap tickets ──────────────────────────────────────────

export interface TpCheapTicket {
  price:         number;
  airline:       string;
  flight_number: number;
  departure_at:  string;
  return_at:     string;
  transfers:     number;
  return_transfers: number;
  duration:      number;
  return_duration: number;
  link:          string;
}

export interface TpCheapResponse {
  success: boolean;
  data:    Record<string, Record<string, TpCheapTicket>>;
  currency: string;
}

// ─── Travelpayouts v2 latest prices ──────────────────────────────────────────

export interface TpLatestTicket {
  show_to_affiliates: boolean;
  trip_class:         number;
  origin:             string;
  destination:        string;
  depart_date:        string;   // YYYY-MM-DD
  return_date?:       string;   // YYYY-MM-DD
  number_of_changes:  number;
  value:              number;
  found_at:           string;
  distance:           number;
  actual:             boolean;
}

export interface TpLatestResponse {
  success: boolean;
  data:    TpLatestTicket[];
  currency: string;
}
