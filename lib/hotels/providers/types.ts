import { HotelSearchInput, HotelResult, SearchMode } from '../types';

export interface ProviderCapabilities {
  supportsLiveSearch: boolean;
  supportsDiscovery: boolean;
  supportsDeepLinks: boolean;
  supportsPropertyDetails: boolean;
  supportsPrice: boolean;
  supportsAvailability: boolean;
}

export interface HotelProvider {
  id: string; // e.g., 'booking'
  name: string; // e.g., 'Booking.com'
  capabilities: ProviderCapabilities;

  /**
   * Executes a search against the provider.
   */
  search(input: HotelSearchInput, mode: SearchMode): Promise<HotelResult[]>;

  /**
   * Constructs an affiliate deep link for a search query.
   */
  buildSearchUrl(input: HotelSearchInput): string | null;

  /**
   * Constructs an affiliate deep link for a specific property.
   */
  buildPropertyUrl(providerPropertyId: string, input?: HotelSearchInput): string | null;
}
