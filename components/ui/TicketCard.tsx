import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import StampBadge from './StampBadge';
import type { Destination } from '@/lib/destinations';

interface TicketCardProps {
  destination: Destination;
  className?: string;
}

const BADGE_ROTATIONS = [-10, 6, -6, 9, -8, 5];

export default function TicketCard({ destination, className = '' }: TicketCardProps) {
  const rotateIndex = destination.id.length % BADGE_ROTATIONS.length;
  const badgeRotate = BADGE_ROTATIONS[rotateIndex];

  return (
    <Link
      href={`/guides/${destination.slug}`}
      className={`group block rounded-xl overflow-hidden bg-white shadow-[var(--shadow-card)] card-hover focus-visible:outline-2 focus-visible:outline-ocean ${className}`}
      aria-label={`Explore ${destination.city}, ${destination.country}`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={destination.imageUrl}
          alt={destination.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        {/* Stamp badge overlay */}
        <div className="absolute top-3 right-3">
          <StampBadge
            label={destination.badge}
            rotate={badgeRotate}
            color={destination.badgeColor}
            size="sm"
          />
        </div>
        {/* Gradient fade to card body */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Perforated divider */}
      <div className="ticket-edge relative h-2 bg-white" />

      {/* Content */}
      <div className="px-5 pb-5 pt-3 bg-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-700 text-ink leading-tight">
              {destination.city}
            </h3>
            <p className="flex items-center gap-1 text-xs text-mist mt-0.5">
              <MapPin size={11} />
              {destination.country} &middot; {destination.continent}
            </p>
          </div>
        </div>

        <p className="mt-2 text-sm text-mist leading-snug line-clamp-2">
          {destination.tagline}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-ocean">
            <Clock size={11} />
            Best: {destination.bestTime.split(' (')[0]}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-ocean group-hover:gap-2 transition-all">
            Explore
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
