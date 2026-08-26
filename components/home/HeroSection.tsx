import Image from 'next/image';
import BookingSearch from '@/components/booking/BookingSearch';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero — search flights, hotels and more"
    >
      {/* Background image — tropical beach / mountain / city mix */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85"
        alt="Mountain lake with crystal clear turquoise water reflecting snow-capped peaks"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 container-wide w-full pt-24 pb-16 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-horizon animate-pulse" />
          Comparing deals from 500+ airlines &amp; hotels worldwide
        </div>

        {/* Headline */}
        <h1 className="font-display font-700 text-4xl sm:text-5xl lg:text-6xl text-white leading-tight max-w-3xl">
          Wherever the{' '}
          <span className="text-horizon">Sun</span>{' '}
          Takes You
        </h1>

        <p className="mt-4 text-lg text-white/75 max-w-xl leading-relaxed">
          Search flights, hotels, and car rentals worldwide — then book directly with the best deals from our trusted partners.
        </p>

        {/* Booking search widget */}
        <div className="mt-10 w-full max-w-3xl">
          <BookingSearch defaultTab="flights" />
        </div>

        {/* Trust stats */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10">
          {[
            { value: '500+', label: 'Partner Airlines' },
            { value: '1M+', label: 'Properties Worldwide' },
            { value: 'Free', label: 'Always Free to Search' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display font-700 text-2xl text-white">{value}</p>
              <p className="text-xs text-white/60 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce" aria-hidden="true">
        <span className="text-xs">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
