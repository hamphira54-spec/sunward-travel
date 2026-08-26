interface StampBadgeProps {
  label: string;
  /** Rotation in degrees — gives the hand-stamped feel */
  rotate?: number;
  color?: 'ocean' | 'coral' | 'horizon' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const COLOR_CLASSES: Record<string, string> = {
  ocean:   'text-ocean border-ocean bg-ocean/8',
  coral:   'text-coral border-coral bg-coral/8',
  horizon: 'text-horizon-dark border-horizon bg-horizon/10',
  white:   'text-white border-white/70 bg-white/10',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'w-14 h-14 text-[0.55rem]',
  md: 'w-20 h-20 text-[0.65rem]',
  lg: 'w-24 h-24 text-[0.75rem]',
};

export default function StampBadge({
  label,
  rotate = -8,
  color = 'ocean',
  size = 'md',
  className = '',
}: StampBadgeProps) {
  return (
    <span
      className={`stamp-badge ${COLOR_CLASSES[color]} ${SIZE_CLASSES[size]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-label={label}
    >
      {label}
    </span>
  );
}
