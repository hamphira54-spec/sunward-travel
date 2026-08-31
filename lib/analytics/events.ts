import { trackEvent } from './index';
import type { BaseEventParams } from './types';

export function trackAffiliateClick(
  provider: string,
  placement: string,
  params?: Omit<BaseEventParams, 'provider' | 'placement'>
) {
  trackEvent('affiliate_click', {
    provider,
    placement,
    ...params,
  });
}

export function trackContentView(
  type: 'destination' | 'guide' | 'news' | 'event' | 'stay_area',
  slug: string,
  params?: BaseEventParams
) {
  const eventNameMap = {
    destination: 'destination_view',
    guide: 'guide_view',
    news: 'news_view',
    event: 'event_view',
    stay_area: 'stay_area_view',
  } as const;

  trackEvent(eventNameMap[type], {
    content_type: type,
    content_slug: slug,
    ...params,
  });
}
