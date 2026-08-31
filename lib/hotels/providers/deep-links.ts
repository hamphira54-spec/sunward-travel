import { HotelSearchInput, HotelResult, SearchMode, HotelError } from '../types';
import { HotelProvider, ProviderCapabilities } from './types';

function createDeepLinkCapabilities(): ProviderCapabilities {
  return {
    supportsLiveSearch: false,
    supportsDiscovery: false,
    supportsDeepLinks: true,
    supportsPropertyDetails: false,
    supportsPrice: false,
    supportsAvailability: false,
  };
}

class BaseDeepLinkProvider implements HotelProvider {
  constructor(public id: string, public name: string) {}

  capabilities = createDeepLinkCapabilities();

  async search(_input: HotelSearchInput, mode: SearchMode): Promise<HotelResult[]> {
    throw new HotelError('LIVE_SEARCH_UNSUPPORTED', `${this.name} only supports deep linking in this phase.`);
  }

  buildSearchUrl(_input: HotelSearchInput): string | null {
    return null;
  }

  buildPropertyUrl(_providerPropertyId: string, _input?: HotelSearchInput): string | null {
    return null;
  }
}

export class LegacyHotellookProvider extends BaseDeepLinkProvider {
  constructor() {
    super('hotellook', 'Hotellook');
  }

  buildSearchUrl(input: HotelSearchInput): string | null {
    const { destination, checkIn, checkOut, adults, rooms } = input;
    const dest = encodeURIComponent(destination);
    const ci = checkIn ? checkIn.toISOString().slice(0, 10) : '';
    const co = checkOut ? checkOut.toISOString().slice(0, 10) : '';
    return `https://hotellook.com/?shmarker=769903&locale=en&destination=${dest}&checkIn=${ci}&checkOut=${co}&adults=${adults}&rooms=${rooms}`;
  }
}
