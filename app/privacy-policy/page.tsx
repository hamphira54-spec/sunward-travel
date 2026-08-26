import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Sunward Travel privacy policy — how we collect, use, and protect your personal data.',
};

const LAST_UPDATED = 'August 2025';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-20 bg-sand min-h-screen">
      <div className="container-wide max-w-3xl">
        <div className="mb-8">
          <span className="text-xs text-mist">Last updated: {LAST_UPDATED}</span>
          <h1 className="font-display font-700 text-4xl text-ink mt-2">Privacy Policy</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 space-y-6 text-sm text-ink/80 leading-relaxed">
          {[
            {
              title: 'Introduction',
              body: `Sunward Travel ("we," "us," or "our") operates the website at sunwardtravel.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read it carefully. If you disagree with the terms of this policy, please discontinue use of the site.`,
            },
            {
              title: 'Information We Collect',
              body: `We may collect information you voluntarily provide, such as your email address when signing up for our newsletter or submitting a contact form. We also automatically collect certain technical data when you visit our site, including IP address, browser type, pages visited, and time spent on pages, via cookies and analytics tools (such as Google Analytics).`,
            },
            {
              title: 'How We Use Your Information',
              body: `We use the information we collect to: operate and improve the website; send you newsletters and travel deal alerts (with your consent); respond to enquiries; analyse usage patterns to improve user experience; and comply with legal obligations.`,
            },
            {
              title: 'Cookies and Tracking Technologies',
              body: `We use cookies and similar tracking technologies to analyse website traffic and user behaviour. Affiliate partner links may use their own tracking technologies. You can control cookie settings through your browser preferences. Disabling cookies may affect some site functionality.`,
            },
            {
              title: 'Third-Party Links and Affiliate Partners',
              body: `Our website contains links to third-party websites operated by our affiliate partners (e.g. airlines, hotels, booking platforms). We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit through our links.`,
            },
            {
              title: 'Data Retention',
              body: `We retain personal data only as long as necessary for the purposes described in this policy, or as required by law. Newsletter subscribers can unsubscribe at any time.`,
            },
            {
              title: 'Your Rights',
              body: `Depending on your jurisdiction, you may have rights including: access to your personal data; correction of inaccurate data; deletion of your data; objection to processing; and data portability. To exercise these rights, contact us at hello@sunwardtravel.com.`,
            },
            {
              title: 'Contact',
              body: `For questions about this Privacy Policy, email us at hello@sunwardtravel.com.`,
            },
          ].map(({ title, body }) => (
            <section key={title}>
              <h2 className="font-display font-700 text-lg text-ink mb-2">{title}</h2>
              <p>{body}</p>
            </section>
          ))}

          <div className="bg-horizon/10 border border-horizon/30 rounded-lg p-4 text-xs text-ink/60">
            <strong>⚠ Pre-launch note:</strong> This is placeholder privacy policy text. Have a qualified legal professional review, customise to your actual data practices, and finalise before public launch.
          </div>
        </div>
      </div>
    </div>
  );
}
