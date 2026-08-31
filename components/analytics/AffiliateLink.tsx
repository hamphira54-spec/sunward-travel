'use client';
import { trackAffiliateClick } from '@/lib/analytics/events';
import type { BaseEventParams } from '@/lib/analytics/types';
import Link from 'next/link';

interface AffiliateLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  provider: string;
  placement: string;
  href: string;
  params?: Omit<BaseEventParams, 'provider' | 'placement'>;
}

export default function AffiliateLink({ 
  provider, 
  placement, 
  href, 
  params, 
  children, 
  onClick,
  ...rest 
}: AffiliateLinkProps) {
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      trackAffiliateClick(provider, placement, params);
    } catch (err) {
      // Never block navigation
      console.error('Analytics tracking failed', err);
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
