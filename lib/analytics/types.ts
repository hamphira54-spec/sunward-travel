export type EventName =
  | 'page_view'
  | 'destination_view'
  | 'guide_view'
  | 'news_view'
  | 'event_view'
  | 'hotel_discovery_view'
  | 'hotel_destination_search'
  | 'stay_area_view'
  | 'affiliate_click'
  | 'activity_click'
  | 'transfer_click'
  | 'flight_search'
  | 'flight_result_click'
  | 'car_rental_click'
  | 'internal_search'
  | 'navigation_click';

export interface BaseEventParams {
  content_type?: string;
  content_slug?: string;
  destination_slug?: string;
  country_slug?: string;
  provider?: string;
  placement?: string;
  cta_name?: string;
  search_origin?: string;
  search_destination?: string;
  traveler_intent?: string;
  accommodation_style?: string;
}
