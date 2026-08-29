'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function NewsletterSignup() {
  const [email, setEmail]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // PLACEHOLDER — wire up your email provider (Mailchimp, ConvertKit, etc.) here
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section
      id="newsletter"
      className="section-padding bg-sand border-t border-surface"
      aria-labelledby="newsletter-heading"
    >
      <div className="container-wide">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ocean/10 mb-5">
              <Mail size={22} className="text-ocean" />
            </div>
            <h2
              id="newsletter-heading"
              className="font-display font-700 text-3xl text-ink"
            >
              Get the best deals first
            </h2>
            <p className="mt-3 text-mist leading-relaxed">
              Error-fare alerts, last-minute deals, and destination guides — delivered to your inbox weekly. No spam, ever.
            </p>

            {submitted ? (
              <div className="mt-8 flex items-center justify-center gap-2 text-ocean font-medium">
                <CheckCircle size={20} />
                <span>You&apos;re on the list — look out for your first deal soon!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                aria-label="Newsletter signup"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-surface-dark bg-white text-sm text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean/40"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-ocean text-white text-sm font-700 hover:bg-ocean-dark disabled:opacity-60 transition-colors shrink-0"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-mist/70">
              By subscribing you agree to our{' '}
              <a href="/privacy-policy" className="underline hover:text-mist transition-colors">
                Privacy Policy
              </a>
              . Unsubscribe anytime.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
