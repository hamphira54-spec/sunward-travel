import type { Metadata } from 'next';
import Image from 'next/image';
import CarSearchForm from '@/components/cars/CarSearchForm';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import TipsContent from '@/components/category/TipsContent';
import { Clock, MapPin, Shield, CreditCard, Star, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Car Rentals & Transfers — Sunward Travel',
  description:
    'Search and compare car rental deals and airport transfers worldwide. Find the best rates from Rentalcars, Kayak, Kiwitaxi and more.',
};

// ── Kiwitaxi widget URLs (brand colours applied) ───────────────────────────────
// Ocean #0D6E7A → %230D6E7A  |  Horizon #F2C04A → %23F2C04A
// Sand  #FBF8F4 → %23FBF8F4  |  Ocean-dark #095663 → %23095663

const KIWI_SHORT_SRC =
  'https://tpwdg.com/content' +
  '?currency=USD&trs=566794&shmarker=769903' +
  '&language=en&theme=1&powered_by=true' +
  '&campaign_id=1&promo_id=1486';

const KIWI_FULL_SRC =
  'https://tpwdg.com/content' +
  '?currency=USD&trs=566794&shmarker=769903' +
  '&locale=en&from=&to=&country=&powered_by=true' +
  '&transfers_limit=10' +
  '&bg_color=%23FBF8F4' +
  '&button_color=%230D6E7A' +
  '&button_font_color=%23ffffff' +
  '&button_hover_color=%23095663' +
  '&border_color=%23F2C04A' +
  '&input_font_color=%236B8A99' +
  '&input_bg_color=%23ffffff' +
  '&input_label_color=%236B8A99' +
  '&icon_bg_color=%23ffffff' +
  '&icon_arrow_color=%236c7c8c' +
  '&icon_bg_color_mobile=%23F2C04A' +
  '&icon_arrow_color_mobile=%23ffffff' +
  '&autocomplete_font_color=%231A2631' +
  '&autocomplete_bg_color=%23ffffff' +
  '&autocomplete_font_color_active=%23ffffff' +
  '&autocomplete_bg_color_active=%230D6E7A' +
  '&loader_color=%23F2C04A' +
  '&empty_color=%231A2631' +
  '&info_bg_color=%23FFF8E1' +
  '&info_icon_color=%231A2631' +
  '&info_caption_color=%231A2631' +
  '&class_background=%23ffffff' +
  '&class_font_color=%231A2631' +
  '&class_header_color=%236B8A99' +
  '&class_button_background=%230D6E7A' +
  '&class_button_font_color=%23ffffff' +
  '&class_button_background_hover=%23095663' +
  '&class_comment_background=%23E5E0DA' +
  '&class_comment_font=%236B8A99' +
  '&more_font_color=%230D6E7A' +
  '&notification_background=%23FFF8E1' +
  '&notification_border_color=%23F2C04A' +
  '&notification_color=%231A2631' +
  '&transfer_background=%23F0EDE8' +
  '&transfer_background_hover=%23E5E0DA' +
  '&transfer_font_color=%231A2631' +
  '&wtype=true' +
  '&campaign_id=1&promo_id=2949';

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
      <section className="relative h-[340px] sm:h-[380px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80"
          alt="Modern rental car parked at scenic coastal road"
          fill priority sizes="100vw" quality={80}
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/40 to-ink/90" />
        <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-xs text-horizon/80 uppercase tracking-[0.2em] font-600 mb-2">
              Sunward Travel
            </p>
            <h1 className="font-display font-700 text-4xl sm:text-5xl text-white leading-tight">
              Car Rentals &amp; Transfers
            </h1>
            <p className="mt-2 text-white/65 text-base max-w-lg">
              Compare car rentals and book airport transfers worldwide — pick up anywhere, from airports to city centres.
            </p>
          </div>
        </div>
      </section>

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
          <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
            <span className="text-xs text-white/70 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-ocean/80 flex items-center justify-center text-white text-[9px]">✓</span>
              Compare top rental brands
            </span>
            <span className="text-xs text-white/70 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-ocean/80 flex items-center justify-center text-white text-[9px]">✓</span>
              Free cancellation on most cars
            </span>
            <span className="text-xs text-white/70 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-ocean/80 flex items-center justify-center text-white text-[9px]">✓</span>
              No hidden fees
            </span>
          </div>
        </div>
      </div>

      <div className="h-10 bg-sand" />

      {/* ── Airport Transfers — Kiwitaxi quick form ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <span className="inline-block bg-horizon/20 text-ink text-[10px] font-700 uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              Airport Transfers
            </span>
            <h2 className="font-display font-700 text-2xl text-ink">Quick Shuttle Search</h2>
            <p className="text-mist text-sm mt-1">
              Book airport transfers with Kiwitaxi — fixed prices, no surge pricing
            </p>
          </div>
          <TravelpayoutsWidget src={KIWI_SHORT_SRC} />
        </div>
      </section>

      {/* ── Full Kiwitaxi transfer form ── */}
      <section className="py-12 bg-sand border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="font-display font-700 text-2xl text-ink">Detailed Transfer Search</h2>
            <p className="text-mist text-sm mt-1">
              Compare all vehicle classes — economy to premium, with driver
            </p>
          </div>
          <TravelpayoutsWidget src={KIWI_FULL_SRC} />
        </div>
      </section>

      {/* Tips */}
      <TipsContent
        heading="How to get the best car rental deal"
        intro="Car rentals are one of the most over-charged parts of travel — but a few simple habits can save you 30–50% versus booking blind."
        tips={CAR_TIPS}
      />
    </>
  );
}
