// Booking provider adapter types — wire real providers in here later
// ─────────────────────────────────────────────────────────────────
// Each affiliate SDK (Travelpayouts, Expedia, Booking.com, etc.) will
// implement this interface as an adapter. The BookingSearch component
// consumes only this interface, so providers are fully interchangeable.

export type BookingTab = 'flights' | 'hotels' | 'cars' | 'activities' | 'cruises';

export interface SearchParams {
  tab: BookingTab;
  origin?: string;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  passengers?: number;
  cabinClass?: 'economy' | 'business' | 'first';
}

/**
 * Booking provider adapter interface.
 * Implement this for each affiliate partner SDK.
 *
 * @example
 * // TODO: Travelpayouts adapter (wire in after credentials approved)
 * export const travelpayoutsAdapter: BookingProvider = {
 *   name: 'Travelpayouts',
 *   supportedTabs: ['flights', 'hotels', 'cars'],
 *   buildSearchUrl: (params) => `https://tp.media/...&marker=YOUR_MARKER`,
 *   renderWidget: (params, container) => { /* init Travelpayouts JS widget *\/ },
 * };
 */
export interface BookingProvider {
  /** Display name of the affiliate partner */
  name: string;
  /** Which tabs this provider can handle */
  supportedTabs: BookingTab[];
  /**
   * Build a deep-link affiliate URL for a given search.
   * Used as fallback when renderWidget is not provided.
   */
  buildSearchUrl?: (params: SearchParams) => string;
  /**
   * Mount a JS widget into a DOM container element.
   * Called by BookingSearch when a provider is wired in.
   *
   * @param params - Current search state
   * @param container - DOM element to mount the widget into
   * @returns Optional cleanup function (called on unmount)
   */
  renderWidget?: (params: SearchParams, container: HTMLElement) => (() => void) | void;
}
