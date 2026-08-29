import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { FEATURED_GUIDES, CATEGORY_LABELS } from '@/lib/guides';

export default function ArticlesPreview() {
  return (
    <section className="section-padding bg-surface" aria-labelledby="guides-heading">
      <div className="container-wide">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-coral text-sm font-semibold uppercase tracking-widest mb-2">Travel Guides</p>
              <h2 id="guides-heading" className="font-display font-700 text-3xl text-ink">
                Plan smarter, travel better
              </h2>
            </div>
            <Link
              href="/guides"
              className="flex items-center gap-1.5 text-ocean font-semibold text-sm hover:gap-2.5 transition-all shrink-0"
            >
              All guides <ArrowRight size={15} />
            </Link>
          </div>
        </ScrollReveal>

        {/* Article cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_GUIDES.map((guide, i) => (
            <ScrollReveal key={guide.slug} delay={i * 0.1}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-[var(--shadow-card)] card-hover"
                aria-label={guide.title}
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={guide.cardImage.src}
                    alt={guide.cardImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={70}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-coral text-white text-xs font-semibold">
                    {CATEGORY_LABELS[guide.category]}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-700 text-base text-ink leading-snug line-clamp-2 group-hover:text-ocean transition-colors">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm text-mist line-clamp-2 leading-relaxed">{guide.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-mist">
                    <span>{guide.destinationLabel}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {guide.readingTimeMinutes} min read
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
