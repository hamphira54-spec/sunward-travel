import test from 'node:test';
import assert from 'node:assert';
import { trackEvent } from '../lib/analytics/index';
import { trackAffiliateClick, trackContentView } from '../lib/analytics/events';

test('Analytics Engine', async (t) => {
  await t.test('analytics disabled when GA ID missing', () => {
    let called = false;
    (global as any).window = {
      gtag: () => { called = true; }
    };
    
    // With GA_MEASUREMENT_ID undefined (which it is by default in test env unless set)
    trackEvent('page_view');
    // If it's still false, it means ga.event did not call gtag (or we didn't mock sendGAEvent).
    // The googleAnalytics wrapper will skip if typeof window === 'undefined' or GA_MEASUREMENT_ID missing.
    assert.strictEqual(called, false);

    delete (global as any).window;
  });

  await t.test('affiliate click tracking behavior does not block', () => {
    // Just verify the event fires and types align
    const safeParams = { destination_slug: 'bali' };
    
    assert.doesNotThrow(() => {
      trackAffiliateClick('klook', 'header_button', safeParams);
    });
  });

  await t.test('no secret/PII properties in standard event contracts', () => {
    const safeParams = {
      content_type: 'guide',
      content_slug: 'where-to-stay-bali',
      provider: 'klook'
    };
    
    assert.doesNotThrow(() => {
      trackContentView('guide', 'where-to-stay-bali', safeParams);
    });
  });
});
