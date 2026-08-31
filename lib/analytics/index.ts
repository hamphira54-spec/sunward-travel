import { event as gaEvent, GA_MEASUREMENT_ID } from './googleAnalytics';
import type { EventName, BaseEventParams } from './types';

// The primary abstraction for semantic tracking.
// This allows swapping out or adding providers (e.g. Plausible, PostHog) without changing application code.
export function trackEvent(eventName: EventName, params?: BaseEventParams) {
  gaEvent(eventName, params || {});
}

// Ensure the GA measurement ID is exposed for the root layout to inject the script.
export { GA_MEASUREMENT_ID };
