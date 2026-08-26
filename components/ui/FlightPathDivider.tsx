import { Plane } from 'lucide-react';

interface FlightPathDividerProps {
  /** Label shown in the centre of the dashed line */
  label?: string;
  className?: string;
}

export default function FlightPathDivider({ label, className = '' }: FlightPathDividerProps) {
  return (
    <div className={`flex items-center gap-3 my-2 text-mist ${className}`} aria-hidden="true">
      {/* Left dashed line */}
      <div className="flex-1 h-px bg-[repeating-linear-gradient(to_right,currentColor_0px,currentColor_6px,transparent_6px,transparent_14px)] opacity-30" />

      {/* Centre icon + optional label */}
      <div className="flex items-center gap-2 text-xs font-medium text-mist/60 shrink-0">
        <Plane size={14} className="rotate-45 text-ocean/50" />
        {label && <span>{label}</span>}
      </div>

      {/* Right dashed line */}
      <div className="flex-1 h-px bg-[repeating-linear-gradient(to_right,currentColor_0px,currentColor_6px,transparent_6px,transparent_14px)] opacity-30" />
    </div>
  );
}
