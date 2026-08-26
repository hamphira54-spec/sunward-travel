import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Sun, Globe, Shield, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Sunward Travel — our mission to help travelers worldwide find the best flights, hotels, and experiences at the best prices.',
};

const VALUES = [
  {
    icon: Globe,
    title: 'Worldwide perspective',
    description:
      'We cover every major destination across all continents — not just the popular Western circuits. Every traveller deserves great deals.',
  },
  {
    icon: Shield,
    title: 'Transparent and honest',
    description:
      'We clearly disclose all affiliate relationships. Our editorial recommendations are independent and never influenced by commercial arrangements.',
  },
  {
    icon: Heart,
    title: 'Free, always',
    description:
      'Sunward Travel is completely free to use. We earn small commissions when you book through our partner links — at no extra cost to you.',
  },
  {
    icon: Sun,
    title: 'Built for real travellers',
    description:
      'Our team are frequent travellers ourselves. Every piece of advice we publish is based on real experience, not marketing copy.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=80"
          alt="World map with travel pins and passport on a wooden desk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 to-ink/70" />
        <div className="absolute inset-0 flex items-center container-wide">
          <div>
            <h1 className="font-display font-700 text-4xl sm:text-5xl text-white">About Us</h1>
            <p className="text-white/70 mt-2">The team behind Sunward Travel</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-sand">
        <div className="container-wide max-w-3xl">
          <ScrollReveal>
            <p className="text-ocean text-sm font-semibold uppercase tracking-widest mb-4">Our mission</p>
            <h2 className="font-display font-700 text-3xl text-ink leading-snug">
              Making the world more accessible, one trip at a time
            </h2>
            <p className="mt-5 text-mist leading-relaxed text-lg">
              Sunward Travel was built on a simple belief: finding great travel deals shouldn&apos;t require spending hours across a dozen different websites. We bring flights, hotels, car rentals, and cruises together in one place — and help you understand not just the price, but the value.
            </p>
            <p className="mt-4 text-mist leading-relaxed">
              We partner with the world&apos;s leading travel brands — airlines, hotel groups, and booking platforms — and earn a small commission when you book through our links. This keeps Sunward Travel completely free for you, with no hidden fees, no markups, and no booking charges of our own.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-surface" aria-labelledby="values-heading">
        <div className="container-wide">
          <ScrollReveal className="text-center mb-12">
            <h2 id="values-heading" className="font-display font-700 text-2xl sm:text-3xl text-ink">
              What we stand for
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {VALUES.map(({ icon: Icon, title, description }, i) => (
              <ScrollReveal key={title} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-6 shadow-[var(--shadow-card)]">
                  <div className="w-10 h-10 rounded-lg bg-ocean/10 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-ocean" />
                  </div>
                  <h3 className="font-display font-700 text-base text-ink mb-2">{title}</h3>
                  <p className="text-sm text-mist leading-relaxed">{description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate disclosure note */}
      <section className="py-10 bg-sand border-t border-surface">
        <div className="container-wide max-w-2xl text-center">
          <ScrollReveal>
            <p className="text-sm text-mist leading-relaxed">
              Sunward Travel participates in affiliate marketing programs with travel partners worldwide. When you make a booking through links on our site, we may receive a commission — at no additional cost to you. For full details, read our{' '}
              <Link href="/affiliate-disclosure" className="text-ocean underline">
                Affiliate Disclosure
              </Link>
              .
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
