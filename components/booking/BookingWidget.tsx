'use client';

import Script from 'next/script';

interface BookingWidgetProps {
  origin?:     string;
  destination?: string;
}

export default function BookingWidget({ origin, destination }: BookingWidgetProps) {
  // Widget URL with Sunward Travel brand colors
  const widgetSrc =
    'https://tpwdg.com/content' +
    '?currency=usd' +
    '&trs=566794' +
    '&shmarker=769903' +
    '&show_hotels=false' +
    '&powered_by=true' +
    '&locale=en' +
    '&searchUrl=www.aviasales.com%2Fsearch' +
    '&primary_override=%230D6E7A' +
    '&color_button=%23F2C04A' +
    '&color_icons=%230D6E7A' +
    '&dark=%231A2631' +
    '&light=%23FBF8F4' +
    '&secondary=%23FFFFFF' +
    '&special=%23A8C0CC' +
    '&color_focused=%23F2C04A' +
    '&border_radius=8' +
    '&plain=true' +
    '&promo_id=7879' +
    '&campaign_id=100';

  return (
    <div className="w-full">
      <Script src={widgetSrc} strategy="afterInteractive" charSet="utf-8" />
    </div>
  );
}
