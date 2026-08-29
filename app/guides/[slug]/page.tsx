import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock, MapPin, Calendar, ArrowRight, BookOpen,
} from 'lucide-react';
import {
  GUIDES, GUIDE_BY_SLUG, getRelatedGuides, CATEGORY_LABELS,
} from '@/lib/guides';
import { DESTINATION_BY_SLUG, COUNTRY_BY_SLUG } from '@/lib/destinations-v2';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';
import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';
const SITE_NAME = 'Sunward Travel';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_BY_SLUG[slug];
  if (!guide) return { title: 'Guide Not Found' };
  const canonical = `${SITE_URL}/guides/${slug}`;
  return {
    title: guide.seo.title,
    description: guide.seo.description,
    alternates: { canonical },
    openGraph: {
      title: guide.seo.title,
      description: guide.seo.description,
      url: canonical,
      type: 'article',
      images: [{ url: guide.heroImage.src, alt: guide.heroImage.alt }],
    },
  };
}

// Article content map — structured React blocks, no dangerouslySetInnerHTML
const ARTICLE_CONTENT: Record<string, React.ReactNode> = {
  'best-time-to-visit-bali': (
    <>
      <p>
        Bali&apos;s tropical climate means it&apos;s warm year-round &mdash; but the difference
        between dry season and wet season shapes your experience dramatically.
        Here&apos;s a month-by-month breakdown so you can plan the perfect trip.
      </p>

      <h2 id="dry-season" data-section-id="dry-season">
        Dry Season: May &ndash; September (Best Overall)
      </h2>
      <p>
        This is Bali&apos;s most popular time to visit &mdash; and for good reason. Days are
        reliably sunny, humidity is lower, and the ocean is calm and clear for
        snorkelling and diving around Nusa Penida. Expect busy beaches in
        Seminyak and Kuta, higher accommodation rates, and rice terraces at
        their most photogenic as the harvest season approaches.
      </p>

      <h2 id="shoulder-season" data-section-id="shoulder-season">
        Shoulder Season: April and October
      </h2>
      <p>
        These transitional months offer a sweet spot: decent weather, lower
        prices than peak season, and fewer crowds. April still sees occasional
        showers; October can bring the first rains of the wet season but often
        stays dry through mid-month.
      </p>

      <h2 id="wet-season" data-section-id="wet-season">
        Wet Season: November &ndash; March
      </h2>
      <p>
        Rain doesn&apos;t mean staying indoors &mdash; Bali&apos;s wet season typically brings
        short, intense afternoon downpours rather than all-day rain. The island
        turns impossibly lush and green, hotel rates drop significantly, and the
        spiritual calendar peaks with major temple ceremonies around the
        Balinese New Year (Nyepi) in March.
      </p>

      <h2 id="special-events" data-section-id="special-events">
        Special Events Worth Planning Around
      </h2>
      <ul>
        <li>
          <strong>Nyepi (March)</strong> &mdash; The Balinese Day of Silence.
          The entire island shuts down for 24 hours. A profound, unique experience.
        </li>
        <li>
          <strong>Galungan &amp; Kuningan</strong> &mdash; A 10-day festival
          celebrating ancestral spirits. Villages are decorated with penjor bamboo poles.
        </li>
        <li>
          <strong>Bali Arts Festival (June&ndash;July)</strong> &mdash;
          Month-long celebration of Balinese culture, dance, and music in Denpasar.
        </li>
      </ul>

      <h2 id="recommendation" data-section-id="recommendation">
        Our Recommendation
      </h2>
      <p>
        For first-time visitors: aim for <strong>May or September</strong> &mdash;
        you get dry-season reliability at slightly lower prices than July&ndash;August
        peak. Experienced travellers who want Bali&apos;s soul over its Instagram moments
        should consider January for the festivals and dramatically lower costs.
      </p>
    </>
  ),

  'cheapest-ways-to-fly-to-europe': (
    <>
      <p>
        Finding a cheap transatlantic flight requires timing, flexibility, and knowing
        which tools actually work. These nine strategies are based on how real budget
        travellers consistently find fares well below the average.
      </p>

      <h2 id="booking-window" data-section-id="booking-window">Book at the Right Time</h2>
      <p>
        For transatlantic routes, the optimal booking window is roughly
        3&ndash;6 months before departure for peak summer and 6&ndash;10 weeks out for
        shoulder and off-peak dates. Last-minute fares to Europe from North America are
        almost always expensive. The best deals appear mid-week (Tuesday&ndash;Wednesday)
        and during off-peak periods (November through March, excluding holidays).
      </p>

      <h2 id="budget-airlines" data-section-id="budget-airlines">Use Budget Airlines Strategically</h2>
      <p>
        European budget carriers like Ryanair, easyJet, Wizz Air, and Vueling connect
        dozens of secondary cities at very low fares &mdash; but only once you&apos;re
        already in Europe. Use them for the intra-European leg. For the transatlantic
        crossing, airlines like Icelandair, LEVEL, and Norse Atlantic have operated
        low-cost long-haul routes. Availability changes &mdash; always check directly
        before assuming a route exists.
      </p>

      <h2 id="flexible-dates" data-section-id="flexible-dates">Stay Flexible on Dates</h2>
      <p>
        Even a two-day shift can save $150&ndash;300 on a transatlantic ticket.
        Tuesday and Wednesday departures are usually the cheapest. Arriving back
        mid-week also helps. Use a calendar view or flexible-date tool when searching
        rather than searching a single date.
      </p>

      <h2 id="fare-alerts" data-section-id="fare-alerts">Set Fare Alerts</h2>
      <p>
        Google Flights&apos; price tracking, Kayak Explore, and dedicated alert services
        monitor routes and email you when fares drop. These are most useful if your
        travel dates are flexible and you can move quickly &mdash; sale fares often
        last 24&ndash;48 hours.
      </p>

      <h2 id="positioning-flights" data-section-id="positioning-flights">Consider Positioning Flights</h2>
      <p>
        If you live near a smaller regional airport, check whether flying first to a
        major hub (New York JFK, London Heathrow, Amsterdam, or Frankfurt) and then
        onward is cheaper overall than a direct routing. Sometimes paying $60&ndash;80
        for a positioning flight saves $400 on the transatlantic portion.
      </p>

      <h2 id="travel-credit-cards" data-section-id="travel-credit-cards">Leverage Travel Credit Cards</h2>
      <p>
        Sign-up bonuses on travel credit cards can cover round-trip transatlantic
        flights in premium cabins for points equivalent to $200&ndash;400. If you use
        credit cards responsibly and pay them monthly, this is a genuine strategy
        &mdash; not a myth.
      </p>

      <h2 id="indirect-routes" data-section-id="indirect-routes">Try Indirect Routes</h2>
      <p>
        A one-stop itinerary through Reykjavik, Dublin, or Lisbon is often
        20&ndash;35% cheaper than non-stop. The layover adds time but the savings
        are real. Icelandair&apos;s stopover policy lets you spend days in Reykjavik
        at no extra fare cost.
      </p>

      <h2 id="shoulder-season" data-section-id="shoulder-season">Travel in Shoulder Season</h2>
      <p>
        May, early June, and September are Europe&apos;s sweet spot &mdash; warm enough
        for outdoor travel, crowds below peak, and fares 20&ndash;40% lower than
        July&ndash;August. October is excellent for city travel before the cold sets in.
      </p>

      <h2 id="nearby-airports" data-section-id="nearby-airports">Check Nearby Airports</h2>
      <p>
        Flying into secondary airports near your destination &mdash; Beauvais instead
        of CDG, Stansted instead of Heathrow, Charleroi instead of Brussels &mdash;
        can be significantly cheaper. Factor in the cost and time of ground transport
        before deciding.
      </p>

      <p>
        No single strategy works every time. The travellers who consistently find cheap
        transatlantic fares combine flexibility, monitoring, and speed. If you see a
        genuinely good fare, book it &mdash; they disappear quickly.
      </p>
    </>
  ),

  'tokyo-first-timer-guide': (
    <>
      <p>
        Tokyo can feel overwhelming before you arrive and remarkably navigable once
        you do. Japan&apos;s capital has excellent signage in English, a famously
        punctual transport network, and locals who are almost universally helpful to
        confused visitors. This guide covers everything you need for a first visit
        to work smoothly.
      </p>

      <h2 id="getting-there" data-section-id="getting-there">Getting to Tokyo</h2>
      <p>
        Most international flights land at Narita International Airport (NRT), about
        60km from central Tokyo, or Haneda Airport (HND), much closer to the city
        centre. From Narita, the Narita Express (N&apos;EX) train takes about 53 minutes
        to Shinjuku and costs around &yen;3,070 one-way. From Haneda, the Tokyo
        Monorail or Keikyu line connect to the city in 20&ndash;30 minutes. Airport
        limousine buses are also available to major hotels.
      </p>

      <h2 id="getting-around" data-section-id="getting-around">
        Getting Around: IC Card &amp; Trains
      </h2>
      <p>
        Buy a Suica or Pasmo IC card at the airport on arrival. Load money on it and
        tap in/out of every subway, JR train, and even many buses. It also works at
        convenience stores, vending machines, and some restaurants. Tokyo&apos;s train
        network is extensive but logical &mdash; Google Maps works excellently for
        routing and shows real-time platform and departure information.
      </p>

      <h2 id="best-neighbourhoods" data-section-id="best-neighbourhoods">
        Best Neighbourhoods to Stay In
      </h2>
      <p>
        Shinjuku is the most convenient base: great transport connections, endless
        food and shopping, and central to the JR network. Shibuya suits younger
        travellers and those focused on nightlife and fashion. Asakusa has the
        old-city atmosphere and is close to cultural sites like Senso-ji.
        Akihabara and Akasaka are quieter but still well-connected.
      </p>

      <h2 id="money-tipping" data-section-id="money-tipping">
        Money, Tipping &amp; Costs
      </h2>
      <p>
        Japan is still very much a cash society &mdash; carry yen at all times.
        Tipping is not customary and can be considered rude in some contexts.
        Never leave a tip at a restaurant or for a taxi. ATMs at 7-Eleven,
        Japan Post, and some convenience stores accept foreign cards reliably.
        Budget roughly &yen;5,000&ndash;8,000 per day for food eating at local
        restaurants.
      </p>

      <h2 id="cultural-etiquette" data-section-id="cultural-etiquette">
        Cultural Etiquette to Know
      </h2>
      <p>
        Remove shoes when entering a home or traditional restaurant with tatami
        mats. Do not eat or drink while walking &mdash; it&apos;s considered impolite.
        On trains, keep your phone on silent and avoid phone calls. Bow slightly when
        thanking or greeting people. Queuing is always single-file and orderly.
        Rubbish bins are scarce &mdash; carry a small bag for your waste.
      </p>

      <h2 id="what-to-eat" data-section-id="what-to-eat">What to Eat in Tokyo</h2>
      <p>
        Tokyo has more Michelin stars than any other city in the world and also has
        the best convenience store food you will ever eat. Don&apos;t skip: ramen
        (especially in the back streets of Shinjuku), sushi at Tsukiji Outer Market
        or a standing sushi bar, tonkatsu, tempura, and yakitori. Convenience stores
        (7-Eleven, FamilyMart, Lawson) have legitimately excellent onigiri and hot
        food for &yen;150&ndash;300.
      </p>

      <h2 id="must-see" data-section-id="must-see">Must-See Attractions</h2>
      <p>
        <strong>Senso-ji Temple (Asakusa)</strong> &mdash; beautiful at dawn before
        crowds arrive. <strong>Shibuya Crossing</strong> &mdash; most atmospheric at
        night. <strong>Shinjuku Gyoen</strong> &mdash; best garden for cherry blossoms.
        <strong>teamLab Borderless/Planets</strong> &mdash; digital art, book ahead.
        Tokyo Skytree for city views. Meiji Shrine for tranquillity inside the city.
      </p>

      <h2 id="day-trips" data-section-id="day-trips">Day Trips from Tokyo</h2>
      <p>
        <strong>Nikko</strong> (2 hours by Tobu line) &mdash; ornate shrines and
        waterfalls. <strong>Kamakura</strong> (1 hour by JR) &mdash; Great Buddha and
        coastal temples. <strong>Hakone</strong> (1.5 hours, Hakone Free Pass) &mdash;
        Mount Fuji views, hot springs, open-air sculpture museum.
        <strong>Kyoto</strong> (2.5 hours by Shinkansen) &mdash; feasible as a very
        long day trip but better as an overnight.
      </p>
    </>
  ),
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDE_BY_SLUG[slug];
  if (!guide) notFound();

  const content = ARTICLE_CONTENT[slug];
  const relatedGuides = getRelatedGuides(slug, 3);

  // Destination back-link
  const destEntry =
    guide.destinationSlug ? DESTINATION_BY_SLUG[guide.destinationSlug] : null;
  const countryEntry =
    guide.countrySlug ? COUNTRY_BY_SLUG[guide.countrySlug] : null;

  // Breadcrumb items
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Travel Guides', href: '/guides' },
    ...(countryEntry ? [{ label: countryEntry.name, href: `/destinations/${countryEntry.slug}` }] : []),
    { label: guide.title },
  ];

  const categoryLabel = CATEGORY_LABELS[guide.category];

  const publishedDate = new Date(guide.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const updatedDate = guide.updatedAt
    ? new Date(guide.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  // Structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.seo.title,
    description: guide.seo.description,
    image: guide.heroImage.src,
    datePublished: guide.publishedAt,
    ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
    author: {
      '@type': 'Organization',
      name: guide.author ?? 'Sunward Travel Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/guides/${slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <article>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden pt-16">
          <Image
            src={guide.heroImage.src}
            alt={guide.heroImage.alt}
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/10" />
          {/* Breadcrumb on hero */}
          <div className="absolute bottom-0 left-0 right-0 page-container pb-5">
            <DestinationBreadcrumb crumbs={crumbs} light />
          </div>
        </div>

        {/* ── Article body wrapper ─────────────────────────────────────── */}
        <div className="bg-sand">
          <div className="page-container py-10">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

              {/* ── Main article column ───────────────────────────────── */}
              <div className="flex-1 min-w-0" style={{ maxWidth: '720px' }}>

                {/* Article header */}
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-700 uppercase tracking-wider bg-coral/10 text-coral mb-4">
                    {categoryLabel}
                  </span>
                  <h1 className="font-display font-700 text-ink leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                    {guide.title}
                  </h1>
                  <p className="text-mist leading-relaxed mb-5"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}>
                    {guide.excerpt}
                  </p>
                  {/* Meta row */}
                  <div className="flex flex-wrap gap-4 text-xs text-mist border-t border-gray-200 pt-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {guide.destinationLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {guide.readingTimeMinutes} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {updatedDate ? `Updated ${updatedDate}` : `Published ${publishedDate}`}
                    </span>
                  </div>
                </div>

                {/* TOC — mobile (visible on small screens, hidden on lg+) */}
                {guide.tocSections.length > 0 && (
                  <nav
                    aria-label="Table of contents"
                    className="lg:hidden mb-8 bg-white rounded-2xl border border-gray-100 p-5"
                  >
                    <p className="text-[11px] font-700 uppercase tracking-wider text-ocean mb-3">
                      Contents
                    </p>
                    <ol className="space-y-1.5">
                      {guide.tocSections.map((section, i) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="flex items-start gap-2.5 text-sm text-ink hover:text-ocean transition-colors"
                          >
                            <span className="text-[11px] text-mist font-700 mt-0.5 shrink-0 w-4">
                              {i + 1}.
                            </span>
                            {section.heading}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                {/* Article body */}
                <div className="prose-styles">
                  {content ?? (
                    <div className="bg-white rounded-xl p-8 text-center text-mist border border-gray-100">
                      <p className="font-medium">Full article content coming soon.</p>
                      <p className="text-sm mt-1">{guide.excerpt}</p>
                    </div>
                  )}
                </div>

                {/* Contextual affiliate CTAs */}
                {guide.affiliateCTAs.length > 0 && (
                  <div className="mt-10 p-6 rounded-2xl bg-ocean/6 border border-ocean/15">
                    <p className="text-sm font-700 text-ocean mb-1">Ready to plan your trip?</p>
                    <p className="text-xs text-mist mb-4">
                      Search flights, hotels, and transfers for {guide.destinationLabel}.
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {guide.affiliateCTAs.map((cta) => (
                        <Link
                          key={cta.type}
                          href={cta.href}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ocean text-white text-xs font-700 hover:bg-ocean-dark transition-colors"
                        >
                          {cta.label} <ArrowRight size={11} />
                        </Link>
                      ))}
                    </div>
                    <AffiliateDisclosure className="mt-3" />
                  </div>
                )}

                {/* Destination back-link */}
                {destEntry && countryEntry && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-[11px] font-700 text-mist uppercase tracking-wider mb-3">
                      Destination Guide
                    </p>
                    <Link
                      href={`/destinations/${countryEntry.slug}/${destEntry.slug}`}
                      className="inline-flex items-center gap-2 text-ocean font-700 text-sm hover:gap-3 transition-all"
                    >
                      {destEntry.name}, {destEntry.country} &mdash; {destEntry.tagline}
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>

              {/* ── Sidebar (desktop only) ───────────────────────────── */}
              <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
                <div className="sticky top-24 space-y-5">

                  {/* TOC */}
                  {guide.tocSections.length > 0 && (
                    <nav
                      aria-label="Table of contents"
                      className="bg-white rounded-2xl border border-gray-100 p-5"
                    >
                      <p className="text-[11px] font-700 uppercase tracking-wider text-ocean mb-3">
                        Contents
                      </p>
                      <ol className="space-y-1.5">
                        {guide.tocSections.map((section, i) => (
                          <li key={section.id}>
                            <a
                              href={`#${section.id}`}
                              className="flex items-start gap-2.5 text-sm text-ink hover:text-ocean transition-colors"
                            >
                              <span className="text-[11px] text-mist font-700 mt-0.5 shrink-0 w-4">
                                {i + 1}.
                              </span>
                              {section.heading}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}

                  {/* Affiliate CTA sidebar card */}
                  {guide.affiliateCTAs.length > 0 && (
                    <div className="bg-ink rounded-2xl p-5">
                      <p className="text-[11px] font-700 uppercase tracking-wider text-horizon/80 mb-2">
                        Plan Your Trip
                      </p>
                      <p className="text-white text-sm font-700 mb-4">{guide.destinationLabel}</p>
                      <div className="space-y-2">
                        {guide.affiliateCTAs.map((cta) => (
                          <Link
                            key={cta.type}
                            href={cta.href}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-700 hover:bg-white/20 transition-colors"
                          >
                            {cta.label} <ArrowRight size={11} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article info */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 text-xs text-mist space-y-2">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={12} />
                      <span>{guide.readingTimeMinutes} min read</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>Published {publishedDate}</span>
                    </div>
                    {updatedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>Updated {updatedDate}</span>
                      </div>
                    )}
                    <p className="pt-1 text-[11px]">
                      By {guide.author ?? 'Sunward Travel Editorial Team'}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ── Related Guides ─────────────────────────────────────────── */}
        {relatedGuides.length > 0 && (
          <section className="section-md bg-white border-t border-gray-100">
            <div className="page-container">
              <p className="text-[11px] text-ocean font-700 uppercase tracking-wider mb-6">Related Articles</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedGuides.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/guides/${related.slug}`}
                    className="group flex flex-col bg-sand rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={related.cardImage.src}
                        alt={related.cardImage.alt}
                        fill
                        sizes="(max-width:640px) 100vw, 33vw"
                        quality={70}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-[10px] text-coral font-700 uppercase tracking-wider mb-1.5">
                        {CATEGORY_LABELS[related.category]}
                      </span>
                      <h3 className="font-display font-700 text-ink text-sm leading-snug group-hover:text-ocean transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-mist text-xs mt-auto pt-2 flex items-center gap-1">
                        <Clock size={10} /> {related.readingTimeMinutes} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}
