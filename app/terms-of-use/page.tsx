import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Sunward Travel terms of use — the rules governing your use of our website and services.',
};

const LAST_UPDATED = 'August 2025';

export default function TermsOfUsePage() {
  return (
    <div className="pt-24 pb-20 bg-sand min-h-screen">
      <div className="container-wide max-w-3xl">
        <div className="mb-8">
          <span className="text-xs text-mist">Last updated: {LAST_UPDATED}</span>
          <h1 className="font-display font-700 text-4xl text-ink mt-2">Terms of Use</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 space-y-6 text-sm text-ink/80 leading-relaxed">
          {[
            {
              title: 'Agreement to Terms',
              body: `By accessing or using Sunward Travel ("the Site"), you agree to be bound by these Terms of Use. If you do not agree to these terms, do not use the Site. We reserve the right to modify these terms at any time; continued use after changes constitutes acceptance.`,
            },
            {
              title: 'Use of the Site',
              body: `You may use the Site for lawful personal, non-commercial purposes only. You agree not to: use the Site in any way that violates applicable laws; attempt to gain unauthorized access to any part of the Site; transmit spam or malware; or reproduce, distribute, or commercially exploit our content without written permission.`,
            },
            {
              title: 'Affiliate Links and Third-Party Content',
              body: `The Site contains affiliate links to third-party booking platforms. We are not a booking agency and do not process reservations directly. All bookings are made with and governed by the terms of the third-party provider. We are not responsible for pricing accuracy, availability, or any issues arising from third-party bookings.`,
            },
            {
              title: 'Disclaimer of Warranties',
              body: `The Site is provided "as is" without warranty of any kind. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses. Travel information (prices, availability, schedules) is provided for informational purposes and may change without notice. Always verify information directly with the travel provider before booking.`,
            },
            {
              title: 'Limitation of Liability',
              body: `To the fullest extent permitted by applicable law, Sunward Travel shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or any third-party services accessed through it.`,
            },
            {
              title: 'Intellectual Property',
              body: `All content on the Site — including text, images, graphics, and design — is owned by or licensed to Sunward Travel and protected by applicable copyright and trademark laws. You may not reproduce or distribute content without our explicit written permission.`,
            },
            {
              title: 'Governing Law',
              body: `These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Sunward Travel is registered, without regard to its conflict of law provisions.`,
            },
            {
              title: 'Contact',
              body: `Questions about these Terms of Use? Contact us at hello@sunwardtravel.com.`,
            },
          ].map(({ title, body }) => (
            <section key={title}>
              <h2 className="font-display font-700 text-lg text-ink mb-2">{title}</h2>
              <p>{body}</p>
            </section>
          ))}

          <div className="bg-horizon/10 border border-horizon/30 rounded-lg p-4 text-xs text-ink/60">
            <strong>⚠ Pre-launch note:</strong> This is placeholder terms text. Have a qualified legal professional review and finalise before public launch.
          </div>
        </div>
      </div>
    </div>
  );
}
