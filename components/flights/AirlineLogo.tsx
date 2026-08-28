'use client';

import { useState } from 'react';
import { Plane } from 'lucide-react';

interface AirlineLogoProps {
  airline:     string;
  airlineName: string;
}

export default function AirlineLogo({ airline, airlineName }: AirlineLogoProps) {
  const [error, setError] = useState(false);

  // No IATA code available
  if (!airline) return <Plane size={18} className="text-ocean" />;

  // Image failed to load — fall back to IATA text badge
  if (error) {
    return (
      <span className="text-ocean text-xs font-700 leading-none">
        {airline}
      </span>
    );
  }

  // Load real airline logo from Travelpayouts CDN
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://pics.avs.io/40/40/${airline}.png`}
      alt={airlineName}
      width={40}
      height={40}
      className="object-contain"
      onError={() => setError(true)}
    />
  );
}
