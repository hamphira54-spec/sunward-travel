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

// ── Kiwitaxi Reviews Widget (styled to match Sunward Travel brand) ────────
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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDestinations />
      
      {/* ── Transfer Reviews (Kiwitaxi) ── */}
      <section className="py-16 bg-sand border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="font-display font-700 text-3xl text-ink">Trusted by Travellers Worldwide</h2>
            <p className="text-mist mt-2 max-w-2xl mx-auto">
              Read real reviews from our customers who booked airport transfers with our partner Kiwitaxi.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <TravelpayoutsWidget src={REVIEWS_WIDGET_SRC} />
          </div>
        </div>
      </section>

      <HowItWorks />
      <ArticlesPreview />
      <NewsletterSignup />
    </>
  );
}
