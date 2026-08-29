import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import PublicLayoutShell from '@/components/layout/PublicLayoutShell';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/metadata';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Wherever the Sun Takes You`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-body bg-sand text-ink antialiased">
        <PublicLayoutShell>
          {children}
        </PublicLayoutShell>

        {/* ── Travelpayouts Drive — affiliate tracking script ───────────────────
            strategy="afterInteractive" ensures this loads after the page is
            interactive and never blocks rendering or hydration.
            data-cmp-ab="2" is required by the Travelpayouts Drive SDK.
            ─────────────────────────────────────────────────────────────────── */}
        <Script
          id="travelpayouts-drive"
          src="https://tpembars.com/NTY2Nzk0.js?t=566794"
          strategy="afterInteractive"
          data-cmp-ab="2"
        />

        {/* Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Sunward Travel',
                url: SITE_URL,
                description: SITE_DESCRIPTION,
                logo: {
                  '@type': 'ImageObject',
                  url: `${SITE_URL}/logo.png`,
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Sunward Travel',
                url: SITE_URL,
                description: SITE_DESCRIPTION,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${SITE_URL}/flights?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
