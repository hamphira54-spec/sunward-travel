import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import ArticlesPreview from '@/components/home/ArticlesPreview';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import AffiliateWidgetShell from '@/components/affiliate/AffiliateWidgetShell';
import SectionHeading from '@/components/ui/SectionHeading';
import { DESTINATIONS } from '@/lib/destinations-v2';
import {
  Plane, Hotel, Compass, MapPin, Car,
  Waves, Landmark, Utensils, Mountain, Users, TreePine,
  ArrowRight, Newspaper
} from 'lucide-react';
import { getRecentNews, getUpcomingEvents } from '@/lib/content/repository';
import NewsCard from '@/components/news/NewsCard';
import { EventCard } from '@/components/events/EventCard';

export const metadata: Metadata = {
  title: 'Sunward Travel — Compare Flights, Hotels & Experiences Worldwide',
  description:
    'Compare flights, hotels, airport transfers, and activities worldwide. Find the best travel deals and plan your next adventure with Sunward Travel.',
};

const REVIEWS_WIDGET_SRC =
  'https://tpwdg.com/content' +
  '?currency=USD&trs=566794&shmarker=769903&locale=en' +
  '&powered_by=true&show_logo=true&limit=10' +
  '&bg_color=%23FBF8F4' +
  '&font_color=%231A2631' +
  '&stars_color=%23E5E0DA' +
  '&stars_active_color=%23F2C04A' +
  '&dots_color=%236B8A99' +
  '&loader_color=%23F2C04A' +
  '&arrows_color=%236B8A99' +
  '&autoscroll=false&autoscroll_delay=5000' +
  '&promo_id=2948&campaign_id=1';

const SERVICES = [
  { label: 'Flights',           href: '/flights',           icon: Plane,    desc: 'Compare 1,000+ airlines',         bg: 'bg-ocean/8 hover:bg-ocean/15',   fg: 'text-ocean' },
  { label: 'Hotels',            href: '/hotels',            icon: Hotel,    desc: 'Find the perfect stay',            bg: 'bg-horizon/15 hover:bg-horizon/25', fg: 'text-ink' },
  { label: 'Things to Do',      href: '/activities',        icon: Compass,  desc: 'Tours, activities & experiences',  bg: 'bg-coral/8 hover:bg-coral/15',   fg: 'text-coral' },
  { label: 'Airport Transfers', href: '/airport-transfers', icon: MapPin,   desc: 'Fixed-price private transfers',    bg: 'bg-ocean/8 hover:bg-ocean/15',   fg: 'text-ocean' },
  { label: 'Car Rental',        href: '/cars',              icon: Car,      desc: 'Compare rental car deals',         bg: 'bg-surface hover:bg-surface-dark', fg: 'text-ink' },
];

const EXPERIENCES = [
  { label: 'Beach Escapes',  icon: Waves,    href: '/destinations', grad: 'from-blue-600 to-cyan-500' },
  { label: 'City Breaks',    icon: Landmark, href: '/destinations', grad: 'from-slate-700 to-slate-500' },
  { label: 'Nature & Parks', icon: TreePine, href: '/destinations', grad: 'from-green-700 to-emerald-500' },
  { label: 'Food & Flavour', icon: Utensils, href: '/activities',   grad: 'from-orange-600 to-amber-500' },
  { label: 'Adventure',      icon: Mountain, href: '/destinations', grad: 'from-stone-700 to-stone-500' },
  { label: 'Family Travel',  icon: Users,    href: '/guides',       grad: 'from-ocean to-ocean-light' },
];

// Show 6 featured destinations from the Phase E destination engine.
// All hrefs are real pages — no broken fallback links.
const HOMEPAGE_DESTINATIONS = DESTINATIONS.filter((d) =>
  ['bangkok', 'bali', 'tokyo', 'siem-reap', 'singapore', 'phuket'].includes(d.slug)
);

