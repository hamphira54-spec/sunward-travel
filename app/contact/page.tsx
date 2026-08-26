'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';

// Note: metadata must be exported from a Server Component.
// Since this needs 'use client' for the form, metadata is defined in a
// separate layout or you can split the page. For simplicity, metadata is
// handled in layout.tsx for this route — add it there if needed.

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // PLACEHOLDER — wire in your form handler (Formspree, Resend, etc.)
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-sand">
      <div className="container-wide max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-ocean text-sm font-semibold uppercase tracking-widest mb-3">Get in touch</p>
          <h1 className="font-display font-700 text-4xl text-ink">Contact Us</h1>
          <p className="mt-3 text-mist leading-relaxed">
            Questions, partnership enquiries, or editorial suggestions — we&apos;d love to hear from you. We typically respond within 1–2 business days.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-xl p-5 shadow-[var(--shadow-card)] flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-ocean/10 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-ocean" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">General Enquiries</p>
              <p className="text-xs text-mist mt-1">hello@sunwardtravel.com</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-[var(--shadow-card)] flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
              <MessageSquare size={18} className="text-coral" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Partnership &amp; Affiliates</p>
              <p className="text-xs text-mist mt-1">partners@sunwardtravel.com</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-7">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-8 gap-3">
              <CheckCircle size={40} className="text-ocean" />
              <h2 className="font-display font-700 text-xl text-ink">Message received!</h2>
              <p className="text-mist text-sm">We&apos;ll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-ink mb-1.5">
                    Name <span className="text-coral">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean/40 bg-sand"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-ink mb-1.5">
                    Email <span className="text-coral">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean/40 bg-sand"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-ink mb-1.5">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/40 bg-sand"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General enquiry</option>
                  <option value="partnership">Partnership / affiliate</option>
                  <option value="editorial">Editorial suggestion</option>
                  <option value="press">Press &amp; media</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-ink mb-1.5">
                  Message <span className="text-coral">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-ink placeholder:text-mist focus:outline-none focus:ring-2 focus:ring-ocean/40 bg-sand resize-none"
                  placeholder="Tell us how we can help…"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-ocean text-white font-700 text-sm hover:bg-ocean-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
