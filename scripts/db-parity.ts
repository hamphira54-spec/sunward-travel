#!/usr/bin/env ts-node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/db-parity.ts
// SUNWARD TRAVEL — Static vs Database Content Parity Checker
//
// Compares the certified static data source against the live PostgreSQL
// database to ensure they are semantically equivalent.
//
// Usage:
//   npm run db:parity
//
// Exit codes:
//   0 = PASS
//   1 = FAIL
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import { COUNTRIES, DESTINATIONS } from '../lib/destinations-v2';
import { GUIDES } from '../lib/guides';
import { NEWS_ARTICLES } from '../lib/news';
import { EVENT_ARTICLES } from '../lib/events';

const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BOLD   = '\x1b[1m';
const RESET  = '\x1b[0m';

let failures = 0;
let checks = 0;

function pass(label: string, note = '') {
  checks++;
  console.log(`${GREEN}+${RESET} ${label}${note ? ` (${note})` : ''}`);
}

function fail(label: string, detail: string) {
  checks++;
  failures++;
  console.log(`${RED}FAIL${RESET} ${BOLD}${label}${RESET}`);
  console.log(`     ${RED}-> ${detail}${RESET}`);
}

function section(title: string) {
  console.log(`\n${BOLD}${YELLOW}== ${title} ==${RESET}`);
}

function compareBlocks(staticBlocks: any[], dbBlocks: any[]): { equal: boolean; diff: string } {
  if (!Array.isArray(staticBlocks) || !Array.isArray(dbBlocks)) {
    return { equal: false, diff: `static is ${typeof staticBlocks}, db is ${typeof dbBlocks}` };
  }
  if (staticBlocks.length !== dbBlocks.length) {
    return { equal: false, diff: `block count: static=${staticBlocks.length} db=${dbBlocks.length}` };
  }
  for (let i = 0; i < staticBlocks.length; i++) {
    const s = staticBlocks[i];
    const d = dbBlocks[i];
    if (s.type !== d.type) {
      return { equal: false, diff: `block[${i}] type: static="${s.type}" db="${d.type}"` };
    }
    if (s.type === 'heading') {
      if (s.level !== d.level) return { equal: false, diff: `block[${i}] heading level: static=${s.level} db=${d.level}` };
      if (s.text !== d.text) return { equal: false, diff: `block[${i}] heading text mismatch` };
    }
    if (s.type === 'paragraph' || s.type === 'quote') {
      const sNodes = s.nodes ?? [];
      const dNodes = d.nodes ?? [];
      if (sNodes.length !== dNodes.length) return { equal: false, diff: `block[${i}] nodes count: static=${sNodes.length} db=${dNodes.length}` };
      for (let j = 0; j < sNodes.length; j++) {
        if (sNodes[j].type !== dNodes[j].type) return { equal: false, diff: `block[${i}].nodes[${j}] type mismatch` };
        if (sNodes[j].content !== dNodes[j].content) return { equal: false, diff: `block[${i}].nodes[${j}] content mismatch` };
        if (sNodes[j].type === 'link' && sNodes[j].href !== dNodes[j].href) return { equal: false, diff: `block[${i}].nodes[${j}] link href mismatch` };
      }
    }
    if (s.type === 'list') {
      if (s.ordered !== d.ordered) return { equal: false, diff: `block[${i}] list ordered mismatch` };
      if ((s.items ?? []).length !== (d.items ?? []).length) return { equal: false, diff: `block[${i}] list items count mismatch` };
    }
    if (s.type === 'callout') {
      if (s.variant !== d.variant) return { equal: false, diff: `block[${i}] callout variant mismatch` };
    }
  }
  return { equal: true, diff: '' };
}

