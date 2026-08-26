import Image from 'next/image';
import type { BookingTab } from '@/components/booking/adapters/types';

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  tab: BookingTab;
}

export default function CategoryHero({
  title,
  subtitle,
  imageUrl,
  imageAlt,
}: CategoryHeroProps) {
  return (
    <section className="relative h-72 sm:h-88 flex items-end overflow-hidden" aria-label={`${title} hero`}>
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        quality={80}
        className="object-cover object-center"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/75" />

      {/* Text */}
      <div className="relative z-10 container-wide pb-10 pt-24">
        <h1 className="font-display font-700 text-3xl sm:text-5xl text-white leading-tight">
          {title}
        </h1>
        <p className="mt-2 text-white/70 text-base max-w-xl">{subtitle}</p>
      </div>
    </section>
  );
}
