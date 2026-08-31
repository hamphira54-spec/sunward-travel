'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or denied
    const consent = localStorage.getItem('sunward_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'accepted') {
      // If accepted, we can notify GA4 that consent is granted
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sunward_cookie_consent', 'accepted');
    setShowBanner(false);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem('sunward_cookie_consent', 'rejected');
    setShowBanner(false);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-ink text-white z-50 shadow-lg border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-mist max-w-4xl text-center md:text-left">
        We use analytics cookies to understand how you interact with our site. This helps us improve our content and recommendations. 
        Read our <Link href="/privacy" className="underline text-white hover:text-ocean transition-colors">Privacy Policy</Link> for details.
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={handleReject}
          className="px-4 py-2 text-sm font-500 rounded-lg bg-transparent border border-mist text-white hover:bg-white/10 transition-colors focus:ring-2 focus:ring-ocean focus:outline-none"
        >
          Reject All
        </button>
        <button 
          onClick={handleAccept}
          className="px-4 py-2 text-sm font-700 rounded-lg bg-ocean text-white hover:bg-ocean-dark transition-colors shadow-sm focus:ring-2 focus:ring-white focus:outline-none"
        >
          Accept Analytics
        </button>
      </div>
    </div>
  );
}
