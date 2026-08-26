import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'Sunward Travel affiliate disclosure — how we earn commissions and how this affects our editorial independence.',
};

const LAST_UPDATED = 'August 2025';

export default function AffiliateDisclosurePage() {
  return (
    <div className="pt-24 pb-20 bg-sand min-h-screen">
      <div className="container-wide max-w-3xl">
        <div className="mb-8">
          <span className="text-xs text-mist">Last updated: {LAST_UPDATED}</span>
          <h1 className="font-display font-700 text-4xl text-ink mt-2">Affiliate Disclosure</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 prose-styles space-y-6 text-sm text-ink/80 leading-relaxed">
          <section>
            <h2 className="font-display font-700 text-lg text-ink mb-2">Our Relationship with Affiliate Partners</h2>
            <p>
              Sunward Travel participates in affiliate marketing programs operated by third-party travel companies including, but not limited to, airlines, hotel booking platforms, car rental providers, cruise lines, and online travel agencies (OTAs). These programs are operated by companies such as Travelpayouts, Booking.com Partner Programme, Expedia Affiliate Network (EAN), and others.
            </p>
          </section>

          <section>
            <h2 className="font-display font-700 text-lg text-ink mb-2">How We Earn Commissions</h2>
            <p>
              When you click on certain links on Sunward Travel and subsequently make a purchase or booking with one of our affiliate partners, Sunward Travel may receive a commission from that partner. This commission is paid by the partner, not by you — you pay exactly the same price whether you book through our link or go directly to the provider&apos;s website.
            </p>
            <p>
              Commission rates vary by partner and booking type, typically ranging from 1% to 10% of the booking value for travel products.
            </p>
          </section>

          <section>
            <h2 className="font-display font-700 text-lg text-ink mb-2">Editorial Independence</h2>
            <p>
              Our participation in affiliate programs does not influence our editorial content or recommendations. We do not accept payment for positive reviews, nor do we give preferential treatment to partners who offer higher commissions. Our goal is to provide accurate, useful information that helps you make the best travel decisions.
            </p>
            <p>
              Where a link is an affiliate link, we may indicate this. Where content references a partner, we will strive to note this clearly.
            </p>
          </section>

          <section>
            <h2 className="font-display font-700 text-lg text-ink mb-2">Compliance</h2>
            <p>
              This disclosure is provided in accordance with the United States Federal Trade Commission (FTC) guidelines on endorsements and testimonials (16 CFR Part 255) and equivalent regulations in other jurisdictions including the UK Advertising Standards Authority (ASA) and EU consumer protection rules.
            </p>
          </section>

          <section>
            <h2 className="font-display font-700 text-lg text-ink mb-2">Questions</h2>
            <p>
              If you have any questions about our affiliate relationships or this disclosure, please contact us at{' '}
              <a href="mailto:hello@sunwardtravel.com" className="text-ocean underline">
                hello@sunwardtravel.com
              </a>
              .
            </p>
          </section>

          {/* PLACEHOLDER — have a lawyer review before launch */}
          <div className="bg-horizon/10 border border-horizon/30 rounded-lg p-4 text-xs text-ink/60">
            <strong>⚠ Pre-launch note:</strong> This is placeholder disclosure text intended for affiliate program applications. Have a qualified legal professional review and finalise this document before public launch.
          </div>
        </div>
      </div>
    </div>
  );
}
