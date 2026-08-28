'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, ChevronDown, Plane, Hotel, Compass, Car, Ship, MapPin } from 'lucide-react';

const EXPLORE_ITEMS = [
  { label: 'Flights',           href: '/flights',           icon: Plane    },
  { label: 'Hotels',            href: '/hotels',            icon: Hotel    },
  { label: 'Things to Do',      href: '/activities',        icon: Compass  },
  { label: 'Airport Transfers', href: '/airport-transfers', icon: MapPin   },
  { label: 'Car Rental',        href: '/cars',              icon: Car      },
  { label: 'Cruises',           href: '/cruises',           icon: Ship     },
];

const NAV_LINKS = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Guides',       href: '/guides' },
  { label: 'About',        href: '/about' },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close explore on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    }
    if (exploreOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [exploreOpen]);

  // Close on Escape
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setExploreOpen(false); setMobileOpen(false); }
  }, []);

  // Close mobile on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      onKeyDown={handleKeyDown}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ink/96 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-ink/65 to-transparent'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="Sunward Travel — home">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ocean text-white shadow-sm group-hover:bg-ocean-light transition-colors">
              <Sun size={17} strokeWidth={2.2} />
            </span>
            <span className="font-display font-700 text-white text-lg leading-none">
              Sunward<span className="text-horizon">Travel</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">

            {/* Explore dropdown */}
            <div ref={exploreRef} className="relative">
              <button
                aria-expanded={exploreOpen}
                aria-haspopup="true"
                aria-controls="explore-menu"
                onClick={() => setExploreOpen(v => !v)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 transition-all"
              >
                Explore
                <ChevronDown size={14} className={`transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {exploreOpen && (
                <div
                  id="explore-menu"
                  role="menu"
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                >
                  {EXPLORE_ITEMS.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setExploreOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-ocean/5 hover:text-ocean transition-colors"
                    >
                      <Icon size={15} className="text-mist" strokeWidth={1.8} />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Static links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/flights"
              className="px-4 py-2 rounded-xl bg-horizon text-ink text-sm font-700 hover:bg-horizon-dark transition-colors shadow-sm"
            >
              Search Deals
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-ink/97 backdrop-blur-md border-t border-white/10"
        >
          <nav className="page-container py-4 space-y-1" aria-label="Mobile navigation">

            {/* Explore accordion */}
            <div>
              <button
                onClick={() => setMobileExploreOpen(v => !v)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-white/85 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
              >
                <span>Explore</span>
                <ChevronDown size={14} className={`text-mist transition-transform ${mobileExploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileExploreOpen && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {EXPLORE_ITEMS.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                    >
                      <Icon size={14} className="text-mist" strokeWidth={1.8} />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm text-white/85 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-white/10">
              <Link
                href="/flights"
                className="block text-center px-4 py-3 rounded-xl bg-horizon text-ink text-sm font-700 hover:bg-horizon-dark transition-colors"
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
