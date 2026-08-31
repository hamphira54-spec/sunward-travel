import { HotelSearchInput } from '../types';

export type HotelEventName = 
  | 'hotel_search_started'
  | 'hotel_search_completed'
  | 'hotel_search_failed'
  | 'hotel_provider_selected'
  | 'hotel_search'
  | 'hotel_result_view'
  | 'hotel_affiliate_click';

export interface HotelEventPayload {
  eventName: HotelEventName;
  timestamp: Date;
  provider?: string;
  destination?: string;
  adults?: number;
  rooms?: number;
  error?: string;
  propertyId?: string;
}

/**
 * Foundation for observability and commercial analytics.
 * Does not implement third-party analytics integrations yet.
 * Never logs secrets or PII.
 */
export function logHotelEvent(payload: HotelEventPayload) {
  // In M1, we just provide the architectural boundary.
  if (process.env.NODE_ENV !== 'production') {
    // console.log('[Hotel Analytics]', payload.eventName, payload.provider, payload.destination);
  }
}
