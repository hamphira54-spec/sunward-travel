import ScrollReveal from '@/components/ui/ScrollReveal';
import { Search, ArrowLeftRight, CreditCard } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Search everything in one place',
    description:
      'Enter your destination and dates once. We search hundreds of airlines, hotel chains, and car hire companies simultaneously so you see every option side by side.',
  },
  {
    step: '02',
    icon: ArrowLeftRight,
    title: 'Compare prices & value',
    description:
      'See real prices, filter by what matters to you — flexibility, included bags, cancellation policy — and pick the deal that genuinely fits your trip.',
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Book directly with confidence',
    description:
      'Click through to book directly with the airline, hotel, or rental company. No hidden fees from us — what you see is what you pay, with the provider\'s full support.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-earth-deep" aria-labelledby="how-it-works-heading">
      <div className="container-wide">
        {/* Header */}
        <ScrollReveal className="text-center mb-14">
          <p className="text-horizon text-sm font-semibold uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="font-display font-700 text-3xl sm:text-4xl text-white"
          >
            Simple. Transparent. Free.
          </h2>
          <p className="mt-4 text-white/65 max-w-xl mx-auto leading-relaxed">
            Sunward Travel is a free comparison service — we never add booking fees or markups. Here&apos;s how it works in three steps.
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting dashed line (desktop only) */}
          <div
            className="hidden md:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px z-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to right, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 8px, transparent 8px, transparent 18px)',
            }}
            aria-hidden="true"
          />

          {STEPS.map(({ step, icon: Icon, title, description }, i) => (
            <ScrollReveal key={step} delay={i * 0.12}>
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-full bg-white/12 border-2 border-white/20 flex items-center justify-center">
                    <Icon size={28} className="text-horizon" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-horizon text-ink text-xs font-700 flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-700 text-white text-lg mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Affiliate note */}
        <ScrollReveal delay={0.4} className="mt-14 text-center">
          <p className="text-xs text-white/35 max-w-lg mx-auto">
            Sunward Travel earns a small commission when you book through our partner links — at absolutely no extra cost to you. This keeps the site free.{' '}
            <a href="/affiliate-disclosure" className="underline hover:text-white/55 transition-colors">
              Affiliate disclosure
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