async function main() {
  console.log(`\n${BOLD}SUNWARD TRAVEL - Static vs Database Parity Check${RESET}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const prisma = new PrismaClient();

  try {
    section('DATABASE CONNECTIVITY');
    await prisma.$queryRaw`SELECT 1`;
    pass('PostgreSQL connection');

    // COUNTRIES
    section('COUNTRIES');
    const staticCountries = COUNTRIES;
    const dbCountries = await prisma.country.findMany();

    if (staticCountries.length === dbCountries.length) {
      pass(`Count: ${staticCountries.length}`);
    } else {
      fail('Count mismatch', `static=${staticCountries.length} db=${dbCountries.length}`);
    }

    const staticCountrySlugs = staticCountries.map((c) => c.slug).sort();
    const dbCountrySlugs = dbCountries.map((c) => c.slug).sort();
    const missingCS = staticCountrySlugs.filter((s) => !dbCountrySlugs.includes(s));
    const extraCS = dbCountrySlugs.filter((s) => !staticCountrySlugs.includes(s));
    if (missingCS.length === 0 && extraCS.length === 0) {
      pass('Slug parity');
    } else {
      if (missingCS.length > 0) fail('Missing country slugs', missingCS.join(', '));
      if (extraCS.length > 0) fail('Extra country slugs', extraCS.join(', '));
    }

    // DESTINATIONS
    section('DESTINATIONS');
    const staticDests = DESTINATIONS;
    const dbDests = await prisma.destination.findMany();

    if (staticDests.length === dbDests.length) {
      pass(`Count: ${staticDests.length}`);
    } else {
      fail('Count mismatch', `static=${staticDests.length} db=${dbDests.length}`);
    }

    const staticDestSlugs = staticDests.map((d) => d.slug).sort();
    const dbDestSlugs = dbDests.map((d) => d.slug).sort();
    const missingDS = staticDestSlugs.filter((s) => !dbDestSlugs.includes(s));
    const extraDS = dbDestSlugs.filter((s) => !staticDestSlugs.includes(s));
    if (missingDS.length === 0 && extraDS.length === 0) {
      pass('Slug parity');
    } else {
      if (missingDS.length > 0) fail('Missing destination slugs', missingDS.join(', '));
      if (extraDS.length > 0) fail('Extra destination slugs', extraDS.join(', '));
    }

    let relOk = true;
    for (const sd of staticDests) {
      const dd = dbDests.find((d) => d.slug === sd.slug);
      if (!dd) continue;
      if (sd.countrySlug !== dd.countrySlug) {
        fail(`Destination [${sd.slug}] countrySlug`, `static="${sd.countrySlug}" db="${dd.countrySlug}"`);
        relOk = false;
      }
    }
    if (relOk) pass('Country relationships');

    // GUIDES
    section('GUIDES');
    const staticGuides = GUIDES.filter((g: any) => !g.status || g.status === 'published');
    const dbGuides = await prisma.guide.findMany({ where: { status: 'published' } });

    if (staticGuides.length === dbGuides.length) {
      pass(`Published count: ${staticGuides.length}`);
    } else {
      fail('Count mismatch', `static=${staticGuides.length} db=${dbGuides.length}`);
    }

    for (const sg of staticGuides) {
      const dg = dbGuides.find((g) => g.slug === sg.slug);
      if (!dg) { fail(`Guide [${sg.slug}]`, 'not found in database'); continue; }
      if (sg.title !== dg.title) fail(`Guide [${sg.slug}] title`, `"${sg.title}" vs "${dg.title}"`);
      if (sg.category !== dg.category) fail(`Guide [${sg.slug}] category`, `"${sg.category}" vs "${dg.category}"`);
      if (((sg as any).destinationSlug ?? null) !== (dg.destinationSlug ?? null)) {
        fail(`Guide [${sg.slug}] destinationSlug`, `"${(sg as any).destinationSlug}" vs "${dg.destinationSlug}"`);
      }
      const blockResult = compareBlocks((sg as any).body ?? [], (dg.body as any[]) ?? []);
      if (!blockResult.equal) {
        fail(`Guide [${sg.slug}] ContentBlock`, blockResult.diff);
      } else {
        pass(`Guide [${sg.slug}] ContentBlock`);
      }
    }

    // NEWS
    section('NEWS');
    const staticNews = NEWS_ARTICLES.filter((n: any) => n.publication.status === 'published');
    const dbNews = await prisma.news.findMany();
    const dbNewsPublished = dbNews.filter((n) => (n.publication as any)?.status === 'published');

    if (staticNews.length === dbNewsPublished.length) {
      pass(`Published count: ${staticNews.length}`);
    } else {
      fail('Count mismatch', `static=${staticNews.length} db=${dbNewsPublished.length}`);
    }

    for (const sn of staticNews) {
      const dn = dbNews.find((n) => n.slug === sn.slug);
      if (!dn) { fail(`News [${sn.slug}]`, 'not found in database'); continue; }
      if (sn.title !== dn.title) fail(`News [${sn.slug}] title`, `"${sn.title}" vs "${dn.title}"`);
      if (sn.category !== dn.category) fail(`News [${sn.slug}] category`, `"${sn.category}" vs "${dn.category}"`);
      const sPub = (sn.publication as any).status;
      const dPub = (dn.publication as any)?.status;
      if (sPub !== dPub) fail(`News [${sn.slug}] publication.status`, `"${sPub}" vs "${dPub}"`);
      const staticSrc = (sn as any).sourceReferences ?? [];
      const dbSrc = (dn.sourceReferences as any[]) ?? [];
      if (staticSrc.length !== dbSrc.length) {
        fail(`News [${sn.slug}] sourceReferences`, `static=${staticSrc.length} db=${dbSrc.length}`);
      } else {
        let srcOk = true;
        for (let i = 0; i < staticSrc.length; i++) {
          if (staticSrc[i].url !== dbSrc[i]?.url) { srcOk = false; fail(`News [${sn.slug}] srcRef[${i}].url`, `"${staticSrc[i].url}" vs "${dbSrc[i]?.url}"`); }
        }
        if (srcOk) pass(`News [${sn.slug}] sourceReferences`);
      }
      const blockResult = compareBlocks((sn as any).body ?? [], (dn.body as any[]) ?? []);
      if (!blockResult.equal) {
        fail(`News [${sn.slug}] ContentBlock`, blockResult.diff);
      } else {
        pass(`News [${sn.slug}] ContentBlock`);
      }
    }

    // EVENTS
    section('EVENTS');
    const staticEvents = EVENT_ARTICLES;
    const dbEvents = await prisma.event.findMany();

    if (staticEvents.length === dbEvents.length) {
      pass(`Total count: ${staticEvents.length}`);
    } else {
      fail('Count mismatch', `static=${staticEvents.length} db=${dbEvents.length}`);
    }

    for (const se of staticEvents) {
      const de = dbEvents.find((e) => e.slug === se.slug);
      if (!de) { fail(`Event [${se.slug}]`, 'not found in database'); continue; }
      const sPub = (se.publication as any).status;
      const dPub = (de.publication as any)?.status;
      if (sPub !== dPub) {
        fail(`Event [${se.slug}] publication.status`, `static="${sPub}" db="${dPub}"`);
      } else {
        pass(`Event [${se.slug}] publication.status = ${dPub}`);
      }
      if (se.lifecycleStatus !== de.lifecycleStatus) fail(`Event [${se.slug}] lifecycleStatus`, `"${se.lifecycleStatus}" vs "${de.lifecycleStatus}"`);
      if (se.startDate !== de.startDate) {
        fail(`Event [${se.slug}] startDate`, `"${se.startDate}" vs "${de.startDate}"`);
      } else {
        pass(`Event [${se.slug}] startDate = ${de.startDate}`);
      }
      if ((se.endDate ?? null) !== (de.endDate ?? null)) fail(`Event [${se.slug}] endDate`, `"${se.endDate}" vs "${de.endDate}"`);
      if ((se.timezone ?? null) !== (de.timezone ?? null)) fail(`Event [${se.slug}] timezone`, `"${se.timezone}" vs "${de.timezone}"`);
      const blockResult = compareBlocks((se as any).body ?? [], (de.body as any[]) ?? []);
      if (!blockResult.equal) {
        fail(`Event [${se.slug}] ContentBlock`, blockResult.diff);
      } else {
        pass(`Event [${se.slug}] ContentBlock`);
      }
    }

    // SONGKRAN PROTECTION
    section('SONGKRAN PROTECTION');
    const songkran = dbEvents.find((e) => e.slug === 'songkran-water-festival');
    if (!songkran) {
      fail('Songkran event', 'not found in database');
    } else {
      const pubStatus = (songkran.publication as any)?.status;
      if (pubStatus === 'draft') {
        pass('Songkran = draft (protected)');
      } else {
        fail('Songkran publication.status', `SECURITY FAILURE: expected "draft" got "${pubStatus}"`);
      }
    }

    section('SUMMARY');
    if (failures === 0) {
      console.log(`\n${GREEN}${BOLD}PARITY PASS - All ${checks} checks passed.${RESET}\n`);
    } else {
      console.log(`\n${RED}${BOLD}PARITY FAIL - ${failures} of ${checks} checks failed.${RESET}\n`);
    }

  } catch (err: any) {
    console.error(`\n${RED}${BOLD}FATAL ERROR${RESET}`);
    if (err?.code) console.error(`  Error code: ${err.code}`);
    const msg = err?.message ?? '';
    if (msg.includes('postgresql://') || msg.includes('password') || msg.includes('DIRECT_URL') || msg.includes('DATABASE_URL')) {
      console.error('  Message: [connection error - check DATABASE_URL configuration]');
    } else {
      console.error(`  Message: ${msg}`);
    }
    failures++;
  } finally {
    await prisma.$disconnect();
  }

  process.exit(failures > 0 ? 1 : 0);
}

main();
