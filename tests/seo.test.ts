import test from 'node:test';
import assert from 'node:assert';
import sitemap from '../app/sitemap';
import robots from '../app/robots';

test('SEO Foundation', async (t) => {
  await t.test('canonical origin is correct in sitemap', async () => {
    const map = await sitemap();
    const staticUrls = map.map(m => m.url);
    // Should all start with the vercel app URL
    assert.ok(staticUrls.every(url => url.startsWith('https://sunward-travel.vercel.app')));
    // Should contain privacy
    assert.ok(staticUrls.includes('https://sunward-travel.vercel.app/privacy'));
  });

  await t.test('robots.txt excludes private paths', () => {
    const bot = robots();
    const disallow = Array.isArray(bot.rules) ? bot.rules[0].disallow : (bot.rules as any).disallow;
    assert.ok(Array.isArray(disallow));
    assert.ok(disallow.includes('/admin/'));
    assert.ok(disallow.includes('/api/'));
    assert.ok(disallow.includes('/preview/'));
  });
});
