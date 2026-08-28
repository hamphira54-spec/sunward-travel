interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: 'left' | 'center';
  headingId?: string; // for aria-labelledby
  light?: boolean; // white text for dark backgrounds
}

export default function SectionHeading({ eyebrow, heading, subheading, align = 'center', headingId, light = false }: SectionHeadingProps) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {eyebrow && (
        <p className={`text-[11px] font-700 uppercase tracking-[0.2em] mb-3 ${
          light ? 'text-horizon/80' : 'text-ocean'
        }`}>
          {eyebrow}
        </p>
      )}
      <h2
        id={headingId}
        className={`font-display font-700 leading-tight ${
          light ? 'text-white' : 'text-ink'
        }`}
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
      >
        {heading}
      </h2>
      {subheading && (
        <p className={`mt-3 leading-relaxed max-w-2xl ${
          align === 'center' ? 'mx-auto' : ''
        } ${
          light ? 'text-white/60' : 'text-mist'
        }`} style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          {subheading}
        </p>
      )}
    </div>
  );
}
