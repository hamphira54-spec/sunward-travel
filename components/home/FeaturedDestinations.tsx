import TicketCard from '@/components/ui/TicketCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FlightPathDivider from '@/components/ui/FlightPathDivider';
import { FEATURED_DESTINATIONS } from '@/lib/destinations';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeaturedDestinations() {
  return (
    <section className="section-padding bg-sand" aria-labelledby="destinations-heading">
      <div className="container-wide">
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-ocean text-sm font-semibold uppercase tracking-widest mb-3">
              Featured Destinations
            </p>
            <h2
              id="destinations-heading"
              className="font-display font-700 text-3xl sm:text-4xl text-ink"
            >
              Where will you go next?
            </h2>
            <FlightPathDivider className="mt-4 mb-0" />
            <p className="mt-4 text-mist leading-relaxed">
              From cherry blossoms in Tokyo to caldera sunsets in Santorini — explore our handpicked destinations across every continent.
            </p>
          </div>
        </ScrollReveal>

        {/* Destination grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_DESTINATIONS.map((destination, i) => (
            <ScrollReveal key={destination.id} delay={i * 0.07}>
              <TicketCard destination={destination} />
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.3} className="text-center mt-10">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-ocean font-semibold text-sm hover:gap-3 transition-all"
          >
            View all destinations
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
