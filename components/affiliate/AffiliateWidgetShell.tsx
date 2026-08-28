import { type ReactNode } from 'react';

interface AffiliateWidgetShellProps {
  heading: string;
  subheading?: string;
  attribution?: string; // e.g. 'Experiences provided by our travel partner'
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  background?: 'white' | 'sand' | 'transparent';
}

export default function AffiliateWidgetShell({
  heading,
  subheading,
  attribution,
  eyebrow,
  children,
  className = '',
  background = 'white',
}: AffiliateWidgetShellProps) {
  const bg = {
    white: 'bg-white',
    sand: 'bg-sand',
    transparent: 'bg-transparent',
  }[background];

  return (
    <div className={`${bg} ${className}`}>
      {/* Header */}
      <div className="mb-6">
        {eyebrow && (
          <p className="text-[11px] font-700 uppercase tracking-[0.2em] text-ocean mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display font-700 text-ink" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
          {heading}
        </h2>
        {subheading && (
          <p className="text-mist text-sm mt-1.5 leading-relaxed max-w-xl">{subheading}</p>
        )}
      </div>

      {/* Widget content */}
      <div className="relative">
        {children}
      </div>

      {/* Optional attribution */}
      {attribution && (
        <p className="mt-4 text-xs text-mist/60 text-center">{attribution}</p>
      )}
    </div>
  );
}
