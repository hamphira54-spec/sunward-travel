import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/metadata';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
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
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-body bg-sand text-ink antialiased">
        <NavBar />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />

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
      </body>
    </html>
  );
}
