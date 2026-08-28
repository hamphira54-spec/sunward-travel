import Link from 'next/link';
import { Plane, Hotel, Compass, MapPin, Car } from 'lucide-react';
import type { DestinationEntry } from '@/lib/destinations-v2';

interface TravelServiceLinksProps {
  destination: DestinationEntry;
  className?: string;
  size?: 'sm' | 'md';
}

export default function TravelServiceLinks({ destination, className = '', size = 'md' }: TravelServiceLinksProps) {
  const { affiliate, name } = destination;

  const services = [
    {
      enabled: affiliate.flights.enabled,
      icon: Plane,
      label: `Compare Flights to ${name}`,
      href: '/flights',
      color: 'bg-ocean/8 text-ocean hover:bg-ocean/15 border-ocean/20',
    },
    {
      enabled: affiliate.hotels.enabled,
      icon: Hotel,
      label: `Find Hotels in ${name}`,
      href: '/hotels',
      color: 'bg-horizon/15 text-ink hover:bg-horizon/25 border-horizon/20',
    },
    {
      enabled: affiliate.activities.enabled,
      icon: Compass,
      label: `Things to Do in ${name}`,
      href: '/activities',
      color: 'bg-coral/8 text-coral hover:bg-coral/15 border-coral/20',
    },
    {
      enabled: affiliate.transfers.enabled,
      icon: MapPin,
      label: `Airport Transfer in ${name}`,
      href: '/airport-transfers',
      color: 'bg-ocean/8 text-ocean hover:bg-ocean/15 border-ocean/20',
    },
    {
      enabled: affiliate.carRental.enabled,
      icon: Car,
      label: `Car Rental in ${name}`,
      href: '/cars',
      color: 'bg-surface text-ink hover:bg-surface-dark border-gray-200',
    },
  ].filter((s) => s.enabled);

  if (services.length === 0) return null;

  const padClass = size === 'sm' ? 'px-3.5 py-2.5' : 'px-4 py-3';
  const iconSize = size === 'sm' ? 15 : 17;
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      {services.map((svc) => (
        <Link
          key={svc.href}
          href={svc.href}
          className={`inline-flex items-center gap-2 ${padClass} rounded-xl border font-700 ${textClass} transition-all duration-200 ${svc.color}`}
        >
          <svc.icon size={iconSize} strokeWidth={1.7} />
          {svc.label}
        </Link>
      ))}
    </div>
  );
}
