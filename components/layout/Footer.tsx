import Link from 'next/link';
import { Sun } from 'lucide-react';

const TRAVEL_SERVICES = [
  { label: 'Flights',           href: '/flights' },
  { label: 'Hotels',            href: '/hotels' },
  { label: 'Things to Do',      href: '/activities' },
  { label: 'Airport Transfers', href: '/airport-transfers' },
  { label: 'Car Rental',        href: '/cars' },
  { label: 'Cruises',           href: '/cruises' },
];

const EXPLORE_LINKS = [
  { label: 'Destinations',  href: '/destinations' },
  { label: 'Travel Guides', href: '/guides' },
];

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact',  href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy',       href: '/privacy-policy' },
  { label: 'Terms of Use',         href: '/terms-of-use' },
  { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
];

const COLUMNS = [
  { title: 'Travel Services', links: TRAVEL_SERVICES },
  { title: 'Explore',         links: EXPLORE_LINKS },
  { title: 'Company',         links: COMPANY_LINKS },
  { title: 'Legal',           links: LEGAL_LINKS },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white" aria-label="Site footer">
      <div className="page-container py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4" aria-label="Sunward Travel">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ocean text-white">
                <Sun size={16} strokeWidth={2.2} />
              </span>
              <span className="font-display font-700 text-white text-lg">
                Sunward<span className="text-horizon">Travel</span>
              </span>
            </Link>
            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              Compare flights, hotels, transfers, and activities worldwide.
              Find better deals, plan smarter trips.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-[10px] font-700 text-white/35 uppercase tracking-[0.18em] mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>&copy; {year} Sunward Travel. All rights reserved.</p>
          <p className="text-center sm:text-right max-w-sm">
            Sunward Travel participates in affiliate programs. When you book through our links, we may earn a commission at no extra cost to you.{' '}
            <Link href="/affiliate-disclosure" className="underline hover:text-white/55 transition-colors">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
