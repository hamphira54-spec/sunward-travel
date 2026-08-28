import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import HowItWorks from '@/components/home/HowItWorks';
import ArticlesPreview from '@/components/home/ArticlesPreview';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';

export const metadata: Metadata = {
  title: 'Sunward Travel — Wherever the Sun Takes You',
  description:
    'Compare flights, hotels, car rentals, and cruises worldwide. Find the best travel deals and plan unforgettable trips with Sunward Travel.',
};

// Popular Routes widget — brand colours
const POPULAR_ROUTES_SRC =
  'https://tpwdg.com/content' +
  '?currency=usd&trs=566794&shmarker=769903' +
  '&target_host=sunward-travel.vercel.app%2Fflights' +
  '&locale=en&limit=6&powered_by=true' +
  '&primary=%230D6E7A' +
  '&promo_id=4044&campaign_id=100';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDestinations />

      {/* Popular Routes widget */}
      <section className="py-14 bg-sand">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="font-display font-700 text-2xl text-ink">Popular Routes</h2>
            <p className="text-mist text-sm mt-1">Cheapest fares to top destinations right now</p>
          </div>
          <TravelpayoutsWidget src={POPULAR_ROUTES_SRC} />
        </div>
      </section>

      <HowItWorks />
      <ArticlesPreview />
      <NewsletterSignup />
    </>
  );
}
