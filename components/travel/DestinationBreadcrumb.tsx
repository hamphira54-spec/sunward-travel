import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface DestinationBreadcrumbProps {
  crumbs: Crumb[];
  light?: boolean; // white text for dark backgrounds
  className?: string;
}

export default function DestinationBreadcrumb({ crumbs, light = false, className = '' }: DestinationBreadcrumbProps) {
  const textBase = light ? 'text-white/60 hover:text-white' : 'text-mist hover:text-ocean';
  const sep = light ? 'text-white/30' : 'text-gray-300';
  const current = light ? 'text-white/85' : 'text-ink';

  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1 text-xs ${className}`}>
      <ol className="flex flex-wrap items-center gap-1 list-none p-0 m-0">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} className={sep} aria-hidden="true" />}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className={`transition-colors font-medium ${textBase}`}>
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? `font-700 ${current}` : textBase} aria-current={isLast ? 'page' : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
