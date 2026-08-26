import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { SAMPLE_GUIDES } from '@/lib/destinations';

export default function ArticlesPreview() {
  return (
    <section className="section-padding bg-surface" aria-labelledby="guides-heading">
      <div className="container-wide">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-coral text-sm font-semibold uppercase tracking-widest mb-2">
                Travel Guides
              </p>
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
          {SAMPLE_GUIDES.map((article, i) => (
            <ScrollReveal key={article.slug} delay={i * 0.1}>
              <Link
                href={`/guides/${article.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-[var(--shadow-card)] card-hover"
                aria-label={article.title}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-coral text-white text-xs font-semibold">
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display font-700 text-base text-ink leading-snug line-clamp-2 group-hover:text-ocean transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-mist line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-mist">
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} />
                      {article.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {article.readTime}
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
