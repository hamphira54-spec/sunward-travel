// ─────────────────────────────────────────────────────────────────────────────
// FlightsWidget — Travelpayouts flight search widget
//
// Colors mapped exactly from globals.css design tokens:
//   primary_override & color_icons  → --color-ocean:      #0D6E7A
//   color_button & color_focused    → --color-horizon:    #F2C04A
//   dark                            → --color-ink:        #1A2631
//   special                         → --color-mist-light: #A8C0CC
//   border_radius: 8                → matches rounded-lg (0.5rem = 8px),
//                                     used on inputs & buttons site-wide
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useEffect, useRef } from 'react';

const WIDGET_SRC =
  'https://tpwdg.com/content' +
  '?currency=usd' +
  '&trs=566794' +
  '&shmarker=769903' +
  '&show_hotels=true' +
  '&powered_by=true' +
  '&locale=en' +
  '&searchUrl=www.aviasales.com%2Fsearch' +
  '&primary_override=%230D6E7A' +   // --color-ocean
  '&color_button=%23F2C04A' +       // --color-horizon
  '&color_icons=%230D6E7A' +        // --color-ocean
  '&dark=%231A2631' +               // --color-ink
  '&light=%23FFFFFF' +
  '&secondary=%23FFFFFF' +
  '&special=%23A8C0CC' +            // --color-mist-light
  '&color_focused=%23F2C04A' +      // --color-horizon
  '&border_radius=8' +              // rounded-lg equivalent
  '&no_labels=' +
  '&plain=true' +
  '&promo_id=7879' +
  '&campaign_id=100';

export default function FlightsWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove any previously injected instance before re-mounting
    const existing = container.querySelector('[data-tp-widget]');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.setAttribute('data-tp-widget', 'flights');
    script.async = true;
    script.src = WIDGET_SRC;
    script.charset = 'utf-8';
    container.appendChild(script);

    return () => {
      const stale = container.querySelector('[data-tp-widget]');
      if (stale) stale.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[120px]"
      aria-label="Travelpayouts flight search widget"
    />
  );
}
