import { HotelResult, AvailabilityStatus, PriceBasis } from '../types';
import { validateUrlSafety } from '../validation';

/**
 * Base utility for normalizing arbitrary provider payloads into the unified HotelResult model.
 * Specific providers (M2+) will implement their own mappers utilizing this foundation.
 */
export function normalizeHotelBase(
  providerId: string,
  raw: any
): HotelResult {
  // Ensure we don't leak secrets or unnecessary data
  const safeMetadata = extractSafeMetadata(raw);

  return {
    id: String(raw.id || raw.hotelId || ''),
    provider: providerId,
    providerPropertyId: String(raw.providerPropertyId || raw.id || ''),
    name: String(raw.name || 'Unknown Property'),
    destination: String(raw.destination || raw.city || ''),
    country: String(raw.country || ''),
    coordinates: parseCoordinates(raw),
    address: raw.address ? String(raw.address) : undefined,
    image: validateUrlSafety(raw.image || raw.photoUrl),
    propertyType: raw.propertyType ? String(raw.propertyType) : undefined,
    starRating: typeof raw.starRating === 'number' ? raw.starRating : undefined,
    guestRating: typeof raw.guestRating === 'number' ? raw.guestRating : undefined,
    reviewCount: typeof raw.reviewCount === 'number' ? raw.reviewCount : undefined,
    price: parsePrice(raw),
    availabilityStatus: parseAvailability(raw),
    bookingUrl: validateUrlSafety(raw.bookingUrl || raw.url),
    amenities: Array.isArray(raw.amenities) ? raw.amenities.map(String) : undefined,
    providerMetadata: safeMetadata,
  };
}

function parseCoordinates(raw: any) {
  if (typeof raw.lat === 'number' && typeof raw.lng === 'number') {
    return { latitude: raw.lat, longitude: raw.lng };
  }
  if (typeof raw.latitude === 'number' && typeof raw.longitude === 'number') {
    return { latitude: raw.latitude, longitude: raw.longitude };
  }
  return undefined;
}

function parsePrice(raw: any) {
  if (!raw.price || typeof raw.price.amount !== 'number' || typeof raw.price.currency !== 'string') {
    return undefined;
  }
  
  let basis: PriceBasis = 'UNKNOWN';
  if (raw.price.basis === 'PER_NIGHT' || raw.price.basis === 'TOTAL_STAY') {
    basis = raw.price.basis;
  }
  
  return {
    amount: raw.price.amount,
    currency: raw.price.currency,
    basis,
    taxesIncluded: typeof raw.price.taxesIncluded === 'boolean' ? raw.price.taxesIncluded : undefined,
  };
}

function parseAvailability(raw: any): AvailabilityStatus {
  if (raw.availabilityStatus === 'AVAILABLE' || raw.availabilityStatus === 'UNAVAILABLE') {
    return raw.availabilityStatus;
  }
  return 'UNKNOWN';
}

function extractSafeMetadata(raw: any): Record<string, unknown> | undefined {
  if (!raw.metadata || typeof raw.metadata !== 'object') return undefined;
  
  const safe: Record<string, unknown> = {};
  const allowedKeys = ['providerScore', 'distanceToCenter', 'cancellationPolicy'];
  
  for (const key of allowedKeys) {
    if (key in raw.metadata) {
      safe[key] = raw.metadata[key];
    }
  }
  
  return Object.keys(safe).length > 0 ? safe : undefined;
}
