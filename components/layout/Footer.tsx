import Link from 'next/link';
import { Sun, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const FOOTER_LINKS = {
  Search: [
    { label: 'Flights',     href: '/flights' },
    { label: 'Hotels',      href: '/hotels' },
    { label: 'Cruises',     href: '/cruises' },
    { label: 'Car Rentals', href: '/cars' },
  ],
  Destinations: [
    { label: 'Asia',     href: '/destinations?region=asia' },
    { label: 'Europe',   href: '/destinations?region=europe' },
    { label: 'Americas', href: '/destinations?region=americas' },
    { label: 'Africa',   href: '/destinations?region=africa' },
  ],
  Company: [
    { label: 'About Us',  href: '/about' },
    { label: 'Contact',   href: '/contact' },
    { label: 'Guides',    href: '/guides' },
    { label: 'Newsletter',href: '#newsletter' },
  ],
  Legal: [
    { label: 'Privacy Policy',      href: '/privacy-policy' },
    { label: 'Affiliate Disclosure',href: '/affiliate-disclosure' },
    { label: 'Terms of Use',        href: '/terms-of-use' },
  ],
};

const SOCIAL = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Twitter / X', icon: Twitter, href: '#' },
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white" aria-label="Site footer">
      {/* Main footer grid */}
      <div className="container-wide py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4" aria-label="Sunward Travel">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ocean text-white">
                <Sun size={16} strokeWidth={2.2} />
              </span>
              <span className="font-display font-700 text-white text-lg">
                Sunward<span className="text-horizon"> Travel</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Wherever the sun takes you — we help you get there for less. Comparing flights, hotels, and more, worldwide.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {SOCIAL.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center hover:bg-ocean transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
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
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© {year} Sunward Travel. All rights reserved.</p>
          <p className="text-center sm:text-right max-w-md">
            {/* AFFILIATE DISCLOSURE PLACEHOLDER — update before launch */}
            Sunward Travel participates in affiliate programs. When you book through our links, we may earn a commission at no extra cost to you.{' '}
            <Link href="/affiliate-disclosure" className="underline hover:text-white/60 transition-colors">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
