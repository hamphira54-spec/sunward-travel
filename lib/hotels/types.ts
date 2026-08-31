/**
 * Sunward Travel Hotel Architecture
 * Phase M1: Domain Models and Types
 */

export type SearchMode = 'DISCOVERY' | 'LIVE_SEARCH';

export type AvailabilityStatus = 'UNKNOWN' | 'AVAILABLE' | 'UNAVAILABLE';

export type PriceBasis = 'PER_NIGHT' | 'TOTAL_STAY' | 'UNKNOWN';

export interface HotelPrice {
  amount: number;
  currency: string; // e.g., 'USD', 'EUR', 'GBP'
  basis: PriceBasis;
  taxesIncluded?: boolean;
}

export interface HotelSearchInput {
  destination: string;
  destinationId?: string; // Internal Sunward Travel destination ID
  checkIn?: Date;
  checkOut?: Date;
  adults: number;
  children?: number;
  rooms: number;
  currency?: string;
  locale?: string;
}

export interface HotelCoordinates {
  latitude: number;
  longitude: number;
}

export interface HotelResult {
  id: string; // internal mapping ID if available
  provider: string; // identifier of the provider, e.g., 'booking', 'agoda'
  providerPropertyId: string;
  name: string;
  destination: string;
  country: string;
  coordinates?: HotelCoordinates;
  address?: string;
  image?: string;
  propertyType?: string;
  starRating?: number;
  guestRating?: number;
  reviewCount?: number;
  price?: HotelPrice;
  availabilityStatus: AvailabilityStatus;
  bookingUrl?: string; // Safe, validated URL
  amenities?: string[];
  providerMetadata?: Record<string, unknown>; // Opaque, stripped of secrets before client delivery
}

export interface HotelSearchResponse {
  mode: SearchMode;
  provider: string | 'NONE';
  results: HotelResult[];
  searchedAt: Date;
  priceVerified: boolean;
  availabilityVerified: boolean;
}

export type HotelErrorCode =
  | 'INVALID_SEARCH'
  | 'PROVIDER_UNAVAILABLE'
  | 'PROVIDER_ERROR'
  | 'LIVE_SEARCH_UNSUPPORTED'
  | 'NO_RESULTS';

export class HotelError extends Error {
  constructor(public code: HotelErrorCode, message: string) {
    super(message);
    this.name = 'HotelError';
  }
}