function HomeEventsSection() {
  const upcomingEvents = getUpcomingEvents(4);
  if (upcomingEvents.length === 0) return null;

  return (
    <section className="section-lg bg-surface border-t border-gray-100">
      <div className="page-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-700 uppercase tracking-widest text-ocean mb-2">Global Events</p>
            <h2 className="font-display font-700 text-ink" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              What&apos;s Happening Around the World
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-1.5 text-ocean text-sm font-700 hover:gap-2.5 transition-all shrink-0 mb-1"
          >
            All events <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {upcomingEvents.map((event) => (
            <EventCard key={event.slug} event={event} variant="compact" />
          ))}
        </div>
        <div className="text-center mt-6 sm:hidden">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-ocean text-sm font-700">
            View all events <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomeNewsSection() {
  const latestNews = getRecentNews(4);
  if (latestNews.length === 0) return null;

  return (
    <section className="section-lg bg-white border-t border-gray-100">
      <div className="page-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-700 uppercase tracking-widest text-ocean mb-2">Editorial</p>
            <h2 className="font-display font-700 text-ink" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Latest Travel News
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden sm:flex items-center gap-1.5 text-ocean text-sm font-700 hover:gap-2.5 transition-all shrink-0 mb-1"
          >
            All stories <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latestNews.map((article) => (
            <NewsCard key={article.slug} news={article} variant="standard" />
          ))}
        </div>
        <div className="text-center mt-6 sm:hidden">
          <Link href="/news" className="inline-flex items-center gap-1.5 text-ocean text-sm font-700">
            All travel stories <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Service Selector */}
      <section className="section-md bg-white border-b border-gray-100">
        <div className="page-container">
          <SectionHeading
            eyebrow="What are you planning?"
            heading="All your travel, one place"
            subheading="Flights, hotels, transfers, activities — compare and book through trusted travel partners worldwide."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {SERVICES.map((svc) => (
              <Link
                key={svc.label}
                href={svc.href}
                className={`flex flex-col items-center text-center gap-3 p-5 rounded-2xl transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm ${svc.bg}`}
              >
                <svc.icon size={28} strokeWidth={1.6} className={svc.fg} />
                <div>
                  <p className={`font-display font-700 text-sm ${svc.fg}`}>{svc.label}</p>
                  <p className="text-[11px] text-mist mt-0.5 leading-snug">{svc.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section-lg bg-sand">
        <div className="page-container">
          <div className="flex items-end justify-between mb-10">
            <SectionHeading
              eyebrow="Popular Destinations"
              heading="Where will you go next?"
              align="left"
            />
            <Link
              href="/destinations"
              className="hidden sm:flex items-center gap-1.5 text-ocean text-sm font-700 hover:gap-2.5 transition-all shrink-0 mb-10"
            >
              All destinations <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOMEPAGE_DESTINATIONS.map((dest, i) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.countrySlug}/${dest.slug}`}
                className="group relative h-60 rounded-2xl overflow-hidden block shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Image
                  src={dest.cardImage.src}
                  alt={dest.cardImage.alt}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  quality={70}
                  priority={i < 3}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-700 uppercase tracking-wider border border-white/20">
                    {dest.badge}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display font-700 text-white text-lg leading-tight group-hover:text-horizon transition-colors">
                    {dest.name}
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">{dest.country}</p>
                  <p className="text-white/50 text-[11px] mt-1.5 leading-snug line-clamp-2">
                    {dest.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Link href="/destinations" className="inline-flex items-center gap-1.5 text-ocean text-sm font-700">
              View all destinations <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* Traveller Reviews */}
      <section className="section-md bg-white border-t border-b border-gray-100">
        <div className="page-container">
          <AffiliateWidgetShell
            eyebrow="Traveller Reviews"
            heading="Trusted by Travellers Worldwide"
            subheading="Real reviews from travellers who booked airport transfers with our partner."
            attribution="Reviews sourced from Kiwitaxi."
          >
            <TravelpayoutsWidget src={REVIEWS_WIDGET_SRC} skeletonHeight={280} timeout={12000} />
          </AffiliateWidgetShell>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Explore by Experience */}
      <section className="section-md bg-sand border-t border-gray-100">
        <div className="page-container">
          <SectionHeading
            eyebrow="Explore by Experience"
            heading="Find your kind of adventure"
            subheading="Whether you want to relax on a beach, explore ancient landmarks, or sample local cuisine — we help you get there."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {EXPERIENCES.map((exp) => (
              <Link
                key={exp.label}
                href={exp.href}
                className="group relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 text-center shadow-sm hover:shadow-md transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${exp.grad} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <exp.icon size={26} className="text-white" strokeWidth={1.6} />
                  <p className="font-display font-700 text-white text-xs leading-snug px-2">{exp.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Guides */}
      <ArticlesPreview />

      {/* Global Events */}
      <HomeEventsSection />

      {/* Latest Travel News — only renders when published news exists */}
      <HomeNewsSection />

      {/* Newsletter */}
      <NewsletterSignup />
    </>
  );
}
