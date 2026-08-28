import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/lib/destinations';

interface DestinationCardProps {
  destination: Destination;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
}

const HEIGHT = { sm: 'h-48', md: 'h-60', lg: 'h-72' };

export default function DestinationCard({ destination, href, size = 'md', priority = false }: DestinationCardProps) {
  const Wrapper = href ? Link : 'div';
  const props = href ? { href } : {};

  return (
    <Wrapper
      {...(props as { href: string })}
      className={`group relative ${HEIGHT[size]} rounded-2xl overflow-hidden block shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <Image
        src={destination.imageUrl}
        alt={destination.imageAlt}
        fill
        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        quality={70}
        priority={priority}
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
      {/* Badge */}
      <div className="absolute top-3 left-3">
        <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-700 uppercase tracking-wider border border-white/20">
          {destination.badge}
        </span>
      </div>
      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-display font-700 text-white text-lg leading-tight group-hover:text-horizon transition-colors">
          {destination.city}
        </p>
        <p className="text-white/60 text-xs mt-0.5">{destination.country}</p>
        <p className="text-white/50 text-[11px] mt-1.5 leading-snug line-clamp-2">
          {destination.tagline}
        </p>
      </div>
    </Wrapper>
  );
}
