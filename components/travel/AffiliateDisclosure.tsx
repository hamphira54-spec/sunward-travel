import Link from 'next/link';

interface AffiliateDisclosureProps {
  provider?: string; // e.g. 'Klook' or 'Kiwitaxi'
  compact?: boolean; // inline one-liner vs block
  className?: string;
}

export default function AffiliateDisclosure({ provider, compact = false, className = '' }: AffiliateDisclosureProps) {
  const text = provider
    ? `Experiences on this page are provided by ${provider}. Sunward Travel may earn a commission when you book through these links, at no additional cost to you.`
    : `Sunward Travel may earn a commission when you book through partner links on this page, at no additional cost to you.`;

  if (compact) {
    return (
      <p className={`text-xs text-mist/70 ${className}`}>
        {text}{' '}
        <Link href="/affiliate-disclosure" className="underline hover:text-ocean transition-colors">
          Learn more
        </Link>
      </p>
    );
  }

  return (
    <div className={`border-t border-gray-100 pt-6 mt-2 ${className}`}>
      <p className="text-xs text-mist/70 max-w-2xl">
        {text}{' '}
        <Link href="/affiliate-disclosure" className="underline hover:text-ocean transition-colors">
          Learn more about how we earn.
        </Link>
      </p>
    </div>
  );
}
