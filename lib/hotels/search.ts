import { HotelSearchInput, HotelSearchResponse, HotelError, SearchMode } from './types';
import { validateHotelSearchInput } from './validation';
import { providerRegistry } from './providers/registry';
import { logHotelEvent } from './events/analytics';

export async function searchHotels(rawInput: unknown): Promise<HotelSearchResponse> {
  // 1. Validate Input
  let input: HotelSearchInput;
  try {
    input = validateHotelSearchInput(rawInput);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid search input';
    throw new HotelError('INVALID_SEARCH', msg);
  }

  const mode: SearchMode = (input.checkIn && input.checkOut) ? 'LIVE_SEARCH' : 'DISCOVERY';

  logHotelEvent({
    eventName: 'hotel_search_started',
    timestamp: new Date(),
    destination: input.destination,
    adults: input.adults,
    rooms: input.rooms,
  });

  // 2. Select Provider
  const provider = providerRegistry.resolveProvider(input.destination);

  if (!provider) {
    logHotelEvent({
      eventName: 'hotel_search_failed',
      timestamp: new Date(),
      error: 'NO_PROVIDER',
    });
    return {
      mode,
      provider: 'NONE',
      results: [],
      searchedAt: new Date(),
      priceVerified: false,
      availabilityVerified: false,
    };
  }

  logHotelEvent({
    eventName: 'hotel_provider_selected',
    timestamp: new Date(),
    provider: provider.id,
    destination: input.destination,
  });

  // 3. Check Capabilities
  if (mode === 'LIVE_SEARCH' && !provider.capabilities.supportsLiveSearch) {
    throw new HotelError('LIVE_SEARCH_UNSUPPORTED', `Provider ${provider.id} does not support LIVE_SEARCH`);
  }
  
  if (mode === 'DISCOVERY' && !provider.capabilities.supportsDiscovery) {
    // If discovery isn't supported, we return empty results rather than throwing.
    return {
      mode,
      provider: provider.id,
      results: [],
      searchedAt: new Date(),
      priceVerified: false,
      availabilityVerified: false,
    };
  }

  // 4. Execute Provider Adapter
  try {
    const results = await provider.search(input, mode);
    
    // 5. Return typed response
    // (Normalization happens inside the provider adapter before returning HotelResult[])
    
    logHotelEvent({
      eventName: 'hotel_search_completed',
      timestamp: new Date(),
      provider: provider.id,
      destination: input.destination,
    });

    return {
      mode,
      provider: provider.id,
      results,
      searchedAt: new Date(),
      priceVerified: provider.capabilities.supportsPrice,
      availabilityVerified: provider.capabilities.supportsAvailability,
    };

  } catch (err: any) {
    logHotelEvent({
      eventName: 'hotel_search_failed',
      timestamp: new Date(),
      provider: provider.id,
      error: err.message,
    });

    if (err instanceof HotelError) {
      throw err;
    }
    
    // Do not expose raw provider exception
    throw new HotelError('PROVIDER_ERROR', 'An error occurred while communicating with the hotel provider.');
  }
}
