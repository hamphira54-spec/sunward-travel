// components/news/NewsCard.tsx
// Reusable news article card — Server Component
// Variants: 'standard' (default), 'compact', 'featured'

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { NEWS_CATEGORY_LABELS } from '@/lib/content/news';
import type { TravelNews } from '@/lib/content/news';
import { formatNewsDate } from '@/lib/news';

interface NewsCardProps {
  news: TravelNews;
  variant?: 'standard' | 'compact' | 'featured';
}

export default function NewsCard({ news, variant = 'standard' }: NewsCardProps) {
  const categoryLabel = NEWS_CATEGORY_LABELS[news.category];
  const publishedAt = news.publication.publishedAt
    ? formatNewsDate(news.publication.publishedAt)
    : null;

  if (variant === 'featured') {
    return (
      <Link
        href={`/news/${news.slug}`}
        className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
      >
        {/* Image */}
        <div className="relative h-56 md:h-auto md:w-80 xl:w-96 shrink-0 overflow-hidden">
          <Image
            src={news.heroImage.src}
            alt={news.heroImage.alt}
            fill
            priority
            sizes="(max-width:768px) 100vw, 384px"
            quality={80}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {/* Content */}
        <div className="flex flex-col justify-center p-6 lg:p-8">
          <span className="inline-block px-2.5 py-1 rounded-full bg-ocean/8 text-ocean text-[10px] font-700 uppercase tracking-wider mb-3 w-fit">
            {categoryLabel}
          </span>
          <h2 className="font-display font-700 text-ink text-xl lg:text-2xl leading-tight group-hover:text-ocean transition-colors mb-3">
            {news.title}
          </h2>
          <p className="text-mist text-sm leading-relaxed mb-4 line-clamp-3">
            {news.excerpt}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-mist">
            {publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar size={11} />
                {publishedAt}
              </span>
            )}
            {news.readingTimeMinutes && (
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                {news.readingTimeMinutes} min read
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/news/${news.slug}`}
        className="group flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-sand/50 rounded-lg px-2 -mx-2 transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
          <Image
            src={news.heroImage.src}
            alt={news.heroImage.alt}
            fill
            sizes="80px"
            quality={60}
            className="object-cover"
          />
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-700 uppercase tracking-wider text-ocean">
            {categoryLabel}
          </span>
          <h3 className="font-display font-700 text-ink text-sm leading-snug group-hover:text-ocean transition-colors line-clamp-2 mt-0.5">
            {news.title}
          </h3>
          {publishedAt && (
            <p className="text-xs text-mist mt-1">{publishedAt}</p>
          )}
        </div>
      </Link>
    );
  }

  // Default: standard
  return (
    <Link
      href={`/news/${news.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={news.heroImage.src}
          alt={news.heroImage.alt}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          quality={75}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <span className="inline-block px-2.5 py-1 rounded-full bg-ocean/8 text-ocean text-[10px] font-700 uppercase tracking-wider mb-2.5 w-fit">
          {categoryLabel}
        </span>
        <h3 className="font-display font-700 text-ink text-base leading-snug group-hover:text-ocean transition-colors mb-2 line-clamp-2">
          {news.title}
        </h3>
        <p className="text-mist text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
          {news.excerpt}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-mist mt-auto pt-2 border-t border-gray-100">
          {publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar size={10} />
              {publishedAt}
            </span>
          )}
          {news.readingTimeMinutes && (
            <span className="flex items-center gap-1.5">
              <Clock size={10} />
              {news.readingTimeMinutes} min
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
