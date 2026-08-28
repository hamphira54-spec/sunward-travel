import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CarSearchForm from '@/components/cars/CarSearchForm';
import TipsContent from '@/components/category/TipsContent';
import TravelHero from '@/components/travel/TravelHero';
import SectionHeading from '@/components/ui/SectionHeading';
import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';
import { Clock, MapPin, Shield, CreditCard, Star, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Car Rentals Worldwide | Sunward Travel',
  description:
    'Search and compare car rental deals worldwide. Find the best rates from Rentalcars, Kayak, DiscoverCars and more — pick up at airports, city centres, and 50,000+ locations.',
};

// ── Tips ──────────────────────────────────────────────────────────────────────
const CAR_TIPS = [
  {
    icon: Clock,
    heading: 'Book at least 2 weeks ahead for the best rates',
    body: 'Car rental prices fluctuate like airline tickets. Booking early locks in lower rates, especially for popular destinations in peak season.',
  },
  {
    icon: MapPin,
    heading: 'Airport rentals vs city-centre pick-up',
    body: 'Airport locations are convenient but often carry a 10–20% surcharge. If your hotel is central, consider picking up from a city-centre office instead.',
  },
  {
    icon: Shield,
    heading: 'Understand insurance before you click pay',
    body: 'Rental companies push expensive daily insurance add-ons. Check if your credit card or travel insurance already covers collision damage — most premium cards do.',
  },
  {
    icon: CreditCard,
    heading: 'Use a credit card, not a debit card',
    body: 'Most rental companies require a credit card for the security deposit. Using a debit card can result in a large hold on your account for several weeks.',
  },
  {
    icon: Star,
    heading: 'Book the smallest category you need',
    body: "You can often upgrade on arrival if larger cars are over-supplied. Booking economy saves money — upgrading is free or cheap at the desk.",
  },
  {
    icon: FileText,
    heading: 'Read the fine print on mileage limits',
    body: 'Some "unlimited mileage" deals have hidden caps. If you are doing a long road trip, verify the mileage policy before collecting the keys.',
  },
];

export default function CarsPage() {
  return (
    <>
      {/* ── Hero — overflow-hidden scoped to image only ── */}
      <TravelHero
        imageSrc="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80"
        imageAlt="Modern rental car at scenic coastal road"
        eyebrow="Sunward Travel"
        heading="Compare Car Rentals"
        description="Search the best car rental rates worldwide — pick up at airports, city centres, and 50,000+ locations."
        height="md"
      />

      {/* ── Search card — outside hero, overlaps via -mt-14 ── */}
      <div className="relative z-20 -mt-14 pb-2">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(13,110,122,0.22),0_4px_16px_-4px_rgba(0,0,0,0.10)] border border-white/80">
            <div className="flex items-center gap-3 px-6 pt-5 pb-0 border-b border-gray-100">
              <div className="w-1.5 h-6 rounded-full bg-ocean" />
              <p className="font-display font-700 text-ink text-sm tracking-wide">
                Where are you picking up?
              </p>
            </div>
            <div className="p-2 sm:p-3">
              <CarSearchForm />
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-4 flex-wrap">
            {['Compare top rental brands', 'No hidden fees', 'Free cancellation on most cars'].map((label) => (
              <span key={label} className="text-xs text-ink/55 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-ocean/80 flex items-center justify-center text-white text-[9px]">✓</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="h-12 bg-sand" />

      {/* ── Airport Transfer Cross-sell ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-ocean/5 border border-ocean/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-ocean flex items-center justify-center text-white shrink-0">
              <MapPin size={22} strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-700 text-ink text-lg mb-1">
                Need an airport transfer instead?
              </h2>
              <p className="text-mist text-sm">
                Book a private airport transfer with a professional driver — fixed prices,
                no meter, flight tracking included.
              </p>
            </div>
            <Link
              href="/airport-transfers"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean text-white font-display font-700 text-sm hover:bg-ocean-dark transition-colors whitespace-nowrap shrink-0"
            >
              Find Transfers <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Tips */}
      <TipsContent
        heading="How to get the best car rental deal"
        intro="Car rentals are one of the most over-charged parts of travel — but a few simple habits can save you 30–50% versus booking blind."
        tips={CAR_TIPS}
      />
      <section className="py-8 bg-sand border-t border-gray-100">
        <div className="page-container">
          <AffiliateDisclosure />
        </div>
      </section>
    </>
  );
}
