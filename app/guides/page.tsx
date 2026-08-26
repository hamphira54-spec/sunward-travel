import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { SAMPLE_GUIDES } from '@/lib/destinations';

export const metadata: Metadata = {
  title: 'Travel Guides & Tips',
  description:
    'Expert travel guides, destination tips, and money-saving advice — from best time to visit to how to find cheap flights.',
};

export default function GuidesIndexPage() {
  return (
    <div className="pt-24 pb-20 bg-sand min-h-screen">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="text-coral text-sm font-semibold uppercase tracking-widest mb-3">Travel Guides</p>
          <h1 className="font-display font-700 text-4xl sm:text-5xl text-ink">
            Plan smarter, travel better
          </h1>
          <p className="mt-4 text-mist leading-relaxed text-lg">
            Expert advice on destinations, booking strategy, packing, and making the most of every trip — wherever the sun takes you.
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_GUIDES.map((guide, i) => (
            <ScrollReveal key={guide.slug} delay={i * 0.1}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-[var(--shadow-card)] card-hover"
                aria-label={guide.title}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={guide.imageUrl.replace('w=600', 'w=800')}
                    alt={guide.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-coral text-white text-xs font-semibold">
                    {guide.category}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-display font-700 text-base text-ink leading-snug line-clamp-2 group-hover:text-ocean transition-colors">
                    {guide.title}
                  </h2>
                  <p className="mt-2 text-sm text-mist line-clamp-2 leading-relaxed">{guide.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-mist">
                    <span className="flex items-center gap-1"><BookOpen size={11} />{guide.destination}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{guide.readTime}</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* More articles coming soon */}
        <ScrollReveal delay={0.3} className="mt-16 text-center">
          <div className="bg-ocean/5 rounded-2xl p-8 border border-ocean/10 max-w-xl mx-auto">
            <h2 className="font-display font-700 text-xl text-ink mb-2">More guides coming soon</h2>
            <p className="text-sm text-mist mb-5">
              Subscribe to our newsletter to get new destination guides, deal alerts, and travel tips first.
            </p>
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-ocean text-white text-sm font-700 hover:bg-ocean-dark transition-colors"
            >
              Get notified
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
