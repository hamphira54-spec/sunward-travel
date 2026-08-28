import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import HowItWorks from '@/components/home/HowItWorks';
import ArticlesPreview from '@/components/home/ArticlesPreview';
import NewsletterSignup from '@/components/home/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Sunward Travel — Wherever the Sun Takes You',
  description:
    'Compare flights, hotels, car rentals, and cruises worldwide. Find the best travel deals and plan unforgettable trips with Sunward Travel.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedDestinations />
      <HowItWorks />
      <ArticlesPreview />
      <NewsletterSignup />
    </>
  );
}
