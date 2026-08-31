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
    return `https://hotellook.com/?marker=769903&locale=en&destination=${dest}&checkIn=${ci}&checkOut=${co}&adults=${adults}&rooms=${rooms}`;
  }
}

export class LegacyBookingComProvider extends BaseDeepLinkProvider {
  constructor() {
    super('booking', 'Booking.com');
  }

  buildSearchUrl(input: HotelSearchInput): string | null {
    const { destination, checkIn, checkOut, adults, rooms } = input;
    const dest = encodeURIComponent(destination);
    const ci = checkIn ? checkIn.toISOString().slice(0, 10) : '';
    const co = checkOut ? checkOut.toISOString().slice(0, 10) : '';
    return `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${ci}&checkout=${co}&group_adults=${adults}&no_rooms=${rooms}`;
  }
}

export class LegacyHotelsComProvider extends BaseDeepLinkProvider {
  constructor() {
    super('hotelscom', 'Hotels.com');
  }

  buildSearchUrl(input: HotelSearchInput): string | null {
    const { destination, checkIn, checkOut, adults, rooms } = input;
    const dest = encodeURIComponent(destination);
    const ci = checkIn ? checkIn.toISOString().slice(0, 10) : '';
    const co = checkOut ? checkOut.toISOString().slice(0, 10) : '';
    return `https://www.hotels.com/search.do?q-destination=${dest}&q-check-in=${ci}&q-check-out=${co}&q-rooms=${rooms}&q-room-0-adults=${adults}`;
  }
}

export class LegacyAirbnbProvider extends BaseDeepLinkProvider {
  constructor() {
    super('airbnb', 'Airbnb');
  }

  buildSearchUrl(input: HotelSearchInput): string | null {
    const { destination, checkIn, checkOut, adults } = input;
    const dest = encodeURIComponent(destination);
    const ci = checkIn ? checkIn.toISOString().slice(0, 10) : '';
    const co = checkOut ? checkOut.toISOString().slice(0, 10) : '';
    return `https://www.airbnb.com/s/${dest}/homes?checkin=${ci}&checkout=${co}&adults=${adults}`;
  }
}
