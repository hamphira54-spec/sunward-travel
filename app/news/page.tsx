import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getAllPublishedNews, getFeaturedNews } from '@/lib/content/repository';
import NewsCard from '@/components/news/NewsCard';
import NewsCategoryFilter from '@/components/news/NewsCategoryFilter';
import NewsletterSignup from '@/components/home/NewsletterSignup';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunward-travel.vercel.app';

export const metadata: Metadata = {
  title: 'Travel News — Aviation, Destinations & Industry Updates | Sunward Travel',
  description:
    'Stay informed with Sunward Travel\u2019s editorial coverage of aviation news, destination updates, hotel industry developments, transportation trends, and global travel stories.',
  alternates: {
    canonical: `${SITE_URL}/news`,
  },
  openGraph: {
    title: 'Travel News | Sunward Travel',
    description:
      'Aviation news, destination updates, hotel industry developments, and global travel stories from the Sunward Travel editorial team.',
    url: `${SITE_URL}/news`,
    type: 'website',
  },
};

function FilterFallback() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 w-20 bg-surface rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="h-48 bg-surface" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-surface rounded" />
              <div className="h-4 bg-surface rounded" />
              <div className="h-3 bg-surface rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function NewsPage() {
  const allNews = await getAllPublishedNews();
  const featuredNews = await getFeaturedNews(1);
  const featuredArticle = featuredNews[0] ?? null;

  return (
    <>
      {/* ── Editorial Hero ─────────────────────────────────────────────── */}
      <div className="bg-earth-deep pt-24 pb-14">
        <div className="page-container">
          <p className="text-[11px] font-700 uppercase tracking-widest text-horizon/80 mb-4">
            Editorial
          </p>
          <h1
            className="font-display font-700 text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Travel News
          </h1>
          <p className="text-white/60 leading-relaxed max-w-xl" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
            Aviation, destinations, hotels, transportation, border updates &amp;
            travel industry stories — from the Sunward Travel editorial team.
          </p>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="bg-sand min-h-screen">
        <div className="page-container py-12">

          {/* Featured story */}
          {featuredArticle && (
            <div className="mb-12">
              <p className="text-[11px] font-700 uppercase tracking-wider text-ocean mb-5">
                Featured Story
              </p>
              <NewsCard news={featuredArticle} variant="featured" />
            </div>
          )}

          {/* Latest stories + category filter */}
          {allNews.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] font-700 uppercase tracking-wider text-ocean">
                Latest Stories
              </p>
            </div>
          )}

          {/* Client-side category filter + news grid */}
          <Suspense fallback={<FilterFallback />}>
            <NewsCategoryFilter allNews={allNews} />
          </Suspense>

        </div>
      </div>

      {/* ── Newsletter ──────────────────────────────────────────────────── */}
      {allNews.length > 0 && <NewsletterSignup />}
    </>
  );
}
