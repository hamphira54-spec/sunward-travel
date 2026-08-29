'use client';
// components/news/NewsCategoryFilter.tsx
// Client component: category filter pills + filtered news grid
// Reads/writes URL search params for bookmarkable filter state

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { NEWS_CATEGORY_LABELS } from '@/lib/content/news';
import type { TravelNews, NewsCategory } from '@/lib/content/news';
import NewsCard from '@/components/news/NewsCard';
import { Newspaper } from 'lucide-react';
import Link from 'next/link';

interface NewsCategoryFilterProps {
  allNews: TravelNews[];
}

const ALL_CATEGORIES = Object.keys(NEWS_CATEGORY_LABELS) as NewsCategory[];

export default function NewsCategoryFilter({ allNews }: NewsCategoryFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeCategory = searchParams.get('category') as NewsCategory | null;

  const filteredNews = activeCategory
    ? allNews.filter((n) => n.category === activeCategory)
    : allNews;

  // Only show categories that have at least one article
  const availableCategories = ALL_CATEGORIES.filter((cat) =>
    allNews.some((n) => n.category === cat)
  );

  function setCategory(category: NewsCategory | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      {/* Category filter pills — only rendered when categories exist */}
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter news by category">
          <button
            role="tab"
            aria-selected={!activeCategory}
            onClick={() => setCategory(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-700 transition-colors ${
              !activeCategory
                ? 'bg-interactive text-white'
                : 'bg-surface text-ink hover:bg-surface-dark'
            }`}
          >
            All
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-700 transition-colors ${
                activeCategory === cat
                  ? 'bg-interactive text-white'
                  : 'bg-surface text-ink hover:bg-surface-dark'
              }`}
            >
              {NEWS_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* News grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((article) => (
            <NewsCard key={article.slug} news={article} variant="standard" />
          ))}
        </div>
      ) : (
        /* Empty state for filtered result */
        <div className="py-16 text-center">
          <p className="text-mist text-sm mb-4">
            No articles in this category yet.
          </p>
          <button
            onClick={() => setCategory(null)}
            className="text-ocean text-sm font-700 hover:underline"
          >
            View all stories
          </button>
        </div>
      )}

      {/* Global empty state — when there is NO news at all */}
      {allNews.length === 0 && (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-ocean/8 flex items-center justify-center mx-auto mb-5">
            <Newspaper size={24} className="text-ocean" strokeWidth={1.6} />
          </div>
          <h2 className="font-display font-700 text-ink text-xl mb-3">
            Travel stories are on the way
          </h2>
          <p className="text-mist text-sm leading-relaxed mb-6">
            Our editorial team is working on in-depth travel analysis,
            destination news, and aviation updates. Check back soon.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/destinations"
              className="px-4 py-2 rounded-xl bg-surface text-ink text-sm font-700 hover:bg-surface-dark transition-colors"
            >
              Explore Destinations
            </Link>
            <Link
              href="/guides"
              className="px-4 py-2 rounded-xl bg-surface text-ink text-sm font-700 hover:bg-surface-dark transition-colors"
            >
              Travel Guides
            </Link>
            <Link
              href="/flights"
              className="px-4 py-2 rounded-xl bg-interactive text-white text-sm font-700 hover:bg-interactive-dark transition-colors"
            >
              Search Flights
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
