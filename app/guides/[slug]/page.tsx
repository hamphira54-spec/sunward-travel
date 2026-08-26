import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import { SAMPLE_GUIDES, DESTINATION_MAP } from '@/lib/destinations';

// Static params for sample articles
export function generateStaticParams() {
  return SAMPLE_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = SAMPLE_GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: 'Guide Not Found' };
  return {
    title: guide.title,
    description: guide.excerpt,
  };
}

// Sample article content — replace with CMS/MDX in production
const ARTICLE_CONTENT: Record<string, React.ReactNode> = {
  'best-time-to-visit-bali': (
    <>
      <p>
        Bali&apos;s tropical climate means it&apos;s warm year-round — but the difference between dry season and wet season shapes your experience dramatically. Here&apos;s a month-by-month breakdown so you can plan the perfect trip.
      </p>
      <h2>Dry Season: May – September (Best Overall)</h2>
      <p>
        This is Bali&apos;s most popular time to visit — and for good reason. Days are reliably sunny, humidity is lower, and the ocean is calm and clear for snorkelling and diving around Nusa Penida. Expect busy beaches in Seminyak and Kuta, higher accommodation rates, and rice terraces at their most photogenic as the harvest season approaches.
      </p>
      <h2>Shoulder Season: April and October</h2>
      <p>
        These transitional months offer a sweet spot: decent weather, lower prices than peak season, and fewer crowds. April still sees occasional showers; October can bring the first rains of the wet season but often stays dry through mid-month.
      </p>
      <h2>Wet Season: November – March</h2>
      <p>
        Rain doesn&apos;t mean staying indoors — Bali&apos;s wet season typically brings short, intense afternoon downpours rather than all-day rain. The island turns impossibly lush and green, hotel rates drop significantly, and the spiritual calendar peaks with major temple ceremonies around the Balinese New Year (Nyepi) in March.
      </p>
      <h2>Special Events Worth Planning Around</h2>
      <ul>
        <li><strong>Nyepi (March)</strong> — The Balinese Day of Silence. The entire island shuts down for 24 hours. A profound, unique experience.</li>
        <li><strong>Galungan &amp; Kuningan</strong> — A 10-day festival celebrating ancestral spirits. Villages are decorated with penjor bamboo poles.</li>
        <li><strong>Bali Arts Festival (June–July)</strong> — Month-long celebration of Balinese culture, dance, and music in Denpasar.</li>
      </ul>
      <h2>Our Recommendation</h2>
      <p>
        For first-time visitors: aim for <strong>May or September</strong> — you get dry-season reliability at slightly lower prices than July–August peak. Experienced travellers who want Bali&apos;s soul over its Instagram moments should consider January for the festivals and dramatically lower costs.
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
  const guide = SAMPLE_GUIDES.find((g) => g.slug === slug);

  if (!guide) notFound();

  const destination = DESTINATION_MAP[
    Object.keys(DESTINATION_MAP).find((k) => guide.destination.toLowerCase().includes(k.split('-')[0])) ?? ''
  ];

  const content = ARTICLE_CONTENT[slug];

  return (
    <article className="pt-16">
      {/* Article hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <Image
          src={guide.imageUrl.replace('w=600', 'w=1400')}
          alt={guide.imageAlt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        {/* Back link */}
        <Link
          href="/guides"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          All guides
        </Link>
        {/* Category */}
        <div className="absolute top-6 right-6">
          <span className="px-3 py-1.5 rounded-full bg-coral text-white text-xs font-semibold">
            {guide.category}
          </span>
        </div>
      </div>

      {/* Article meta + body */}
      <div className="container-wide max-w-3xl py-10">
        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-xs text-mist mb-4">
          <span className="flex items-center gap-1"><MapPin size={12} />{guide.destination}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{guide.readTime}</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(guide.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink leading-tight mb-6">
          {guide.title}
        </h1>

        {/* Article body */}
        <div className="prose-styles">
          {content ?? (
            <div className="bg-surface rounded-xl p-8 text-center text-mist">
              <p className="font-medium">Full article content coming soon.</p>
              <p className="text-sm mt-1">{guide.excerpt}</p>
            </div>
          )}
        </div>

        {/* ╔══ AFFILIATE LINK ZONE ══╗
            Insert contextual affiliate links here for each article.
            Example: Travelpayouts flight search deep-link, Booking.com hotel search link.
            Use tracked URLs with your affiliate marker/token.
            ╚═══════════════════════╝ */}
        <div className="mt-10 p-5 rounded-xl bg-ocean/6 border border-ocean/15">
          <p className="text-sm font-semibold text-ocean mb-2">Ready to plan your trip?</p>
          <p className="text-xs text-mist mb-4">
            Search flights, hotels, and activities for {guide.destination} — all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/flights"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ocean text-white text-xs font-semibold hover:bg-ocean-dark transition-colors"
            >
              Search Flights <ExternalLink size={11} />
            </Link>
            <Link
              href="/hotels"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-ocean text-ocean text-xs font-semibold hover:bg-ocean/5 transition-colors"
            >
              Find Hotels <ExternalLink size={11} />
            </Link>
          </div>
          <p className="text-[10px] text-mist/60 mt-3">
            Affiliate links — we may earn a commission.{' '}
            <Link href="/affiliate-disclosure" className="underline">Learn more</Link>
          </p>
        </div>

        {/* Related destination */}
        {destination && (
          <div className="mt-8 pt-8 border-t border-surface">
            <p className="text-xs font-semibold text-mist uppercase tracking-widest mb-3">Related destination</p>
            <Link
              href={`/guides/${destination.slug}`}
              className="text-ocean font-medium hover:underline"
            >
              {destination.city}, {destination.country} — {destination.tagline}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
