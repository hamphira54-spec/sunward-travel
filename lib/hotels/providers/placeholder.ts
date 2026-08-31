import { HotelSearchInput, HotelResult, SearchMode } from '../types';
import { HotelProvider, ProviderCapabilities } from './types';

/**
 * A non-live placeholder provider used only for architectural testing in M1.
 * Never exposes fake results publicly.
 */
export class PlaceholderProvider implements HotelProvider {
  id = 'placeholder';
  name = 'Architecture Placeholder';
  
  capabilities: ProviderCapabilities = {
    supportsLiveSearch: false,
    supportsDiscovery: true,
    supportsDeepLinks: false,
    supportsPropertyDetails: false,
    supportsPrice: false,
    supportsAvailability: false,
  };

  async search(_input: HotelSearchInput, mode: SearchMode): Promise<HotelResult[]> {
    if (mode === 'LIVE_SEARCH') {
      // Intentionally rejecting LIVE_SEARCH as it unsupported
      throw new Error('Placeholder provider does not support LIVE_SEARCH.');
    }
    
    // Discovery mode returns an empty set so we don't leak fake data to production UI
    return [];
  }

  buildSearchUrl(_input: HotelSearchInput): string | null {
    return null;
  }

  buildPropertyUrl(_providerPropertyId: string, _input?: HotelSearchInput): string | null {
    return null;
  }
}
