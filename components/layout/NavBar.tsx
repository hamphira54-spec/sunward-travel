'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  {
    label: 'Search',
    children: [
      { label: 'Flights',    href: '/flights' },
      { label: 'Hotels',     href: '/hotels' },
      { label: 'Cruises',    href: '/cruises' },
      { label: 'Car Rentals',href: '/cars' },
      { label: 'Activities', href: '/activities' },
    ],
  },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Guides',       href: '/guides' },
  { label: 'About',        href: '/about' },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ink/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-ink/70 to-transparent'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Sunward Travel — home"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ocean text-white shadow-sm group-hover:bg-ocean-light transition-colors">
              <Sun size={18} strokeWidth={2.2} />
            </span>
            <span className="font-display font-700 text-white text-lg leading-none">
              Sunward<span className="text-horizon"> Travel</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                    aria-expanded={searchOpen}
                    aria-haspopup="true"
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    {link.label}
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </button>
                  {/* Dropdown */}
                  <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 transition-all duration-200 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-ink hover:bg-ocean/5 hover:text-ocean transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/flights"
              className="px-4 py-2 rounded-lg bg-horizon text-ink text-sm font-700 hover:bg-horizon-dark transition-colors shadow-sm"
            >
              Search Deals
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ink/97 backdrop-blur-md border-t border-white/10">
          <nav className="container-wide py-4 space-y-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-1.5 text-xs font-semibold text-mist uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="block px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-white/10">
              <Link
                href="/flights"
                className="block text-center px-4 py-2.5 rounded-lg bg-horizon text-ink text-sm font-700"
                onClick={() => setMobileOpen(false)}
              >
                Search Deals
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
