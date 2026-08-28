import Image from 'next/image';
import { type ReactNode } from 'react';

interface TravelHeroProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  height?: 'sm' | 'md' | 'lg';
  children?: ReactNode; // optional search card or CTA below the text
  overlayStrength?: 'light' | 'medium' | 'strong';
}

const HEIGHT_CLASSES = {
  sm: 'h-[300px] sm:h-[360px]',
  md: 'h-[380px] sm:h-[440px]',
  lg: 'h-[480px] sm:h-[560px]',
};

const OVERLAY = {
  light: 'from-ink/10 via-ink/35 to-ink/80',
  medium: 'from-ink/20 via-ink/50 to-ink/90',
  strong: 'from-ink/30 via-ink/60 to-ink/95',
};

export default function TravelHero({
  imageSrc,
  imageAlt,
  eyebrow,
  heading,
  description,
  height = 'md',
  children,
  overlayStrength = 'medium',
}: TravelHeroProps) {
  return (
    <section className={`relative ${HEIGHT_CLASSES[height]} overflow-hidden`}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        quality={80}
        className="object-cover object-center scale-[1.03]"
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${OVERLAY[overlayStrength]}`} />

      {/* Text block — positioned in lower third */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-10">
        <div className="page-container">
          {eyebrow && (
            <p className="text-[11px] text-horizon/90 uppercase tracking-[0.2em] font-700 mb-2">
              {eyebrow}
            </p>
          )}
          <h1
            className="font-display font-700 text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            {heading}
          </h1>
          {description && (
            <p className="mt-3 text-white/75 max-w-xl leading-relaxed"
               style={{ fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)' }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {children && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {children}
        </div>
      )}
    </section>
  );
}
